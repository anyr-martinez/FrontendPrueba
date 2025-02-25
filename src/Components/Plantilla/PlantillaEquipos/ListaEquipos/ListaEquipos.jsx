import React, { useContext, useEffect } from 'react';
import { EquipmentContext } from '../../../Context/equipment/EquipmentContext';
import { Link } from 'react-router-dom';

const ListaEquipos = () => {
  const { listaEquipos, ListaEquipos } = useContext(EquipmentContext);

  useEffect(() => {
    ListaEquipos(); // Cargar lista de equipos al renderizar el componente
  }, [ListaEquipos]);

  if (listaEquipos.length === 0) {
    return <div className="loading">Cargando equipos...</div>; // Mensaje de carga
  }

  return (
    <div className="container">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-12 col-sm-6">
              <h1 className="m-0 text-center text-sm-start">Equipos</h1>
            </div>
            <div className="col-12 col-sm-6 mt-2 mt-sm-0">
              <ol className="breadcrumb float-sm-end justify-content-center justify-content-sm-end">
                <li className="breadcrumb-item"><Link to="/dashboard-equipments">Home</Link></li>
                <li className="breadcrumb-item active">Equipos</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <h2>Lista de Equipos</h2>
      <button className="btn btn-primary mb-3">Agregar Equipo</button>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {listaEquipos.length > 0 ? (
              listaEquipos.map((equipo) => (
                <tr key={equipo.id}>
                  <td>{equipo.descripcion}</td>
                  <td>{equipo.estado}</td>
                  <td>
                    <button className="btn btn-info">Ver</button>
                    <button className="btn btn-warning">Editar</button>
                    <button className="btn btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No hay equipos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaEquipos;
