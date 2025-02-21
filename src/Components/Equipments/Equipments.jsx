import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Plantilla/PlantillaEquipos/Header';
import Aside from '../Plantilla/PlantillaEquipos/Aside';
import Footer from '../Plantilla/PlantillaEquipos/Footer';
import Content from '../Plantilla/PlantillaEquipos/Content'

const Equipments = () => {
    return (
        <div className="wrapper">
            <Aside/>
            <Header/>
            <Outlet />
            <Content />
            <Footer/>
        </div>
    );
}

export default Equipments;