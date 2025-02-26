import React, { useState, useEffect } from "react";
import { EquipmentContext } from "./EquipmentContext";
import { AxiosPrivado } from "../../Axios/Axios";
import { ListarEquipos, GuardarEquipo } from "../../Configuration/ApiUrls";
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
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const respuesta = await AxiosPrivado.get(ListarEquipos);
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

  return (
    <EquipmentContext.Provider
      value={{
        equipo,
        listaEquipos,
        setEquipo,
        setListaEquipos,
        ActualizarLista,
        CrearEquipo,
      }}
    >
      {props.children}
    </EquipmentContext.Provider>
  );
};
