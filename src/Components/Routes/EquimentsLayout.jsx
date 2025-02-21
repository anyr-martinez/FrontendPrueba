import React from 'react';
import { Navigate, useOutlet } from "react-router-dom";
import { mostraAlertaError } from "../SweetAlert/SweetAlert";
import { equipmentState} from "../Context/equipment/equimentState"
import { UserContext } from "../Context/user/UserContext";
import Equimpents from '../Equipments/Equipments';

export const EquipmentsLayout = () => {
  const outlet = useOutlet();
  const { user } = UserContext();
  return (
    <equipmentState>
      <Equimpents />
    </equipmentState>
  );
};