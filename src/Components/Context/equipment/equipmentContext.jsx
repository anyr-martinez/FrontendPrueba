import { createContext, useContext } from "react";

// Crear el contexto
export const EquipmentContext = createContext();

// Custom hook para usar el contexto
export const useContextEquipment = () => {
    return useContext(EquipmentContext);
};
