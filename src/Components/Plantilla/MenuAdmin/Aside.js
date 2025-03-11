import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { mostrarAlertaPregunta } from "../../SweetAlert/SweetAlert";
import logo2 from "../../../assets/images/logo2.jpg";

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    localStorage.removeItem("token"); // Elimina el token o datos de sesión
    e.preventDefault();
    mostrarAlertaPregunta(
      (confirmed) => {
        if (confirmed) {
          navigate("/"); // Redirige al inicio si se confirma
        }
      },
      "¿Está seguro que desea Cerrar Sesión?",
      "question"
    );
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "active bg-white text-dark shadow-lg rounded"
      : "text-black";
  };
  
  return (
    <aside
      className="main-sidebar sidebar-dark-primary elevation-4 d-flex flex-column"
      style={{ backgroundColor: "#FF7F32" }}
    >
      {/* Logo */}
      <div
        className="brand-link d-flex flex-column align-items-center justify-content-center p-3"
        style={{
          backgroundColor: "#F0F0E6",
          color: "#212529",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "6px solid #007236",
          borderRadius: "5 0 10px 10px",
        }}
      >
        <img
          src={logo2}
          className="img-circle elevation-3"
          alt="Logo"
          style={{
            width: "100px",
            height: "100px",
            marginBottom: "10px",
            border: "1px solid #007236",
            padding: "1px",
            backgroundColor: "#007236",
            borderRadius: "50%",
          }}
        />
        <p className="m-0 fs-5 fw-bold" style={{ color: "#007236"}}>Cooperativa Taulabé</p>
      </div>

      {/* Menú */}
      <div className="sidebar mt-3">
        <nav>
          <ul className="nav nav-pills nav-sidebar flex-column">
            <MenuItem
              path="/dashboard-equipments"
              icon="fas fa-desktop"
              label="Gestion de Equipos"
              isActive={isActive}
            />
            <MenuItem
              path="/dashboard-maintenances"
              icon="fas fa-tools"
              label="Gestion de Mantenimientos"
              isActive={isActive}
            />
            <MenuItem
              path="/configuration"
              icon="fas fa-cogs"
              label="Configuración"
              isActive={isActive}
            />
            
          </ul>
        </nav>
      </div>

      {/* Footer con botón de salir */}
      <div className="sidebar-footer p-3 border-top mt-auto text-center"  >
        <button
          onClick={handleLogout}
          className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
          style={{
            backgroundColor: "#f11511",
            color: "#ffffff",
            transition: "all 0.3s ease",
            fontWeight: "bold",
            borderRadius: "5px",
          }}
          onMouseEnter={(e) => (e.target.style.background = "rgba(201, 26, 26, 0.7)")}
          onMouseLeave={(e) => (e.target.style.background = "#f11511")}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

// Componente para cada ítem del menú
const MenuItem = ({ path, icon, label, isActive }) => (
  <li className="nav-item">
    <Link
      to={path}
      className={`nav-link d-flex align-items-center py-2 px-3 rounded mb-2 ${isActive(path)}`}
    >
      <i className={`nav-icon ${icon} me-2`} style={{color: "#ffffff"}}></i>
      <p className="m-0" style={{color: "#ffffff"}}>{label}</p>
    </Link>
  </li>
);

export default Aside;
