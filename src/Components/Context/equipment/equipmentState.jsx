import React, { useState, useEffect } from "react";
import { EquipmentContext } from "./EquipmentContext";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { ListarEquipos, GuardarEquipo,EliminarEquipo } from "../../Configuration/ApiUrls";
import { useContextUsuario } from "../user/UserContext";

export const EquipmentState = (props) => {
  const { token } = useContextUsuario();
  const [equipo, setEquipo] = useState(null);
  const [listaEquipos, setListaEquipos] = useState([]);

  // Cargar lista de equipos cuando el componente se monta
  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        await ActualizarLista();
      } catch (error) {
        console.log("Error al cargar equipos:", error);
      }
    };

    cargarEquipos();
  }, []);

  // Función para obtener la lista de equipos
  const ActualizarLista = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarEquipos);
      const data = respuesta.data;
      setListaEquipos(data); // Asume que la respuesta ya es un array de equipos
    } catch (error) {
      console.log("Error al listar equipos:", error);
    }
  };

  // Función para crear un nuevo equipo
  const CrearEquipo = async (nuevoEquipo) => {
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const respuesta = await AxiosPrivado.post(GuardarEquipo, nuevoEquipo);
      if (respuesta.status === 201 || respuesta.status === 200) {
        await ActualizarLista(); // Recargar la lista de equipos después de crear
        return { success: true, message: "Equipo creado correctamente" };
      }
    } catch (error) {
      console.log("Error al crear equipo:", error);
      return { success: false, message: error.response?.data?.message || "Error al guardar el equipo" };
    }
  };

  // Función para eliminar un equipo
  const DeleteEquipo = async (id) => {
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      // Modificar la URL para incluir el ID en la solicitud DELETE
      const respuesta = await AxiosPrivado.delete(`${EliminarEquipo}/${id}`);
      
      if (respuesta.status === 200 || respuesta.status === 201) {
        await ActualizarLista();
        return { success: true, message: "Equipo Eliminado Correctamente" };
      }
    } catch (error) {
      console.log("Error al eliminar el equipo: ", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar el equipo" };
    }
  };  

  // Función para actualizar los datos de un equipo
  const ActualizarEquipo = async (id_equipo, equipoActualizado) => {
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const respuesta = await AxiosPrivado.put(`${ActualizarEquipo}/${id_equipo}`, equipoActualizado);
      if (respuesta.status === 200) {
        await ActualizarLista(); // Recargar la lista de equipos después de actualizar
        return { success: true, message: "Equipo actualizado correctamente" };
      }
    } catch (error) {
      console.log("Error al actualizar el equipo:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar el equipo" };
    }
  };


  return (
    <EquipmentContext.Provider
      value={{
        equipo,
        listaEquipos,
        setEquipo,
        setListaEquipos,
        ActualizarLista,
        CrearEquipo,
        DeleteEquipo,
        ActualizarEquipo,
      }}
    >
      {props.children}
    </EquipmentContext.Provider>
  );
};
