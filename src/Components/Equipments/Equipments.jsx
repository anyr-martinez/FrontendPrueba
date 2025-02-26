import React from 'react';
import Header from '../Plantilla/PlantillaEquipos/Header';
import SideNav from '../Plantilla/PlantillaEquipos/SideNav';
import {Outlet} from 'react-router-dom';
import Footer from '../Plantilla/PlantillaEquipos/Footer';

const Equipments = () => {
    return (
        <div className="wrapper">
            <Header/>
            <Outlet/>
            <SideNav/>
            <Footer/>
        </div>
    );
}

export default Equipments;