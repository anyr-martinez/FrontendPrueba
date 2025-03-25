import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  ReporteMantenimientoFecha,
  ReporteMantenimientoFechaTerminado,
  ReporteMantenimientoTipo,
  ReporteMantenimientoTipoTerminado,
  ReporteMantenimientoGeneral,
  ReporteMantenimientoGeneralTerminado,
  ListarEquipos,
} from "../../Configuration/ApiUrls";
import {
  mostrarAlertaError,
  mostrarAlertaWarning,
} from "../../SweetAlert/SweetAlert";

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
  });
  const [tipos, setTipos] = useState([]);
  const [modalFecha, setModalFecha] = useState(false);
  const [modalTipo, setModalTipo] = useState(false);
  const [tipoReporte, setTipoReporte] = useState(""); // Estado para gestionar el tipo de reporte

  useEffect(() => {
    const obtenerTiposDesdeEquipos = async () => {
      try {
        const response = await AxiosPublico.get(ListarEquipos);
        console.log("Respuesta de la API:", response.data); // Verifica la estructura

        // Extraer el array correctamente desde response.data.data
        const equipos = response.data.data;

        if (Array.isArray(equipos)) {
          const tiposUnicos = [...new Set(equipos.map((e) => e.tipo))];
          setTipos(tiposUnicos);
        } else {
          console.error("Error: La respuesta no es un array", equipos);
        }
      } catch (error) {
        console.error("Error al obtener equipos", error);
      }
    };
    obtenerTiposDesdeEquipos();
  }, []);

  const handleGenerarReporte = () => {
    console.log("handleGenerarReporte se ejecutó", {
      tipoReporte,
      modalFecha,
      modalTipo,
      filtros,
    });

    if (tipoReporte === "activos") {
      if (modalFecha) {
        generarReportePDF(
          ReporteMantenimientoFecha,
          filtros,
          "Reporte_Fecha_Mantenimientos.pdf"
        );
      } else if (modalTipo) {
        if (!filtros.tipoEquipo) {
          console.log("No se seleccionó un tipo de equipo");
          mostrarAlertaWarning(
            "Seleccione un tipo de equipo antes de generar el reporte."
          );
          return;
        }

        if (!tipos.includes(filtros.tipoEquipo)) {
          console.log(
            `No se encontró el tipo de equipo "${filtros.tipoEquipo}" en los equipos registrados.`
          );
          mostrarAlertaError(
            `No se encontró el tipo de equipo "${filtros.tipoEquipo}" en los equipos registrados.`
          );
          return;
        }

        generarReportePDF(
          ReporteMantenimientoTipo,
          filtros,
          "Mantenimientos_PorTipoDeEquipo.pdf"
        );
      }
    } else if (tipoReporte === "finalizados") {
      if (modalFecha) {
        generarReportePDF(
          ReporteMantenimientoFechaTerminado,
          filtros,
          "Fecha_Mantenimientos_Finalizados.pdf"
        );
      } else if (modalTipo) {
        if (!filtros.tipoEquipo) {
          console.log("No se seleccionó un tipo de equipo");
          mostrarAlertaWarning(
            "Seleccione un tipo de equipo antes de generar el reporte."
          );
          return;
        }

        if (!tipos.includes(filtros.tipoEquipo)) {
          console.log(
            `No se encontró el tipo de equipo "${filtros.tipoEquipo}" en los equipos finalizados.`
          );
          mostrarAlertaError(
            `No se encontró el tipo de equipo "${filtros.tipoEquipo}" en los equipos finalizados.`
          );
          return;
        }

        generarReportePDF(
          ReporteMantenimientoTipoTerminado,
          filtros,
          "Reporte_Por_Tipo_Finalizados.pdf"
        );
      }
    }

    setModalFecha(false);
    setModalTipo(false);
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
                <FontAwesomeIcon icon={faFilePdf} /> Reporte por Fecha (Activos)
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
                (Activos)
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  generarReportePDF(
                    ReporteMantenimientoGeneral,
                    {},
                    "Reporte_General_Mantenimientos.pdf"
                  )
                }
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte General
              </Button>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="card">
            <div className="card-body text-center">
              <Button
                variant="danger"
                onClick={() => {
                  setModalFecha(true);
                  setTipoReporte("finalizados");
                }}
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte por Fecha
                (Finalizados)
              </Button>

              <Button
                variant="danger"
                onClick={() => {
                  setModalTipo(true);
                  setTipoReporte("finalizados");
                }}
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte por Tipo de Equipo
                (Finalizados)
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  generarReportePDF(
                    ReporteMantenimientoGeneralTerminado,
                    {},
                    "Reporte_General_Finalizados.pdf"
                  )
                }
                className="me-2 mb-2"
              >
                <FontAwesomeIcon icon={faFilePdf} /> Reporte General Finalizados
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal para Reporte por Fecha */}
      <Modal show={modalFecha} onHide={() => setModalFecha(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Rango de Fechas</Modal.Title>
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
          <Modal.Title>Seleccionar Tipo de Equipo</Modal.Title>
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
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipoEquipo, index) => (
                  <option key={index} value={tipoEquipo}>
                    {tipoEquipo}
                  </option>
                ))}
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
    </div>
  );
};

export default HomeReportes;
