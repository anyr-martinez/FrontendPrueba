import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo2 from "../../../assets/images/logo2.jpg";

export default function Aside() {
  const location = useLocation(); // Detectar la ruta activa
  const navigate = useNavigate(); // Para redirigir después de cerrar sesión

  // Función de cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token o datos de sesión
    navigate("/"); // Redirige al login
  };

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 d-flex flex-column justify-between" style={{ backgroundColor: "#145a32" }}>
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
          border: "3px solid #007236",
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


      {/* Sidebar */}
      <div className="sidebar flex-grow-1">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            {/* Enlace a Equipos */}
            <li className="nav-item">
              <Link
                to="/equipos"
                className={`nav-link ${location.pathname === "/dashboard-equipments" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-desktop"></i>
                <p>Equipos</p>
              </Link>
            </li>

            {/* Enlace a Mantenimientos */}
            <li className="nav-item">
              <Link
                to="/mantenimientos"
                className={`nav-link ${location.pathname === "/maintenances" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-tools"></i>
                <p>Mantenimientos</p>
              </Link>
            </li>

            {/* Enlace a Configuración */}
            <li className="nav-item">
              <Link
                to="/configuracion"
                className={`nav-link ${location.pathname === "/configuracion" ? "active" : ""}`}
              >
                <i className="nav-icon fas fa-cogs"></i>
                <p>Configuración</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer con botón de cerrar sesión */}
      <div className="sidebar-footer p-3 border-top d-flex justify-center align-items-center">
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
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
