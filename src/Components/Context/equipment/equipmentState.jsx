import React, { useEffect, useState } from "react";
import { EquipmentContext } from "./equipmentContext";
import { AxiosPrivado } from "../../Axios/Axios";
import { ListarEquipos } from "../../Configuracion/ApiUrls";
import { useContextUsuario } from "../usuario/UsuarioContext";

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
            ActualizarLista(ListarEquipos, setListaEquipos);
        } catch (error) {
            console.log(error);
        }
    };

    const ActualizarLista = async (url, setDatos) => {
        AxiosPrivado.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            await AxiosPrivado.get(url)
                .then((respuesta) => {
                    setDatos(respuesta.data); // Asumiendo que la respuesta tiene una propiedad 'data'
                });
        } catch (error) {
            console.log(error);
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
            ActualizarLista
        }}>
            {props.children}
        </EquipmentContext.Provider>
    );
};
