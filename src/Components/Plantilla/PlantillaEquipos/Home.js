import React from "react";
import { Link } from "react-router-dom";

export default function EquiposDashboard() {
  return (
    <div className="content-wrapper">
      {/* Encabezado */}
      <div className="content-header d-flex justify-content-center align-items-center">
        <div className="container-fluid text-center">
          <h1 className="m-0 text-dark fw-bold" style={{ fontSize: "2.5rem", color: "#00A32B" }}>
            Gestión de Equipos de TI
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <section className="content py-4">
        <div className="container-fluid">
          <div className="row">
            {/* Guardar Equipo */}
            <div className="col-lg-4 col-md-6">
              <Link to="/dashboard-equipments/crear-equipo" className="text-decoration-none">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>Agregar</h3>
                    <p>Nuevo equipo</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-plus"></i>
                  </div>
                  <div className="small-box-footer">Más info <i className="fas fa-arrow-circle-right"></i></div>
                </div>
              </Link>
            </div>

            {/* Listar Equipos */}
            <div className="col-lg-4 col-md-6">
              <Link to="/dashboard-equipos/listar" className="text-decoration-none">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>Ver Equipos</h3>
                    <p>Lista con filtros</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-list"></i>
                  </div>
                  <div className="small-box-footer">Más info <i className="fas fa-arrow-circle-right"></i></div>
                </div>
              </Link>
            </div>

            {/* Editar Equipos */}
            <div className="col-lg-4 col-md-6">
              <Link to="/dashboard-equipos/editar" className="text-decoration-none">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>Editar</h3>
                    <p>Modificar equipo</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="small-box-footer">Más info <i className="fas fa-arrow-circle-right"></i></div>
                </div>
              </Link>
            </div>

            {/* Actualizar Equipos */}
            <div className="col-lg-4 col-md-6">
              <Link to="/dashboard-equipos/actualizar" className="text-decoration-none">
                <div className="small-box bg-primary">
                  <div className="inner">
                    <h3>Actualizar</h3>
                    <p>Información del equipo</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-sync-alt"></i>
                  </div>
                  <div className="small-box-footer">Más info <i className="fas fa-arrow-circle-right"></i></div>
                </div>
              </Link>
            </div>

            {/* Eliminar Equipos */}
            <div className="col-lg-4 col-md-6">
              <Link to="/dashboard-equipos/eliminar" className="text-decoration-none">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>Eliminar</h3>
                    <p>Inhabilitar equipo</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-trash"></i>
                  </div>
                  <div className="small-box-footer">Más info <i className="fas fa-arrow-circle-right"></i></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
