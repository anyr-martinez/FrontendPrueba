import { createContext, useContext } from "react";

// Crear el contexto
export const equipmentContext = createContext();

// Custom hook para usar el contexto
export const useContextEquipment = () => {
    return useContext(equipmentContext);
};
