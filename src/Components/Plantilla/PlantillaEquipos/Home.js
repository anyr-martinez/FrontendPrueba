import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { ListarEquipos, GuardarEquipo, ActualizarEquipo, EliminarEquipo } from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import { mostrarAlertaError, mostrarAlertaOK } from "../../SweetAlert/SweetAlert";

export default function HomeEquipo() {
  const [user] = useSessionStorage("user", {});
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("Agregar");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({
    id_equipo: "",
    descripcion: "",
    tipo: "",
    numero_serie: "",
    fecha_registro: "",
  });
  const [filtros, setFiltros] = useState({
    id: "",
    tipo: "",
    fecha_registro: "",
  });

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const obtenerEquipos = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarEquipos);
      setEquipos(respuesta.data.data);
    } catch (error) {
      console.error("Error al obtener los equipos:", error.response ? error.response.data.data : error);
    }
  };

  const handleShow = (modo, equipo = { id_equipo: "", descripcion: "", tipo: "", numero_serie: "", fecha_registro: "" }) => {
    console.log("Equipo seleccionado para el modal:", equipo); // Verifica el equipo antes de abrir el modal
    setModo(modo);
    setEquipoSeleccionado(equipo);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      console.log("ID del equipo seleccionado:", equipoSeleccionado.id_equipo); // Verifica el ID aquí
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/home"; // Redirigir al home si no hay token
        return;
      }
      let response;

      if (modo === "Agregar") {
        response = await AxiosPrivado.post(GuardarEquipo, equipoSeleccionado, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEquipos((prevEquipos) => [...prevEquipos, response.data]);
        obtenerEquipos();
        mostrarAlertaOK("Equipo Creado Exitosamente!");
      } else if (modo === "Editar") {
        response = await AxiosPrivado.put(`${ActualizarEquipo}/${equipoSeleccionado.id_equipo}`, equipoSeleccionado, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEquipos((prevEquipos) =>
          prevEquipos.map((equipo) =>
            equipo.id_equipo === equipoSeleccionado.id_equipo ? response.data : equipo
          )
        );
        obtenerEquipos();
        mostrarAlertaOK("Equipo Actualizado Exitosamente!");
      } else if (modo === "Eliminar") {
        if (equipoSeleccionado.id_equipo) {
          try {
            // Hacemos la solicitud DELETE pasando el ID en la URL
            response = await AxiosPrivado.delete(`${EliminarEquipo}/${equipoSeleccionado.id_equipo}`, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });

            if (response.status === 200 || response.status === 201) {
              setEquipos((prevEquipos) =>
                prevEquipos.filter((equipo) => equipo.id_equipo !== equipoSeleccionado.id_equipo)
              );
              obtenerEquipos();
              console.log("ID del equipo seleccionado:", equipoSeleccionado.id_equipo);
              mostrarAlertaOK("Equipo Eliminado Exitosamente!");
            } else {
              mostrarAlertaError("Error al eliminar el equipo");
            }
          } catch (error) {
            console.error("Error al realizar la operación:", error);
            if (error.response && error.response.status === 401) {
              sessionStorage.removeItem("user");
              window.location.href = "/";
            }
            mostrarAlertaError("Error al realizar la operación, por favor intenta nuevamente.");
          }
        } 
      }
      setShowModal(false); // Cerrar el modal después de la operación
    } catch (error) {
      console.error("Error al realizar la operación:", error);
      mostrarAlertaError("Error al realizar la operación, por favor intenta nuevamente.");
    }
  };

  const obtenerValoresUnicos = (campo) => {
    return [...new Set(equipos.map((equipo) => equipo[campo]))];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredEquipos = equipos.filter((equipo) => {
    return (
      (filtros.id === "" || equipo.id_equipo.toString().includes(filtros.id)) &&
      (filtros.tipo === "" || equipo.tipo === filtros.tipo) &&
      (filtros.fecha_registro === "" || equipo.fecha_registro === filtros.fecha_registro)
    );
  });

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <h1 className="text-center text-success">Gestión de Equipos de TI</h1>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <Button variant="success" className="mb-3" onClick={() => handleShow("Agregar")}>
            Agregar Equipo
          </Button>

          {/* Filtros */}
          <div className="mb-3 row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Filtrar por ID"
                name="id"
                value={filtros.id}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-3">
              <select className="form-control" name="tipo" value={filtros.tipo} onChange={handleFilterChange}>
                <option value="">Filtrar por Tipo</option>
                {obtenerValoresUnicos("tipo").map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-control" name="fecha_registro" value={filtros.fecha_registro} onChange={handleFilterChange}>
                <option value="">Filtrar por Fecha de Registro</option>
                {obtenerValoresUnicos("fecha_registro").map((fecha) => (
                  <option key={fecha} value={fecha}>
                    {new Date(fecha).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Número de Serie</th>
                    <th>Fecha de Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipos
                    .filter((equipo) => equipo.estado === 1)
                    .map((equipo) => (
                      <tr key={equipo.id_equipo}>
                        <td>{equipo.id_equipo}</td>
                        <td>{equipo.descripcion}</td>
                        <td>{equipo.tipo}</td>
                        <td>{equipo.numero_serie}</td>
                        <td>{new Date(equipo.fecha_registro).toLocaleDateString()}</td>

                        <td>
                          <Button variant="warning" size="sm" onClick={() => handleShow("Editar", equipo)}>
                            Editar
                          </Button>{" "}
                          <Button variant="danger" size="sm" onClick={() => handleShow("Eliminar", equipo)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Modal para agregar, editar o eliminar un equipo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modo} Equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modo !== "Eliminar" ? (
            <Form>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.descripcion}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, descripcion: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.tipo}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, tipo: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Número de Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.numero_serie}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, numero_serie: e.target.value })}
                />
              </Form.Group>
              <Form.Group>
            <Form.Label>Fecha de Registro</Form.Label>
            <Form.Control
              type="date"
              value={equipoSeleccionado.fecha_registro ? new Date(equipoSeleccionado.fecha_registro).toISOString().split('T')[0] : ''}
              onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, fecha_registro: e.target.value })}
            />
          </Form.Group>

            </Form>
          ) : (
            <p>¿Estás seguro de que quieres eliminar este equipo?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant={modo === "Eliminar" ? "danger" : "primary"} onClick={handleSave}>
            {modo === "Eliminar" ? "Eliminar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
