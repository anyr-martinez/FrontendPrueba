import React from 'react'
import Header from '../Plantilla/PlantillaUsuarios/Header'
import { Outlet } from 'react-router-dom'
import SideNav from '../Plantilla/PlantillaUsuarios/SideNav'
import Footer from '../Plantilla/PlantillaUsuarios/Footer'

const Users = ()  => {
  return (
    <div className='wrapper'>
        <Header />
        <Outlet />
        <SideNav />
        <Footer />     
    </div>
  );
}

export default Users;
