import React, { useState } from "react";
import { AxiosPublico } from "../../../Axios/Axios";
import { GuardarEquipo } from "../../../Configuration/ApiUrls";

const CrearEquipo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    tipo: "",
    numero_serie: "",
    fecha_registro: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosPublico.post(GuardarEquipo, formData);
      if (response.data.tipo === 1) {
        // Si la respuesta es exitosa, puedes hacer lo que desees con los datos
        setFormData({
          descripcion: "",
          tipo: "",
          numero_serie: "",
          fecha_registro: "",
        });
      } else {
        setError("Error al guardar el equipo");
      }
    } catch (error) {
      setError("Error al guardar el equipo");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-12 col-sm-6">
              <h1 className="m-0 text-center text-sm-start">Crear Equipo</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Nuevo Equipo</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <input
                    type="text"
                    name="tipo"
                    className="form-control"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Número de Serie</label>
                  <input
                    type="text"
                    name="numero_serie"
                    className="form-control"
                    value={formData.numero_serie}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Registro</label>
                  <input
                    type="date"
                    name="fecha_registro"
                    className="form-control"
                    value={formData.fecha_registro}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Guardar Equipo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrearEquipo;
