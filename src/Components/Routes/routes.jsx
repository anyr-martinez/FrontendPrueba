import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

//Usuarios
import Login from '../Login/Login';
import RegistrarUsuario from '../Login/RegistrarUsuario/RegistrarUsuario';
import AcualizarContrasena from '../Login/ActualizarContrasena/ActualizarContrasena';
import { AutenticacionRoute } from "./AutenticacionRoute";

//Equipos
import HomeEquipos from '../Plantilla/PlantillaEquipos/Content';

//Mantenimientos 
import HomeMantenimientos from '../Plantilla/PlantillaMantenimientos/Content';
// Importa Layout
import { EquipmentsLayout } from '../Routes/EquimentsLayout';
import { MaintenancesLayout } from '../Routes/MaintenancesLayout';

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
    {/* Public Routes */}
    <Route path="/" element={<Login />} />
    <Route path="ActualizarContrasena" element={<AcualizarContrasena />} />
    <Route path="/registro-usuario" element={<RegistrarUsuario />} />

    {/* Protected Routes */}
    <Route element={<AutenticacionRoute />}>
        <Route path="/dashboard-equipos" element={<EquipmentsLayout />}>
          <Route index element={<HomeEquipos />} />
        </Route>
      </Route>

      {/* Protected Routes */}
    <Route element={<AutenticacionRoute />}>
        <Route path="/dashboard-mantenimientos" element={<MaintenancesLayout />}>
          <Route index element={<HomeMantenimientos />} />
        </Route>
      </Route>

  
  </Route>
  )
);
