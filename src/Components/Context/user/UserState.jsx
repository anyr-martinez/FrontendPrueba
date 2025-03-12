import React, { useState, useEffect } from 'react';
import { UserContext } from '../../Context/user/UserContext';
import { useSessionStorage } from '../../Context/storage/useSessionStorage';
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { ListarUsuarios, CrearUsuario, ActualizarUsuario, EliminarUsuario, UsuarioActualizarContrasena } from "../../Configuration/ApiUrls";

const UserState = (props) => {
  const [usuario, setUser] = useSessionStorage("usuario", null);
  const [token, setToken] = useSessionStorage("token_almacenado", null);
  const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios

  // Efecto para obtener los usuarios solo cuando hay un token válido
  useEffect(() => {
    if (token) {
      obtenerUsuarios();
    }
  }, [token]); // Se ejecuta cada vez que cambia el token

  // Obtener la lista de usuarios
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarUsuarios, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios(respuesta.data.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  // Función para cerrar sesión
  const setCerrarSesion = () => {
    setUser(null);
    setToken(null);
    window.sessionStorage.removeItem("usuario");
    window.sessionStorage.removeItem("token_almacenado");
  };

  // Función para iniciar sesión
  const setLogin = async (data) => {
    try {
      setUser(data.usuario);
      setToken(data.token);
    } catch (error) {
      console.error("Error al hacer login:", error);
    }
  };

  // Función para agregar un nuevo usuario
  const agregarUsuario = async (usuarioNuevo) => {
    try {
      const response = await AxiosPrivado.post(CrearUsuario, usuarioNuevo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios((prevUsuarios) => [...prevUsuarios, response.data]);
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
    }
  };

  // Función para editar un usuario
  const editarUsuario = async (usuarioEditado) => {
    try {
      const response = await AxiosPrivado.put(
        `${ActualizarUsuario}/${usuarioEditado.id_usuario}`,
        usuarioEditado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.id_usuario === usuarioEditado.id_usuario ? response.data : usuario
        )
      );
    } catch (error) {
      console.error("Error al editar el usuario:", error);
    }
  };

  // Función para eliminar un usuario
  const eliminarUsuario = async (id_usuario) => {
    try {
      await AxiosPrivado.delete(`${EliminarUsuario}/${id_usuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios((prevUsuarios) =>
        prevUsuarios.filter((usuario) => usuario.id_usuario !== id_usuario)
      );
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  // Función para actualizar la contraseña de un usuario
  const actualizarContrasena = async (id, nuevaContrasena) => {
    try {
      const response = await AxiosPrivado.put(
        `${UsuarioActualizarContrasena}/${id}`,
        { contrasena: nuevaContrasena },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Contraseña actualizada con éxito:", response.data);
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        usuario,
        token,
        setLogin,
        setCerrarSesion,
        agregarUsuario,
        editarUsuario,
        eliminarUsuario,
        obtenerUsuarios,
        actualizarContrasena, // Proveeremos la función para actualizar la contraseña
        usuarios, // Proveeremos la lista de usuarios también
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
