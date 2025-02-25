import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mostrarAlertaPregunta } from "../../SweetAlert/SweetAlert";
import logo2 from "../../../assets/images/logo2.jpg";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    mostrarAlertaPregunta(
      (confirmed) => {
        if (confirmed) {
          navigate("/Home"); // Redirige al inicio si se confirma
        }
      },
      "¿Está seguro que desea regresar al Menú?",
      "question"
    );
  };

  const isActive = (path) => {
    return location.pathname === path ? "active bg-white text-dark" : "";
  };

  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4 d-flex flex-column justify-between"
      style={{ backgroundColor: "#145a32" }}
    >
      {/* Logo de Cooperativa Taulabé */}
      <div
        className="brand-link d-flex flex-column align-items-center justify-content-center"
        style={{
          backgroundColor: "#f39c12",
          color: "#007236",
          fontWeight: "bold",
          padding: "20px",
          borderBottom: "2px solid #007236",
          textAlign: "center",
          fontSize: "1.2rem",
          borderRadius: "0 0 10px 10px",
        }}
      >
        {/* Logo grande */}
        <img
          src={logo2}
          className="img-circle elevation-3"
          alt="Logo"
          style={{
            width: "100px",
            height: "100px",
            marginBottom: "10px",
            border: "3px solid #C",
            padding: "5px",
            backgroundColor: "#fff",
            borderRadius: "50%",
          }}
        />

        {/* Nombre de la cooperativa debajo del logo */}
        <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
          Cooperativa Taulabé
        </p>
      </div>

      <div className="sidebar">
        <nav className="mt-3">
          <ul className="nav nav-pills nav-sidebar flex-column">
            {/* Lista de Equipos */}
            <li className="nav-item">
              <Link
                to="/dashboard-equipments/lista-equipos"
                className={`nav-link rounded-lg mb-2 ${isActive("/dashboard-equipments/lista-equipos")}`}
              >
                <i className="nav-icon fas fa-laptop mr-2"></i>
                <p className="m-0">Lista de Equipos</p>
              </Link>
            </li>
            {/* Gestión de Equipos */}
            <li className="nav-item">
              <Link
                to="/gestion-equipos"
                className={`nav-link rounded-lg mb-2 ${isActive("/gestion-equipos")}`}
              >
                <i className="nav-icon fas fa-cogs mr-2"></i>
                <p className="m-0">Gestión de Equipos</p>
              </Link>
            </li>
            {/* Mantenimiento de Equipos */}
            <li className="nav-item">
              <Link
                to="/mantenimiento-equipos"
                className={`nav-link rounded-lg mb-2 ${isActive("/mantenimiento-equipos")}`}
              >
                <i className="nav-icon fas fa-wrench mr-2"></i>
                <p className="m-0">Mantenimiento de Equipos</p>
              </Link>
            </li>
            {/* Historial de Mantenimientos */}
            <li className="nav-item">
              <Link
                to="/historial-mantenimientos"
                className={`nav-link rounded-lg mb-2 ${isActive("/historial-mantenimientos")}`}
              >
                <i className="nav-icon fas fa-history mr-2"></i>
                <p className="m-0">Historial de Mantenimientos</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer con botón de cerrar sesión */}
      <div className="sidebar-footer p-3 border-top mt-auto d-flex justify-center align-items-center">
        <button
          onClick={handleLogout}
          className="btn btn-link d-flex align-items-center gap-2"
          style={{
            color: "#f0f3f4",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#d7dbdd")}
          onMouseLeave={(e) => (e.target.style.color = "#d0d3d4")}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;
