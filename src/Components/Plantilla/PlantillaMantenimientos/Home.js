import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FaSyncAlt } from "react-icons/fa";
import {
  ListarMantenimientos,
  GuardarMantenimiento,
  ActualizarMantenimiento,
  ListarEquipos,
  ObtenerEstadoMantenimiento,
} from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import {
  mostrarAlertaError,
  mostrarAlertaOK,
} from "../../SweetAlert/SweetAlert";
import Swal from "sweetalert2";
import Select from "react-select"; // Importar react-select

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
    estado: 0,
  });
  const [filtros, setFiltros] = useState({
    estado: "",
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
      setEquipos(response.data.data);
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
      estado: 0,
    }
  ) => {
    console.log("Mantenimiento seleccionado para el modal:", mantenimiento);

    // Verificar si el estado es 2 (completado), y evitar abrir el modal de edición
    if (mantenimiento.estado === 2 && modo === "Editar") {
      Swal.fire({
        title: "Estado Completado",
        text: "Este mantenimiento ya está completado y no puede ser modificado.",
        icon: "info",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

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
      }

      setShowModal(false);
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
  const cambiarEstado = (mantenimiento) => {
    if (mantenimiento.estado === 2) {
      Swal.fire({
        title: "Estado Completado",
        text: "Este mantenimiento ya está completado.",
        icon: "info",
        showConfirmButton: false,
        timer: 1900,
      });
      return; // Evita que continúe con el cambio de estado
    }

    const nuevoEstado = mantenimiento.estado === 0 ? 1 : 2; // De Pendiente → En proceso → Completado

    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres cambiar el estado a ${
        nuevoEstado === 1 ? "En Proceso" : "Completado"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado!",
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarEstado(mantenimiento.id_mantenimiento, nuevoEstado);
      }
    });
  };

  const actualizarEstado = async (id_mantenimiento, nuevoEstado) => {
    try {
      const response = await AxiosPrivado.put(
        `${ObtenerEstadoMantenimiento}/${id_mantenimiento}`,
        {
          estado: nuevoEstado,
        }
      );

      if (response.status === 200) {
        mostrarAlertaOK("Estado Actualizado!");
        obtenerMantenimientos();
      } else {
        throw new Error("Error al actualizar el estado");
      }
    } catch (error) {
      console.error("Error:", error);
      mostrarAlertaError("Error", "No se pudo actualizar el estado", "error");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    const fechaEntrada = new Date(mantenimiento.fecha_entrada);
    const fechaSalida = new Date(mantenimiento.fecha_salida);
    const filtroFechaEntrada = filtros.fecha_entrada
      ? new Date(filtros.fecha_entrada)
      : null;
    const filtroFechaSalida = filtros.fecha_salida
      ? new Date(filtros.fecha_salida)
      : null;

    return (
      // Filtrar por estado
      (filtros.estado === "" ||
        mantenimiento.estado.toString() === filtros.estado) &&
      // Filtrar por fecha de entrada
      (filtros.fecha_entrada === "" || fechaEntrada >= filtroFechaEntrada) &&
      // Filtrar por fecha de salida
      (filtros.fecha_salida === "" || fechaSalida <= filtroFechaSalida)
    );
  });

  const handleIdChange = (id) => {
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

  const equiposFiltrados = equipos.filter((equipo) => equipo.estado === 1);

  const opciones = equipos
    .filter(
      (equipo) =>
        equipo.estado === 1 ||
        equipo.id_equipo === mantenimientoseleccionado.id_equipo
    ) // Mostrar equipos activos y el equipo seleccionado
    .map((equipo) => ({
      value: equipo.id_equipo,
      label: equipo.descripcion,
    }));

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      setMantenimientoSeleccionado({
        ...mantenimientoseleccionado,
        id_equipo: selectedOption.value,
      });
    } else {
      // Si no hay selección (es decir, el valor es null o undefined), puedes tomar alguna acción
      setMantenimientoSeleccionado({
        ...mantenimientoseleccionado,
        id_equipo: null,
      });
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
          {/* Fila con el botón y los filtros alineados a la izquierda */}
          <div className="d-flex justify-content-start align-items-center mb-3">
            {/* Botón de Agregar Mantenimiento */}
            <Button
              variant="success"
              className="mr-3"
              onClick={() => handleShow("Agregar")}
            >
              Agregar Mantenimiento
            </Button>

            {/* Filtros para Mantenimientos */}
            <div
              className="d-flex align-items-center"
              style={{ marginLeft: "165px" }}
            >
              <div className="col-md-4 ">
                <select
                  name="estado"
                  className="form-control"
                  value={filtros.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por estado</option>
                  <option value="0">Pendiente</option>
                  <option value="1">En Proceso</option>
                  <option value="2">Completado</option>
                </select>
              </div>

              {/* Contenedor para "Fecha de Entrada" y "Fecha de Salida" */}
              <div className="d-flex gap-3">
                <div className="col-md-5 ">
                  <input
                    type="date"
                    name="fecha_entrada"
                    className="form-control"
                    id="fecha_entrada"
                    value={filtros.fecha_entrada}
                    onChange={handleFilterChange}
                  />
                </div>

                <div className="col-md-5 ">
                  <input
                    type="date"
                    name="fecha_salida"
                    className="form-control"
                    id="fecha_salida"
                    value={filtros.fecha_salida}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Tabla de Mantenimientos */}
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead>
                  <tr className="align-middle">
                    <th className="text-center align-middle">ID</th>
                    <th className="text-left align-middle">Equipo</th>
                    <th className="text-center align-middle">Serie</th>
                    <th className="text-center align-middle">Descripción</th>
                    <th className="text-center">Fecha de Entrada</th>
                    <th className="text-center">Fecha de Salida</th>
                    <th className="text-center align-middle">Estado</th>
                    <th className="text-center align-middle">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMantenimientos.map((mantenimiento) => {
                    const equipo = equipos.find(
                      (equipo) => equipo.id_equipo === mantenimiento.id_equipo
                    );

                    return (
                      <tr key={mantenimiento.id_mantenimiento}>
                        <td>{mantenimiento.id_mantenimiento}</td>
                        <td>
                          {/* Mostrar la descripción del equipo */}
                          {equipo ? equipo.descripcion : "Equipo no encontrado"}
                        </td>
                        <td className="text-center">
                          {mantenimiento.numero_serie}
                        </td>
                        <td>{mantenimiento.descripcion}</td>
                        <td className="text-center">
                          {new Date(
                            mantenimiento.fecha_entrada
                          ).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          {new Date(
                            mantenimiento.fecha_salida
                          ).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          <button
                            className={`btn btn-sm ${
                              mantenimiento.estado === 0
                                ? "btn-danger"
                                : mantenimiento.estado === 1
                                ? "btn-warning"
                                : "btn-info"
                            } rounded-pill text-white`}
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.875rem",
                              opacity: 1,
                              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            {mantenimiento.estado === 0
                              ? "Pendiente"
                              : mantenimiento.estado === 1
                              ? "En proceso"
                              : "Completado"}
                          </button>
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            {/* Botón de cambiar estado */}
                            <button
                              onClick={() => cambiarEstado(mantenimiento)}
                              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                            >
                              <FaSyncAlt
                                className="me-1"
                                title="Cambiar Estado"
                              />
                            </button>

                            {/* Botón de Editar */}
                            <button
                              className="btn btn-warning btn-sm btn-lg d-flex align-items-center"
                              onClick={() =>
                                handleShow("Editar", mantenimiento)
                              }
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
          <Modal.Title>{modo} Mantenimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modo !== "Eliminar" ? (
            <Form>
              <Form.Group controlId="equipo">
                <Form.Label>Equipo</Form.Label>
                <Select
                  options={opciones}
                  value={opciones.find(
                    (option) =>
                      option.value === mantenimientoseleccionado.id_equipo // Usa el mismo tipo para comparar
                  )}
                  onChange={handleChange}
                  placeholder="Buscar equipo..."
                  isClearable
                  isSearchable
                />
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
            <p>
              ¿Estás seguro de eliminar este usuario? <br />
              <strong>{mantenimientoseleccionado.descripcion}</strong>
            </p>
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
