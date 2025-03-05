import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import {
  ListarMantenimientos,
  GuardarMantenimiento,
  ActualizarMantenimiento,
  EliminarMantenimiento,
  ObtenerEquipoById, // Esta API es la que usas para obtener el equipo por ID
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
  const [mantenimientoseleccionado, setMantenimientoSeleccionado] = useState({
    id_mantenimiento: "",
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

  const handleShow = (
    modo,
    mantenimiento = {
      id_equipo: "",
      equipo_descripcion: "",
      numero_serie: "",
      descripcion: "",
      fecha_entrada: "",
      fecha_salida: "",
    }
  ) => {
    console.log("Mantenimiento seleccionado para el modal:", mantenimiento);
    setModo(modo);
    setMantenimientoSeleccionado(mantenimiento);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/home"; // Redirigir al home si no hay token
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
      (filtros.id === "" ||
        mantenimiento.id_mantenimiento.toString().includes(filtros.id)) &&
      (filtros.fecha_entrada === "" ||
        mantenimiento.fecha_entrada === filtros.fecha_entrada) &&
      (filtros.fecha_salida === "" ||
        mantenimiento.fecha_salida === filtros.fecha_salida)
    );
  });

  const handleIdChange = async (e) => {
    const id = e.target.value.trim();  // Usamos trim() para eliminar espacios innecesarios
  
    // Verificamos si el ID está vacío
    if (id === "") {
      mostrarAlertaError("Por favor ingrese un ID válido");
      setMantenimientoSeleccionado({
        ...mantenimientoseleccionado,
        equipo_descripcion: "",
        numero_serie: "",
      });
      return;  // Salimos de la función para evitar hacer la consulta a la API
    }
  
    // Si el ID no está vacío, actualizamos el estado
    setMantenimientoSeleccionado({ ...mantenimientoseleccionado, id_equipo: id });
  
    try {
      // Hacemos la consulta a la API solo si el ID es válido
      const respuesta = await AxiosPublico.get(`${ObtenerEquipoById}/${id}`);
  
      if (respuesta.data) {
        // Si la respuesta tiene datos, actualizamos el estado con la descripción y número de serie
        setMantenimientoSeleccionado({
          ...mantenimientoseleccionado,
          equipo_descripcion: respuesta.data.equipo_descripcion,
          numero_serie: respuesta.data.numero_serie,
        });
      } else {
        // Si no se encuentran datos, mostramos un mensaje de error
        mostrarAlertaError("Equipo no encontrado");
        setMantenimientoSeleccionado({
          ...mantenimientoseleccionado,
          equipo_descripcion: "",
          numero_serie: "",
        });
      }
    } catch (error) {
      // Si hay un error en la consulta, mostramos un mensaje de error
      mostrarAlertaError("Error al obtener el equipo");
      setMantenimientoSeleccionado({
        ...mantenimientoseleccionado,
        equipo_descripcion: "",
        numero_serie: "",
      });
    }
  };
  

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <h1 className="text-center text-success" style={{ fontSize: "2.5rem", fontWeight: "900", color: "#28a745", textTransform: "uppercase", letterSpacing: "1px", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", marginTop: "1px" }}>
            Gestión de Mantenimientos de TI
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
            <div className="row" style={{ marginLeft: "10%", marginRight: "auto" }}>
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
                      <tr key={mantenimiento.id_mantenimiento} className="align-middle">
                        <td>{mantenimiento.id_mantenimiento}</td>
                        <td>{mantenimiento.equipo_descripcion}</td>
                        <td>{mantenimiento.numero_serie}</td>
                        <td>{mantenimiento.descripcion}</td>
                        <td>{new Date(mantenimiento.fecha_entrada).toLocaleDateString()}</td>
                        <td>{new Date(mantenimiento.fecha_salida).toLocaleDateString()}</td>
                        <td className="d-flex justify-content-center align-items-center gap-2">
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleShow("Editar", mantenimiento)}
                          >
                            Editar
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleShow("Eliminar", mantenimiento)}
                          >
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{modo} Mantenimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modo !== "Eliminar" ? (
            <Form>
              <Form.Group>
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={mantenimientoseleccionado.id_equipo}
                  onChange={handleIdChange}
                  placeholder="Ingresar ID"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={mantenimientoseleccionado.equipo_descripcion}
                  disabled
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Numero de Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={mantenimientoseleccionado.numero_serie}
                  disabled
                />
              </Form.Group>
              <Form.Group>
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
              <Form.Group>
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
              <Form.Group>
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
            <div>
              <h4>¿Seguro que deseas eliminar este mantenimiento?</h4>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modo === "Eliminar" ? "Eliminar" : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
