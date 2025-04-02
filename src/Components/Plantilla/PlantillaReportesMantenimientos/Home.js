import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  ReporteMantenimientoFecha,
  ReporteMantenimientoTipo,
  ReporteMantenimientoGeneral,
  ListarEquipos,
} from "../../Configuration/ApiUrls";
import {
  mostrarAlertaError,
  mostrarAlertaWarning,
} from "../../SweetAlert/SweetAlert";

// Función para generar el reporte PDF
const generarReportePDF = async (url, filtros, nombreReporte) => {
  try {
    const response = await AxiosPrivado.get(url, {
      params: filtros,
      responseType: "arraybuffer",
    });

    if (!response.data || response.data.byteLength === 0) {
      mostrarAlertaWarning(
        "No se encontraron registros para el reporte solicitado."
      );
      return;
    }

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = nombreReporte;
    link.click();
  } catch (error) {
    console.error("Error al generar el reporte PDF:", error);

    // Si el error es 404, significa que no hay datos disponibles
    if (error.response && error.response.status === 404) {
      mostrarAlertaWarning(
        "No hay registros disponibles para generar el reporte."
      );
    } else {
      mostrarAlertaError("No se pudo generar el reporte. Inténtelo de nuevo.");
    }
  }
};

const HomeReportes = () => {
  const [filtros, setFiltros] = useState({
    startDate: "",
    endDate: "",
    tipoEquipo: "",
    estado: "",  // Añadido el filtro de estado
  });
  const [tipos, setTipos] = useState([]);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalTipo, setModalTipo] = useState(false);
  const [modalGeneral, setModalGeneral] = useState(false); // Modal para reporte general
  const [tipoReporte, setTipoReporte] = useState("");

  useEffect(() => {
    const obtenerTiposDesdeEquipos = async () => {
      try {
        const response = await AxiosPublico.get(ListarEquipos);
        const equipos = response.data.data;

        if (Array.isArray(equipos)) {
          const tiposUnicos = [...new Set(equipos.map((e) => e.tipo))];
          setTipos(tiposUnicos);
        }
      } catch (error) {
        console.error("Error al obtener equipos", error);
      }
    };
    obtenerTiposDesdeEquipos();
  }, []);

  const handleGenerarReporte = () => {
    // Lógica para generar el reporte
    if (tipoReporte === "activos") {
      // Reporte por fecha (activos)
      if (modalFecha) {
        generarReportePDF(
          ReporteMantenimientoFecha,
          filtros, // Incluye el estado en los filtros
          "Reporte_Fecha_Mantenimientos.pdf"
        );
      } else if (modalTipo) {
        generarReportePDF(
          ReporteMantenimientoTipo,
          filtros,
          `Mantenimientos_Tipo_${filtros.tipoEquipo}.pdf`
        );
      }
    }
    // Reporte general
    else if (tipoReporte === "general") {
      // Si 'filtros.estado' está vacío, significa que seleccionaron "Todos"
      let estadoNombre = "Todos";
      if (filtros.estado === "0") {
        estadoNombre = "Pendientes";
      } else if (filtros.estado === "1") {
        estadoNombre = "En Proceso";
      } else if (filtros.estado === "2") {
        estadoNombre = "Completados";
      }
  
      // Llamar a la función generarReportePDF con el nombre adecuado
      generarReportePDF(
        ReporteMantenimientoGeneral,
        { estado: filtros.estado || "todos" },  // Pasar "todos" si el estado está vacío
        `Reporte_General_Mantenimientos_${estadoNombre}.pdf`
      );
    }
  
    // Cerrar los modales después de generar el reporte
    setModalFecha(false);
    setModalTipo(false);
    setModalGeneral(false); // Cerrar modal de reporte general
  };
    

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div
          className="container-fluid d-flex justify-content-center"
          style={{ height: "25vh" }}
        >
          <div className="text-center" style={{ marginTop: "15vh" }}>
            <h1
              className="text-success"
              style={{
                fontSize: "2.5rem",
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                marginTop: "1px",
                marginBottom: "20px",
              }}
            >
              REPORTES DE MANTENIMIENTOS
            </h1>
          </div>
        </div>
      </section>

      <section className="content py-4">
        <div className="container-fluid px-3 px-md-6">
          <div className="card">
            <div className="card-body text-center">
              <Button
                variant="danger"
                onClick={() => {
                  setModalFecha(true);
                  setTipoReporte("activos");
                }}
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte por Fecha
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setModalTipo(true);
                  setTipoReporte("activos");
                }}
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte por Tipo de Equipo
                
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setTipoReporte("general");
                  setModalGeneral(true); // Mostrar modal para reporte general
                }}
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte General
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modales para seleccionar filtros */}

      {/* Modal para Reporte por Fecha */}
      <Modal show={modalFecha} onHide={() => setModalFecha(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Rango de Fechas y Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) =>
                  setFiltros({ ...filtros, startDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) =>
                  setFiltros({ ...filtros, endDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value })
                }
              >
                <option value="">Seleccione un estado</option>
                <option value="3">Todos</option>
                <option value="0">Pendiente</option>
                <option value="1">En Proceso</option>
                <option value="2">Completado</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalFecha(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleGenerarReporte}>
            Generar Reporte
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Reporte por Tipo */}
      <Modal show={modalTipo} onHide={() => setModalTipo(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Tipo de Equipo y Estado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tipo de Equipo</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) =>
                  setFiltros({ ...filtros, tipoEquipo: e.target.value })
                }
              >
                <option value="">Seleccione un tipo de equipo</option>
                {tipos.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value })
                }
              >
                <option value="">Seleccione un estado</option>
                <option value="0">Pendiente</option> 
                <option value="1">En Proceso</option>
                <option value="2">Completado</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalTipo(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleGenerarReporte}>
            Generar Reporte
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Reporte General */}
      <Modal show={modalGeneral} onHide={() => setModalGeneral(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Estado para Reporte General</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) =>
                  setFiltros({ ...filtros, estado: e.target.value })
                }
              >
                <option value="">Seleccione un estado</option>
                <option value="3">Todos</option>
                <option value="0">Pendiente</option>
                <option value="1">En Proceso</option>
                <option value="2">Completado</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalGeneral(false)}>
            Cerrar
          </Button>
          <Button variant="danger" onClick={handleGenerarReporte}>
            Generar Reporte
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomeReportes;
