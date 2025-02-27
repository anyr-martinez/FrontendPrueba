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
    id: "",
    descripcion: "",
    tipo: "",
    numero_serie: "",
    fecha_registro: "",
  });
  const [filtros, setFiltros] = useState({
    id: "",
    descripcion: "",
    tipo: "",
    fecha_registro: "",
  });

  useEffect(() => {
    obtenerEquipos();
  }, []);

  // Obtener los equipos al cargar el componente
  const obtenerEquipos = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarEquipos);
      setEquipos(respuesta.data.data); // Establece la lista de equipos
    } catch (error) {
      console.error("Error al obtener los equipos:", error.response ? error.response.data.data : error);
    }
  };

  // Mostrar el modal con el modo adecuado (Agregar, Editar, Eliminar)
  const handleShow = (modo, equipo = { id: "", descripcion: "", tipo: "", numero_serie: "", fecha_registro: "" }) => {
    setModo(modo); // Establece el modo (Agregar, Editar, Eliminar)
    setEquipoSeleccionado(equipo); // Establece el equipo seleccionado
    setShowModal(true); // Muestra el modal
  };

  // Guardar, Editar o Eliminar un equipo
  const handleSave = async () => {
    try {
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/home"; // Redirigir al home si no hay token
        return;
      }

      let response;

      // Dependiendo del modo, se realiza la acción correspondiente
      if (modo === "Agregar") {
        response = await AxiosPrivado.post(GuardarEquipo, equipoSeleccionado, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEquipos((prevEquipos) => [...prevEquipos, response.data]); 
        obtenerEquipos(); // Actualiza la lista con el nuevo equipo
        mostrarAlertaOK("Equipo Creado Exitosamente!");
      } else if (modo === "Editar") {
        response = await AxiosPrivado.put(`${ActualizarEquipo}/${equipoSeleccionado.id}`, equipoSeleccionado, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEquipos((prevEquipos) =>
          prevEquipos.map((equipo) =>
            equipo.id === equipoSeleccionado.id ? response.data : equipo
          )
        );
        mostrarAlertaOK("Equipo Actualizado Exitosamente!");
      } else if (modo === "Eliminar") {
        response = await AxiosPrivado.delete(`${EliminarEquipo}/${equipoSeleccionado.id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setEquipos((prevEquipos) =>
          prevEquipos.filter((equipo) => equipo.id !== equipoSeleccionado.id)
        );
        mostrarAlertaOK("Equipo Eliminado Exitosamente!");
      }

      setShowModal(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      mostrarAlertaError("Error al crear un equipo nuevo");
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem("user"); // Eliminar el token si es inválido
        window.location.href = "/"; // Redirigir al login
      }
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Filtrar los equipos según los filtros establecidos
  const filteredEquipos = equipos.filter((equipo) => {
    return (
      (filtros.id === "" || equipo.id_equipo.toString().includes(filtros.id)) &&
      (filtros.descripcion === "" || equipo.descripcion.toLowerCase().includes(filtros.descripcion.toLowerCase())) &&
      (filtros.tipo === "" || equipo.tipo.toLowerCase().includes(filtros.tipo.toLowerCase())) &&
      (filtros.fecha_registro === "" || equipo.fecha_registro.includes(filtros.fecha_registro))
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
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Filtrar por ID"
              name="id"
              value={filtros.id}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Filtrar por Descripción"
              name="descripcion"
              value={filtros.descripcion}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Filtrar por Tipo"
              name="tipo"
              value={filtros.tipo}
              onChange={handleFilterChange}
            />
            <input
              type="date"
              className="form-control mb-2"
              name="fecha_registro"
              value={filtros.fecha_registro}
              onChange={handleFilterChange}
            />
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
                    .filter((equipo) => equipo.estado === 1) // Filtro para que solo muestre los equipos activos
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
              <Form.Group className="mt-2">
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.tipo}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, tipo: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Número de Serie</Form.Label>
                <Form.Control
                  type="text"
                  value={equipoSeleccionado.numero_serie}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, numero_serie: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>Fecha de Entrada</Form.Label>
                <Form.Control
                  type="date"
                  value={equipoSeleccionado.fecha_registro}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, fecha_registro: e.target.value })}
                />
              </Form.Group>
            </Form>
          ) : (
            <p>¿Estás seguro de que deseas eliminar este equipo?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant={modo === "Eliminar" ? "danger" : "primary"} onClick={handleSave}>
            {modo}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
