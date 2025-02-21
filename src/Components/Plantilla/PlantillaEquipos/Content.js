import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { equipmentContext } from "../../Context/equipment/equipmentContext";

const Content = () => {
  const { equipos, obtenerEquipos } = equipmentContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await obtenerEquipos(); // Llama a la función del contexto para obtener equipos
      } catch (error) {
        setError("Error al cargar los equipos. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="content-wrapper">
      <section className="content py-4">
        <div className="container-fluid px-3 px-md-4">
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="h2 fw-bold mb-4">Equipos Registrados</h2>
            </div>
          </div>

          <div className="row gy-4">
            {loading ? (
              <div className="col-12 col-sm-6 col-lg-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              equipos.map((equipo) => (
                <div key={equipo.id} className="col-12 col-sm-6 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm hover-card">
                    <div className="card-header bg-info bg-opacity-10 py-2 px-3">
                      <h5 className="text-truncate w-100 fs-1">{equipo.descripcion}</h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <p className="card-text mb-2 text-truncate">
                        <i className="fas fa-barcode me-2"></i>
                        <strong>Número de Serie:</strong> {equipo.numero_serie}
                      </p>
                      <p className="card-text mb-2 text-truncate">
                        <i className="fas fa-cogs me-2"></i>
                        <strong>Estado:</strong> {equipo.estado === 1 ? "Activo" : "Inactivo"}
                      </p>
                      <Link
                        to={`/equipos/${equipo.id}`}
                        className="btn btn-success mt-auto"
                      >
                        <i className="fas fa-eye me-2"></i>
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && !error && equipos.length === 0 && (
            <div className="alert alert-info d-flex align-items-center" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              <div>No hay equipos registrados actualmente.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Content;
