import { Navigate, Outlet } from "react-router-dom";
import { useContextUsuario } from "../Context/user/UserContext";
import { mostrarAlertaError } from "../SweetAlert/SweetAlert";

export const AutenticacionRoute = ({ children})=>{
    const {token} = useContextUsuario();
    if (!token){
        console.log(token);
        mostrarAlertaError("Token Invalido");
        return <Navigate to="/" />;
    }
    return children ? children : <Outlet />;
};