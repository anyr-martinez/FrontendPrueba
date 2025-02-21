import { createContext, useContext } from "react";
export const maintenanceState = createContext();

export const useContextEstudiante = () => {
    return useContext(maintenanceState);
}