import React from 'react';
import { EquipmentState } from '../Context/equipment/EquipmentState';
import Equipments from '../Equipments/Equipments';

export const EquipmentsLayout = () => {
  
  
  return (
    <EquipmentState>
      <Equipments />
    </EquipmentState>
  );
};
