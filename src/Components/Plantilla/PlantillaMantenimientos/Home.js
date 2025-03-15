import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  ListarMantenimientos,
  GuardarMantenimiento,
  ActualizarMantenimiento,
  EliminarMantenimiento,
  ListarEquipos, // Esta API es la que usas para obtener el equipo por ID
} from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import {
  mostrarAlertaError,
  mostrarAlertaOK,
} from "../../SweetAlert/SweetAlert";

export default function HomeMantenimientos() {
  const [user] = useSessionStorage("user", {});
  const [mantenimientos, setMantenimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("Agregar");
  const [equipos, setEquipos] = useState([]);
  const [mantenimientoseleccionado, setMantenimientoSeleccionado] = useState({
    id_equipo: "",
    equipo_descripcion: "",
    numero_serie: "",
    descripcion: "",
    fecha_entrada: "",
    fecha_salida: "",
  });
  const [filtros, setFiltros] = useState({
    id: "",
    fecha_entrada: "",
    fecha_salida: "",
  });

  useEffect(() => {
    obtenerMantenimientos();
    obtenerEquipos();
  }, []);

  const obtenerMantenimientos = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarMantenimientos);

      setMantenimientos(respuesta.data.data);
    } catch (error) {
      console.error(
        "Error al obtener los mantenimientos:",
        error.response ? error.response.data.data : error
      );
    }
  };

  const obtenerEquipos = async () => {
    try {
      const response = await AxiosPublico.get(ListarEquipos);
      setEquipos(response.data.data); // Suponiendo que la respuesta contiene los datos de los equipos
    } catch (error) {
      console.error("Error al obtener los equipos:", error);
    }
  };

  const handleShow = (
    modo,
    mantenimiento = {
      id_mantenimiento: "",
      id_equipo: "",
      equipo_descripcion: "",
      numero_serie: "",
      descripcion: "",
      fecha_entrada: "",
      fecha_salida: "",
    }
  ) => {
    console.log("Mantenimiento seleccionado para el modal:", mantenimiento);

    // Convertir las fechas al formato adecuado (yyyy-mm-dd)
    const fechaEntrada = mantenimiento.fecha_entrada
      ? new Date(mantenimiento.fecha_entrada).toISOString().split("T")[0]
      : "";
    const fechaSalida = mantenimiento.fecha_salida
      ? new Date(mantenimiento.fecha_salida).toISOString().split("T")[0]
      : "";

    setModo(modo);
    setMantenimientoSeleccionado({
      ...mantenimiento,
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/home";
        return;
      }
      let response;

      if (modo === "Agregar") {
        response = await AxiosPrivado.post(
          GuardarMantenimiento,
          mantenimientoseleccionado,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMantenimientos((prevMantenimientos) => [
          ...prevMantenimientos,
          response.data,
        ]);
        obtenerMantenimientos();
        mostrarAlertaOK("Mantenimiento Creado Exitosamente!");
      } else if (modo === "Editar") {
        response = await AxiosPrivado.put(
          `${ActualizarMantenimiento}/${mantenimientoseleccionado.id_mantenimiento}`,
          mantenimientoseleccionado,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setMantenimientos((prevMantenimientos) =>
          prevMantenimientos.map((mantenimiento) =>
            mantenimiento.id_mantenimiento ===
            mantenimientoseleccionado.id_mantenimiento
              ? response.data
              : mantenimiento
          )
        );
        obtenerMantenimientos();
        mostrarAlertaOK("Mantenimiento Actualizado Exitosamente!");
      } else if (modo === "Eliminar") {
        if (mantenimientoseleccionado.id_mantenimiento) {
          try {
            // Hacemos la solicitud DELETE pasando el ID en la URL
            response = await AxiosPrivado.delete(
              `${EliminarMantenimiento}/${mantenimientoseleccionado.id_mantenimiento}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              setMantenimientos((prevMantenimientos) =>
                prevMantenimientos.filter(
                  (mantenimiento) =>
                    mantenimiento.id_mantenimiento !==
                    mantenimientoseleccionado.id_mantenimiento
                )
              );
              obtenerMantenimientos();
              mostrarAlertaOK("Mantenimiento Eliminado Exitosamente!");
            } else {
              mostrarAlertaError("Error al eliminar el mantenimiento");
            }
          } catch (error) {
            console.error("Error al realizar la operación:", error);
            if (error.response && error.response.status === 401) {
              sessionStorage.removeItem("user");
              window.location.href = "/";
            }
            mostrarAlertaError(
              "Error al realizar la operación, por favor intenta nuevamente."
            );
          }
        }
      }
      setShowModal(false); // Cerrar el modal después de la operación
    } catch (error) {
      console.error("Error al realizar la operación:", error);
      mostrarAlertaError(
        "Error al realizar la operación, por favor intenta nuevamente."
      );
    }
  };

  const obtenerValoresUnicos = (campo) => {
    return [
      ...new Set(mantenimientos.map((mantenimiento) => mantenimiento[campo])),
    ];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    return (
      mantenimiento.estado === 1 &&
      (filtros.id === "" ||
        mantenimiento.id_mantenimiento.toString().includes(filtros.id)) &&
      (filtros.fecha_entrada === "" ||
        mantenimiento.fecha_entrada === filtros.fecha_entrada) &&
      (filtros.fecha_salida === "" ||
        mantenimiento.fecha_salida === filtros.fecha_salida)
    );
  });

  const handleIdChange = async (id) => {
    if (!id) return; // Si no hay ID, no hacer nada

    try {
      const equipoSeleccionado = equipos.find(
        (equipo) => equipo.id_equipo === Number(id)
      );
      if (equipoSeleccionado) {
        setMantenimientoSeleccionado({
          ...mantenimientoseleccionado,
          id_equipo: equipoSeleccionado.id_equipo,
          equipo_descripcion: equipoSeleccionado.descripcion,
          numero_serie: equipoSeleccionado.numero_serie,
        });
      }
    } catch (error) {
      console.error("Error al seleccionar el equipo:", error);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <h1
            className="text-center text-success"
            style={{
              fontSize: "2.5rem",
              fontWeight: "900",
              color: "#28a745",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              marginTop: "1px",
            }}
          >
            Gestión de Mantenimientos TI
          </h1>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant="success"
              className="mr-3"
              onClick={() => handleShow("Agregar")}
            >
              Agregar Mantenimiento
            </Button>
            <div
              className="row"
              style={{ marginLeft: "10%", marginRight: "auto" }}
            >
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
              <div className="col-md-5">
                <select
                  className="form-control"
                  name="fecha_entrada"
                  value={filtros.fecha_entrada}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por Fecha de Entrada</option>
                  {obtenerValoresUnicos("fecha_entrada").map((fecha) => (
                    <option key={fecha} value={fecha}>
                      {new Date(fecha).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  name="fecha_salida"
                  value={filtros.fecha_salida}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por Fecha de Salida</option>
                  {obtenerValoresUnicos("fecha_salida").map((fecha) => (
                    <option key={fecha} value={fecha}>
                      {new Date(fecha).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Mantenimientos */}
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped text-center ">
                <thead>
                  <tr className="text-center align-middle">
                    <th>ID</th>
                    <th>Equipo</th>
                    <th>Serie</th>
                    <th>Descripcion</th>
                    <th>Fecha de Entrada</th>
                    <th>Fecha de Salida</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMantenimientos
                    .filter((mantenimiento) => mantenimiento.estado === 1)
                    .map((mantenimiento) => (
                      <tr
                        key={mantenimiento.id_mantenimiento}
                        className="align-middle"
                      >
                        <td>{mantenimiento.id_mantenimiento}</td>
                        <td>{mantenimiento.equipo_descripcion}</td>
                        <td>{mantenimiento.numero_serie}</td>
                        <td>{mantenimiento.descripcion}</td>
                        <td>
                          {new Date(
                            mantenimiento.fecha_entrada
                          ).toLocaleDateString()}
                        </td>
                        <td>
                          {new Date(
                            mantenimiento.fecha_salida
                          ).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center">
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                handleShow("Editar", mantenimiento)
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleShow("Eliminar", mantenimiento)
                              }
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modo} Mantenimientos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modo !== "Eliminar" ? (
            <Form>
              <Form.Group controlId="equipo">
                <Form.Label>Equipo</Form.Label>
                <Form.Control
                  as="select"
                  value={mantenimientoseleccionado.id_equipo}
                  onChange={(e) => {
                    handleIdChange(e.target.value);
                    console.log("Seleccion");
                  }}
                >
                  <option value="">Seleccione un equipo</option>
                  {equipos
                    .filter((equipo) => equipo.estado === 1) // Filtramos solo los equipos activos
                    .map((equipo) => (
                      <option key={equipo.descripcion} value={equipo.id_equipo}>
                        {equipo.descripcion}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="descripcion">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  value={mantenimientoseleccionado.descripcion}
                  onChange={(e) =>
                    setMantenimientoSeleccionado({
                      ...mantenimientoseleccionado,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="fechaEntrada">
                <Form.Label>Fecha de Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={mantenimientoseleccionado.fecha_entrada}
                  onChange={(e) =>
                    setMantenimientoSeleccionado({
                      ...mantenimientoseleccionado,
                      fecha_entrada: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group controlId="fechaSalida">
                <Form.Label>Fecha de Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={mantenimientoseleccionado.fecha_salida}
                  onChange={(e) =>
                    setMantenimientoSeleccionado({
                      ...mantenimientoseleccionado,
                      fecha_salida: e.target.value,
                    })
                  }
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
          <Button
            variant={modo === "Eliminar" ? "danger" : "primary"}
            onClick={handleSave}
          >
            {modo === "Eliminar" ? "Eliminar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
