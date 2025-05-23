import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  ListarEquiposActivos,
  GuardarEquipo,
  ActualizarEquipo,
  EliminarEquipo,
  ReporteEquipos,
  ReporteEquiposTerminados,
} from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import {
  mostrarAlertaError,
  mostrarAlertaOK,
} from "../../SweetAlert/SweetAlert";

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
  });

  useEffect(() => {
    obtenerEquipos();
  }, []);

  const obtenerEquipos = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarEquiposActivos);
      setEquipos(respuesta.data.data);
    } catch (error) {
      console.error(
        "Error al obtener los equipos:",
        error.response ? error.response.data.data : error
      );
    }
  };

  const generarReportePDF = async (tipo) => {
    try {
      //Definir la URL segun el tipo de reporte
      const urlReporte =
        tipo === "inactivos" ? ReporteEquiposTerminados : ReporteEquipos;

      const response = await AxiosPrivado.get(urlReporte, {
        responseType: "blob",
      });
      // Crear un Blob con los datos binarios
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Crear un enlace para descargar el archivo
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download =
        tipo === "inactivos"
          ? "Reporte_Equipos_Inactivos.pdf"
          : "Reporte_Equipos.pdf";
      link.click();
    } catch (error) {
      console.error("Error al generar el reporte PDF:", error);
    }
  };

  const handleShow = (
    modo,
    equipo = {
      id_equipo: "",
      descripcion: "",
      tipo: "",
      numero_serie: "",
      fecha_registro: "",
    }
  ) => {
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
        response = await AxiosPrivado.put(
          `${ActualizarEquipo}/${equipoSeleccionado.id_equipo}`,
          equipoSeleccionado,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setEquipos((prevEquipos) =>
          prevEquipos.map((equipo) =>
            equipo.id_equipo === equipoSeleccionado.id_equipo
              ? response.data
              : equipo
          )
        );
        obtenerEquipos();
        mostrarAlertaOK("Equipo Actualizado Exitosamente!");
      } else if (modo === "Eliminar") {
        if (equipoSeleccionado.id_equipo) {
          try {
            // Hacemos la solicitud DELETE pasando el ID en la URL
            response = await AxiosPrivado.delete(
              `${EliminarEquipo}/${equipoSeleccionado.id_equipo}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              setEquipos((prevEquipos) =>
                prevEquipos.filter(
                  (equipo) => equipo.id_equipo !== equipoSeleccionado.id_equipo
                )
              );
              obtenerEquipos();
              console.log(
                "ID del equipo seleccionado:",
                equipoSeleccionado.id_equipo
              );
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
      (filtros.tipo === "" || equipo.tipo === filtros.tipo)
    );
  });

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <h1
            className="text-center text-success"
            style={{
              fontSize: "2.5rem", // Aumentamos el tamaño de la fuente
              fontWeight: "900", // Hacemos la fuente más negrita
              color: "#28a745", // Color verde similar al de la marca
              textTransform: "uppercase",
              letterSpacing: "1px", // Espaciado entre letras
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Sombra sutil
              marginTop: "1px",
            }}
          >
            Gestión de Equipos TI
          </h1>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* Botón para agregar equipo */}
            <Button
              variant="success"
              className="mr-3"
              onClick={() => handleShow("Agregar")}
            >
              Agregar Equipo
            </Button>

            {/* Filtros centrados */}
            <div className="row mx-auto text-center d-flex justify-content-center">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filtrar por ID"
                  name="id"
                  value={filtros.id}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  name="tipo"
                  value={filtros.tipo}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por Tipo</option>
                  {obtenerValoresUnicos("tipo").map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones de reporte alineados a la derecha */}
            <div className="d-flex gap-2">
              <Button
                variant="danger"
                onClick={() => generarReportePDF("activos")}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte
              </Button>
              <Button
                variant="danger"
                onClick={() => generarReportePDF("inactivos")}
              >
                <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte Inactivos
              </Button>
            </div>
          </div>

          {/* Tabla de Equipos */}
          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Número de Serie</th>
                    <th className="text-center">Fecha de Registro</th>
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
                        <td className="text-center">{equipo.numero_serie}</td>
                        <td className="text-center">
                          {new Date(equipo.fecha_registro).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleShow("Editar", equipo)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleShow("Eliminar", equipo)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
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
        backdrop="static"
        keyboard={false}
      >
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
                  onChange={(e) =>
                    setEquipoSeleccionado({
                      ...equipoSeleccionado,
                      descripcion: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.tipo}
                  onChange={(e) =>
                    setEquipoSeleccionado({
                      ...equipoSeleccionado,
                      tipo: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Número de Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.numero_serie}
                  onChange={(e) =>
                    setEquipoSeleccionado({
                      ...equipoSeleccionado,
                      numero_serie: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Fecha de Registro</Form.Label>
                <Form.Control
                  type="date"
                  value={
                    equipoSeleccionado.fecha_registro
                      ? new Date(equipoSeleccionado.fecha_registro)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEquipoSeleccionado({
                      ...equipoSeleccionado,
                      fecha_registro: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          ) : (
            <p>
              ¿Estás seguro de eliminar este usuario? <br />
              <strong>{equipoSeleccionado.descripcion}</strong>
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
