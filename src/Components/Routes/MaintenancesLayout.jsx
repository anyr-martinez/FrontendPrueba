import React from 'react';
import { useOutlet } from "react-router-dom";
import { UserContext } from "../Context/user/UserContext";
import Maintenances from '../Maintenances/Maintenances';

export const MaintenancesLayout = () => {
  const outlet = useOutlet();
  const { usuario } = UserContext();
  return (
    <maintenanceState>
      <Maintenances />
    </maintenanceState>
  );
};