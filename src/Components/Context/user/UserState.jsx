import React from 'react';
import {UserContext}  from '../../Context/user/UserContext';
import {useSessionStorage} from '../../Context/storage/useSessionStorage'; 

const UserState = (props) => {
    const [usuario, setUser] = useSessionStorage("usuario", null);
    const [token, setToken] = useSessionStorage("token_almacenado", null);

    const setCerrarSesion = () => {
        setUser(null);
        setToken(null);
        window.sessionStorage.removeItem("usuario");
        window.sessionStorage.removeItem("token_almacenado");
    };

    const setLogin = async (data) => {
        try {
            setUser(data.usuario);
            setToken(data.token);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <UserContext.Provider value={{
            usuario: usuario,
            token: token,
            setLogin,
            setCerrarSesion,
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
