import { createContext, useContext } from "react";
export const maintenanceState = createContext();

export const useContextMaintenance = () => {
    return useContext(maintenanceState);
}