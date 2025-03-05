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
import Home from '../Login/Menu/Home';

//Equipos
import HomeEquipos from '../Plantilla/PlantillaEquipos/Home';
import ListarEquipos from "../Plantilla/PlantillaEquipos/Home";
import GuardarEquipo from '../Plantilla/PlantillaEquipos/Home';
import EliminarEquipo from "../Plantilla/PlantillaEquipos/Home";
import ActualizarEquipo from "../Plantilla/PlantillaEquipos/Home";
import ObtenerEquipoById  from "../Plantilla/PlantillaMantenimientos/Home";

//Mantenimientos 
import HomeMantenimientos from '../Plantilla/PlantillaMantenimientos/Home';
import ListarMantenimientos from "../Plantilla/PlantillaMantenimientos/Home";
import GuardarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";
import EliminarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";
import ActualizarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";

// Importa Layout
import { EquipmentsLayout } from '../Routes/EquimentsLayout';
import { MaintenancesLayout } from '../Routes/MaintenancesLayout';

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/registro-usuario" element={<RegistrarUsuario />} />
      <Route path="/actualizar-contrasena" element={<AcualizarContrasena />} />
     
      {/* Rutas protegidas */}
      <Route element={<AutenticacionRoute />}>
        <Route path="/dashboard-equipments" element={<EquipmentsLayout />}>
          <Route index element={<HomeEquipos />} />
          <Route path="listar" element={<ListarEquipos />} />
          <Route path="guardar" element={<GuardarEquipo />} />
          <Route path="eliminar" element={<EliminarEquipo />} />
          <Route path="actualizar" element={<ActualizarEquipo />} />
          <Route path="obtener" element={<ObtenerEquipoById />} />
        </Route>
        
        <Route path="/dashboard-maintenances" element={<MaintenancesLayout />}>
          <Route index element={<HomeMantenimientos />} />
          <Route path="listar" element={<ListarMantenimientos />} />
          <Route path="guardar" element={<GuardarMantenimiento />} />
          <Route path="eliminar" element={<EliminarMantenimiento />} />
          <Route path="actualizar" element={<ActualizarMantenimiento />} />
          <Route path="obtener" element={<ObtenerEquipoById />} />
        </Route>
      </Route>
    </Route>
  )
);
