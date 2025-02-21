import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../Context/user/UserContext";
import { mostraAlertaError } from "../SweetAlert/SweetAlert";

export const AutenticacionRoute = ({ children})=>{
    const {token} = UserContext();
    if (!token){
        mostraAlertaError("Token Invalido");
        return <Navigate to="/" />;
    }
    return children ? children : <Outlet />;
};