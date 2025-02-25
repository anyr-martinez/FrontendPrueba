import React, { useEffect, useState } from "react";
import { EquipmentContext } from "./EquipmentContext";
import { AxiosPrivado } from "../../Axios/Axios";
import { ListarEquipos, CrearEquipo } from "../../Configuration/ApiUrls";
import { useContextUsuario } from "../user/UserContext";

export const EquipmentState = (props) => {
    const { token } = useContextUsuario();
    const [equipo, setEquipo] = useState(null);
    const [listaEquipos, setListaEquipos] = useState([]);
    const [actualizar, setActualizar] = useState(false);

    useEffect(() => {
        ListaEquipos();
    }, []);

    const ListaEquipos = async () => {
        try {
            await ActualizarLista(ListarEquipos, setListaEquipos);
        } catch (error) {
            console.log("Error al listar equipos:", error);
        }
    };

    const ActualizarLista = async (url, setDatos) => {
        AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const respuesta = await AxiosPrivado.get(url);
            const data = respuesta.data;

            try {
                const parsedData = JSON.parse(data);
                setDatos(parsedData);
            } catch (error) {
                console.error("Error al parsear los datos:", error);
            }
        } catch (error) {
            console.log("Error al hacer la petición:", error);
        }
    };

    //**Función para crear un nuevo equipo**
    const CrearEquipo = async (nuevoEquipo) => {
        AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const respuesta = await AxiosPrivado.post(CrearEquipo, nuevoEquipo);
            if (respuesta.status === 201 || respuesta.status === 200) {
                setActualizar(true);
                await ListaEquipos(); // Recargar la lista de equipos después de crear
                return { success: true, message: "Equipo creado correctamente" };
            }
        } catch (error) {
            console.log("Error al crear equipo:", error);
            return { success: false, message: error.response?.data?.message || "Error al guardar el equipo" };
        }
    };

    return (
        <EquipmentContext.Provider value={{
            equipo,
            listaEquipos,
            actualizar,
            setActualizar,
            setEquipo,
            setListaEquipos,
            ListaEquipos,
            ActualizarLista,
            CrearEquipo,
        }}>
            {props.children}
        </EquipmentContext.Provider>
    );
};
