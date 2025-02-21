import React, { createContext, useState, useEffect, useContext } from "react";
import { AxiosPrivado } from "../../Axios/Axios"; 
import { useContextUsuario } from "../user/UserContext"; 
import { ListarEquipos, CrearEquipo, ObtenerEquipoPorId, ActualizarEquipo, EliminarEquipo, ObtenerEquipoById } from "../../Configuration/ApiUrls";

export const equipmentContext = createContext();

export const useContextEquipment = () => {
  return useContext(equipmentContext);
};

export const EquipoState = (props) => {
  const { token } = useContextUsuario();  // Obtener el token desde el contexto del usuario
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [actualizar, setActualizar] = useState(false);

  useEffect(() => {
    ListarEquipos();
  }, []);

  const ListarEquipos = async () => {
    try {
      AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const respuesta = await AxiosPrivado.get(ListarEquipos);
      setEquipos(respuesta.data);
    } catch (error) {
      console.log("Error al obtener los equipos:", error);
    }
  };

  const ObtenerEquipoById = async (id) => {
    try {
      AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const respuesta = await AxiosPrivado.get(`${ObtenerEquipoById}/${id}`);
      setEquipoSeleccionado(respuesta.data);
    } catch (error) {
      console.log("Error al obtener el equipo:", error);
    }
  };

  const CrearEquipo = async (equipo) => {
    try {
      AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const respuesta = await AxiosPrivado.post(CrearEquipo, equipo);
      setEquipos([...equipos, respuesta.data]); // Añadir el nuevo equipo a la lista
    } catch (error) {
      console.log("Error al crear el equipo:", error);
    }
  };

  const ActualizarEquipo = async (equipo) => {
    try {
      AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const respuesta = await AxiosPrivado.put(`${ActualizarEquipo}/${equipo.id}`, equipo);
      const nuevosEquipos = equipos.map((eq) => (eq.id === equipo.id ? respuesta.data : eq));
      setEquipos(nuevosEquipos);
    } catch (error) {
      console.log("Error al actualizar el equipo:", error);
    }
  };

  const EliminarEquipo = async (id) => {
    try {
      AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AxiosPrivado.delete(`${EliminarEquipo}/${id}`);
      const equiposFiltrados = equipos.filter((eq) => eq.id !== id);
      setEquipos(equiposFiltrados);
    } catch (error) {
      console.log("Error al eliminar el equipo:", error);
    }
  };

  return (
    <equipmentContext.Provider value={{
      CrearEquipo,
      ListarEquipos,
      ObtenerEquipoById,
      ActualizarEquipo,
      EliminarEquipo,
      setActualizar
    
    }}>
      {props.children}
    </equipmentContext.Provider>
  );
};
