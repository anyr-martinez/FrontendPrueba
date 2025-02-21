import React from 'react';
import { useOutlet } from "react-router-dom";
import { useContextUsuario } from "../Context/user/UserContext"; 
import Equipments from '../Equipments/Equipments';

export const EquipmentsLayout = () => {
  const outlet = useOutlet();
  const { usuario } = useContextUsuario(); 
  return (
    <equipmentState>
      <Equipments />
    </equipmentState>
  );
};
