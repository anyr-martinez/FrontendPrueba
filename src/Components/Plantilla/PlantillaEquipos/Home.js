import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AxiosPublico } from "../../Axios/Axios";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import { ListarEquipos } from "../../Configuration/ApiUrls"; // Asegúrate de que la ruta sea correcta

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [equipos, setEquipos] = useState([]);
  const [error, setError] = useState(null);
  const [storedEmail] = useSessionStorage("userEmail", ""); // Si es necesario, cambia la clave "userEmail"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosPublico.get(ListarEquipos); // Asegúrate de que la ruta sea correcta
        const data = response.data.datos; // O ajusta esto según cómo llega la respuesta

        const userEquipos = data.filter(
          (equipo) => equipo.responsable_email === storedEmail
        );

        setEquipos(userEquipos);
      } catch (error) {
        setError("Error al cargar los datos de los equipos. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storedEmail]);

  return (
    <div className="content-wrapper">
      <section className="content py-4">
        <div className="container-fluid px-3 px-md-4">
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="h2 fw-bold mb-4">Equipos Asignados</h2>
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
                    <div className="card-header bg-success bg-opacity-10 py-2 px-3">
                      <h5 className="text-truncate w-100 fs-1">{equipo.descripcion}</h5>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3">
                        <p className="card-text mb-2 mb-sm-0 text-truncate">
                          <i className="fas fa-user-tie me-2"></i>
                          <strong>Responsable:</strong> {equipo.responsable_nombre}
                        </p>
                      </div>
                      <Link
                        to={`/dashboard-equipos/equipos/${equipo.id}`}
                        className="btn btn-info mt-auto"
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
              <div>No hay equipos asignados actualmente.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
