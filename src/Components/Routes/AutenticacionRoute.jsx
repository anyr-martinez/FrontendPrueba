import { Navigate, Outlet } from "react-router-dom";
import { useContextUsuario } from "../Context/user/UserContext";
import { mostrarAlertaError } from "../SweetAlert/SweetAlert";

export const AutenticacionRoute = ({ children})=>{
    const {token, usuario} = useContextUsuario();
    if (!token || !usuario){
        console.log(token);
        mostrarAlertaError("Token Invalido");
        return <Navigate to="/login" />;
    }
    return <Outlet></Outlet>
};