import React from "react";
import {
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

//Usuarios
import Login from '../Login/Login';
import RegistrarUsuario from '../Login/RegistrarUsuario/RegistrarUsuario';
import AcualizarContrasena from '../Login/ActualizarContrasena/ActualizarContrasena';
import { AutenticacionRoute } from "./AutenticacionRoute";
import Home from '../Login/Menu/Home';

//Equipos
import HomeEquipos from '../Plantilla/PlantillaEquipos/Home';

//Mantenimientos 
//import HomeMantenimientos from '../Plantilla/PlantillaMantenimientos/Content';
// Importa Layout
import { EquipmentsLayout } from '../Routes/EquimentsLayout';
//import { MaintenancesLayout } from '../Routes/MaintenancesLayout';

export const routes = createBrowserRouter(
  createRoutesFromElements(
   <Route>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/registro-usuario" element={<RegistrarUsuario />} />
      <Route path="/actualizar-contrasena" element={<AcualizarContrasena />} />
     
     {/* Protected Routes */}
     <Route element={<AutenticacionRoute />}>
        <Route path="/dashboard-equipments" element={<EquipmentsLayout />}>
          <Route index element={<HomeEquipos />} />
      
        </Route>
      </Route>
   </Route>
  )
);
