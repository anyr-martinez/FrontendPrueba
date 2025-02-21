import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Plantilla/PlantillaMantenimientos/Header';
import Aside from '../Plantilla/PlantillaMantenimientos/Aside';
import Footer from '../Plantilla/PlantillaMantenimientos/Footer';
import Content from '../Plantilla/PlantillaMantenimientos/Content';

const Maintenances = () => {
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

export default Maintenances;