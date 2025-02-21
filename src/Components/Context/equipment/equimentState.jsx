import { createContext, useContext } from "react";
export const equimentState = createContext();

export const useContextEmpleado=()=>{
    return useContext(equimentState);
}