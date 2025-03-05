import { createContext, useContext } from "react";

// Crear el contexto
export const MaintenanceContext = createContext();

// Custom hook para usar el contexto
export const useContextMaintenance = () => {
    return useContext(MaintenanceContext);
};
