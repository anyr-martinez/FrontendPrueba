import React from 'react';
import { MaintenanceState} from "../Context/maintenance/maintenanceState";
import Maintenances from '../Maintenances/Maintenances';

export const MaintenancesLayout = () => {
  

  return (
    <MaintenanceState>
      <Maintenances />
    </MaintenanceState>
  );
};