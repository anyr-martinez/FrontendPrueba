import React from "react";
import { Link } from "react-router-dom";

export default function Content() {
  return (
    <div className="content-wrapper" 
    style={{ backgroundColor: "#F0F0E6" }}>
      {/* Content Header */}
      <div className="content-header d-flex justify-content-center align-items-center">
        <div className="container-fluid text-center m-5">
          <h1
            className="m-3 text-center fw-bold"
            style={{
              fontSize: "2.5rem",
              letterSpacing: "2px",
              lineHeight: "1.2",
              color: "#007236",
              fontWeight: "900",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              
            }}
          >
            BIENVENIDO AL SISTEMA DE GESTIÓN DE INVENTARIO DE EQUIPOS TI 
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="content py-4">
        <div className="container-fluid px-3 px-md-4">
          {/* Título del Menú
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="h2 fw-bold mb-4 text-center text-success">
                Menú Principal
              </h2>
            </div>
          </div> */}

          {/* Opciones del Menú */}
          <div className="row g-4 justify-content-center">
            {/* Opción Equipos */}
            <div className="col-12 col-sm-6 col-lg-4">
              <Link to="/dashboard-equipments" className="text-decoration-none">
                <div className="small-box rounded-3 h-100 position-relative overflow-hidden shadow-lg"
                  style={{ backgroundColor: "#007236" }} 
                  >

                  <div className="inner p-4 text-white text-center">
                    <h3 className="h2 fw-bold mb-2">Equipos</h3>
                    <p className="mb-0">Gestionar Equipos</p>
                  </div>
                  <div className="icon position-absolute end-0 top-0 p-3 opacity-25 fs-1">
                    <i className="fas fa-desktop"></i>
                  </div>
                </div>
              </Link>
            </div>

            {/* Opción Mantenimientos */}
            <div className="col-12 col-sm-6 col-lg-4">
              <Link to="/dashboard-maintenances" className="text-decoration-none">
                <div
                  className="small-box rounded-3 h-100 position-relative overflow-hidden shadow-lg"
                  style={{ backgroundColor: "#FF7F32" }} 
                >
                  <div className="inner p-4 text-white text-center">
                    <h3 className="h2 fw-bold mb-2">Mantenimientos</h3>
                    <p className="mb-0">Gestionar Mantenimientos</p>
                  </div>
                  <div className="icon position-absolute end-0 top-0 p-3 opacity-25 fs-1">
                    <i className="fas fa-tools"></i>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

