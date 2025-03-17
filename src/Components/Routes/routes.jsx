import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

//Otras
import Login from '../Login/Login';
import RegistrarUsuario from '../Login/RegistrarUsuario/RegistrarUsuario';
import { AutenticacionRoute } from "./AutenticacionRoute";

//Usuarios
import HomeUsuarios from '../Plantilla/PlantillaUsuarios/Home';
import ListarUsuarios from "../Plantilla/PlantillaUsuarios/Home";
import CrearUsuario  from "../Plantilla/PlantillaUsuarios/Home";
import ActualizarUsuario from "../Plantilla/PlantillaUsuarios/Home";
import EliminarUsuario from "../Plantilla/PlantillaUsuarios/Home";
import UsuarioActualizarContrasena from "../Plantilla/PlantillaUsuarios/Home";

//Menu
import Home from '../Login/Menu/Home';
import HomeAdmin from '../Login/MenuAdmin/Home';

//Equipos
import HomeEquipos from '../Plantilla/PlantillaEquipos/Home';
import ListarEquipos from "../Plantilla/PlantillaEquipos/Home";
import GuardarEquipo from '../Plantilla/PlantillaEquipos/Home';
import EliminarEquipo from "../Plantilla/PlantillaEquipos/Home";
import ActualizarEquipo from "../Plantilla/PlantillaEquipos/Home";
import ObtenerEquipoById  from "../Plantilla/PlantillaEquipos/Home";
import ReporteEquipos from "../Plantilla/PlantillaEquipos/Home";

//Mantenimientos 
import HomeMantenimientos from '../Plantilla/PlantillaMantenimientos/Home';
import ListarMantenimientos from "../Plantilla/PlantillaMantenimientos/Home";
import GuardarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";
import EliminarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";
import ActualizarMantenimiento from "../Plantilla/PlantillaMantenimientos/Home";

// Importa Layout
import { EquipmentsLayout } from '../Routes/EquimentsLayout';
import { MaintenancesLayout } from '../Routes/MaintenancesLayout';
import { UsersLayout } from "./UsersLayout";

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/HomeAdmin" element={<HomeAdmin />}/>
      <Route path="/registro-usuario" element={<RegistrarUsuario />} />
           
      {/* Rutas protegidas */}
      <Route element={<AutenticacionRoute />}>
      {/* Rutas Equipos*/}
        <Route path="/dashboard-equipments" element={<EquipmentsLayout />}>
          <Route index element={<HomeEquipos />} />
          <Route path="listar" element={<ListarEquipos />} />
          <Route path="guardar" element={<GuardarEquipo />} />
          <Route path="eliminar" element={<EliminarEquipo />} />
          <Route path="actualizar" element={<ActualizarEquipo />} />
          <Route path="obtenerM" element={<ObtenerEquipoById />} />
          <Route path="reporte-equipos" element={<ReporteEquipos />}/>  
      
        </Route>

        {/*Rutas Mantenimientos */}
        <Route path="/dashboard-maintenances" element={<MaintenancesLayout />}>
          <Route index element={<HomeMantenimientos />} />
          <Route path="listarM" element={<ListarMantenimientos />} />
          <Route path="guardarM" element={<GuardarMantenimiento />} />
          <Route path="eliminarM" element={<EliminarMantenimiento />} />
          <Route path="actualizarM" element={<ActualizarMantenimiento />} />         
        </Route>

        {/* Rutas Usuarios */}
        <Route path="/dashboard-users" element={<UsersLayout />}>
          <Route index element={<HomeUsuarios />} />
          <Route path="listarU" element={<ListarUsuarios />}/>
          <Route path="crearU" element={<CrearUsuario />}/>
          <Route path="actualizarU" element={<ActualizarUsuario />}/>
          <Route path="eliminarU" element={<EliminarUsuario />}/>
          <Route path="actualizarContrasena" element={<UsuarioActualizarContrasena />}/>          
        </Route>
      </Route>
      
    </Route>
  )
);
