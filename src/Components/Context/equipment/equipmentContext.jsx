import { createContext, useContext } from "react";
export const equipmentContext = createContext();

export const useContextEquipment=()=>{
    return useContext(equipmentContext);
}