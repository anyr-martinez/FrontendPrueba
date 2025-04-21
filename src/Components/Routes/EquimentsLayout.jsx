import React from 'react';
import { EquipmentState } from '../../Components/Context/equipment/equipmentState';
import Equipments from '../Equipments/Equipments';

export const EquipmentsLayout = () => {
  
  
  return (
    <EquipmentState>
      <Equipments />
    </EquipmentState>
  );
};
