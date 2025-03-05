import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Plantilla/PlantillaMantenimientos/Header';
import SideNav from '../Plantilla/PlantillaMantenimientos/SideNav';
import Footer from '../Plantilla/PlantillaMantenimientos/Footer';

const Maintenances = () => {
    return (
        <div className="wrapper">
            <SideNav/>
            <Header/>
            <Outlet />
            <Footer/>
        </div>
    );
}

export default Maintenances;