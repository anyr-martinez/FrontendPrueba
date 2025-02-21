import React from "react";
import { Outlet } from 'react-router-dom';
import Aside from "../../Plantilla/Menu/Aside.js";
import Header from "../../Plantilla/Menu/Header";
import Footer  from "../../Plantilla/Menu/Footer";
import Content  from "../../Plantilla/Menu/Content";

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
