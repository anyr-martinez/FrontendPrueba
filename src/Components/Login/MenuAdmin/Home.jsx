import React from "react";
import { Outlet } from 'react-router-dom';
import Aside from "../../Plantilla/MenuAdmin/Aside";
import Header from "../../Plantilla/MenuAdmin/Header";
import Footer  from "../../Plantilla/MenuAdmin/Footer";
import Content  from "../../Plantilla/MenuAdmin/Content";

const Home = () => {
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

export default Home;
