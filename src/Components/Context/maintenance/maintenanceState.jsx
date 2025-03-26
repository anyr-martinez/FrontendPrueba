import React, { useState, useEffect } from "react";
import { MaintenanceContext } from "../maintenance/MaintenanceContext";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { ListarMantenimientos,EliminarMantenimiento, GuardarMantenimiento } from "../../Configuration/ApiUrls";
import { useContextUsuario } from "../user/UserContext";

export const MaintenanceState = (props) => {
  const { token } = useContextUsuario();
  const [mantenimiento, setMantenimiento] = useState(null);
  const [listaMantenimientos, setListaMantenimiento] = useState([]);

  // Cargar lista de equipos cuando el componente se monta
  useEffect(() => {
    const cargarMantenimientos = async () => {
      try {
        await ActualizarLista();
      } catch (error) {
        console.log("Error al cargar Mantenimientos:", error);
      }
    };

    cargarMantenimientos();
  }, []);

  // Función para obtener la lista de equipos
  const ActualizarLista = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarMantenimientos);
      const data = respuesta.data;
      setListaMantenimiento(data); 
    } catch (error) {
      console.log("Error al listar mantenimientos:", error);
    }
  };

  // Función para crear un nuevo equipo
  const CrearMantenimiento = async (nuevoMantenimiento, token, equipoId) => {
    // Asignamos el token a la cabecera de la solicitud
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    nuevoMantenimiento.id_equipo = equipoId;
    
    try {
      // Realizamos la solicitud POST para crear el mantenimiento
      const respuesta = await AxiosPrivado.post(GuardarMantenimiento, nuevoMantenimiento);
      
      // Verificamos la respuesta del servidor
      if (respuesta.status === 201 || respuesta.status === 200) {
        
        await ActualizarLista();
        
        return { success: true, message: "Mantenimiento creado correctamente" };
      } else {
        // En caso de que la respuesta no sea exitosa
        return { success: false, message: "Error al guardar el mantenimiento" };
      }
    } catch (error) {
      console.log("Error al crear mantenimiento:", error);
      
      // Si ocurre un error, retornamos el mensaje adecuado
      return {
        success: false,
        message: error.response?.data?.message || "Error al guardar el mantenimiento",
      };
    }
  };
  

  // Función para eliminar un equipo
  const DeleteMantenimiento = async (id) => {
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      // Modificar la URL para incluir el ID en la solicitud DELETE
      const respuesta = await AxiosPrivado.delete(`${EliminarMantenimiento	}/${id}`);
      
      if (respuesta.status === 200 || respuesta.status === 201) {
        await ActualizarLista();
        return { success: true, message: "Mantenimiento Eliminado Correctamente" };
      }
    } catch (error) {
      console.log("Error al eliminar el Mantenimiento: ", error);
      return { success: false, message: error.response?.data?.message || "Error al eliminar el mantenimiento" };
    }
  };  

  // Función para actualizar los datos de un equipo
  const ActualizarMantenimiento = async (id_mantenimiento, mantenimientoActualizado) => {
    AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const respuesta = await AxiosPrivado.put(`${ActualizarMantenimiento}/${id_mantenimiento}`, mantenimientoActualizado);
      if (respuesta.status === 200) {
        await ActualizarLista(); 
        return { success: true, message: "Mantenimiento actualizado correctamente" };
      }
    } catch (error) {
      console.log("Error al actualizar el mantenimiento:", error);
      return { success: false, message: error.response?.data?.message || "Error al actualizar el mantenimiento" };
    }
  };


  return (
    <MaintenanceContext.Provider
      value={{
        mantenimiento,
        listaMantenimientos,
        setMantenimiento,
        setListaMantenimiento,
        ActualizarLista,
        CrearMantenimiento,
        DeleteMantenimiento,
        ActualizarMantenimiento,
      }}
    >
      {props.children}
    </MaintenanceContext.Provider>
  );
};
