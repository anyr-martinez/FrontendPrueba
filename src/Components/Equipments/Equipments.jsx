import React from "react";
import { Outlet } from 'react-router-dom';
import Aside from "../../Components/Plantilla/PlantillaEquipos/Aside";
import Header from "../../Components/Plantilla/PlantillaEquipos/Header";
import Footer  from "../../Components/Plantilla/PlantillaEquipos/Footer";
import Content  from "../../Components/Plantilla/PlantillaEquipos/Content";

const Equipments = () => {
  return (
    <div className="wrapper">
      <Header/>
      <Aside/>
      <Outlet />
      <Content />
      <Footer/>
  </div>

  );
};

export default Equipments;
