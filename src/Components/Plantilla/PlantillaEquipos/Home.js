import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado } from "../../Axios/Axios"; 
import { ListarEquipos, GuardarEquipo, ActualizarEquipo, EliminarEquipo } from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";  

export default function HomeEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("Agregar");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState({
    id: "",
    descripcion: "",
    tipo: "",
    numero_serie: "",
    fecha_entrada: "",
  });
  
  const [user, setUser] = useSessionStorage("user", {});  // Obtener el usuario desde sessionStorage

  useEffect(() => {
    obtenerEquipos(); // Llamada para obtener equipos cuando se monta el componente
  }, []);

  const obtenerEquipos = async () => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
  
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login...");
        window.location.href = "/"; // Redirigir al login si no hay token
        return;
      }
  
      console.log("Token encontrado. Intentando obtener equipos...");
      const respuesta = await AxiosPrivado.get(ListarEquipos, {
        headers: {
          Authorization: `Bearer ${user.token}`  // Asegúrate de pasar el token correctamente
        }
      });
      console.log("Respuesta completa de la API:", respuesta);
      setEquipos(respuesta.data); // Establece la lista de equipos
    } catch (error) {
      console.error("Error al obtener los equipos:", error.response ? error.response.data : error);
  
      if (error.response && error.response.status === 401) {
        console.log("Token inválido o expirado. Redirigiendo al login...");
        sessionStorage.removeItem("user"); // Eliminar el token si es inválido
        window.location.href = "/"; // Redirigir al login
      }
    }
  };
  
  const handleShow = (modo, equipo = { id: "", descripcion: "", tipo: "", numero_serie: "", fecha_entrada: "" }) => {
    setModo(modo); // Establece el modo (Agregar, Editar, Eliminar)
    setEquipoSeleccionado(equipo); // Establece el equipo seleccionado
    setShowModal(true); // Muestra el modal
  };

  const handleSave = async () => {
    try {
      // Verifica si el token está presente antes de realizar las solicitudes
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/"; // Redirigir al login si no hay token
        return;
      }

      let response;

      // Dependiendo del modo, se realiza la acción correspondiente
      if (modo === "Agregar") {
        response = await AxiosPrivado.post(GuardarEquipo, equipoSeleccionado);
      } else if (modo === "Editar") {
        response = await AxiosPrivado.put(`${ActualizarEquipo}/${equipoSeleccionado.id}`, equipoSeleccionado);
      } else if (modo === "Eliminar") {
        response = await AxiosPrivado.delete(`${EliminarEquipo}/${equipoSeleccionado.id}`);
      }

      console.log("Respuesta del servidor:", response.data);
      if (modo === "Agregar") {
        setEquipos([...equipos, response.data]); // Actualiza la lista de equipos con el nuevo
      } else {
        setEquipos(equipos.map(equipo => equipo.id === equipoSeleccionado.id ? equipoSeleccionado : equipo)); // Actualiza el equipo editado
      }
      setShowModal(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar el equipo:", error);
      // Manejo de errores, si hay un error 401 redirigir al login
      if (error.response && error.response.status === 401) {
        console.log("Token inválido o expirado. Redirigiendo al login...");
        sessionStorage.removeItem("user"); // Eliminar el token si es inválido
        window.location.href = "/login"; // Redirigir al login
      }
    }
  };

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

          <div className="card">
            <div className="card-body">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Número de Serie</th>
                    <th>Fecha de Entrada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td>{equipo.id}</td>
                      <td>{equipo.descripcion}</td>
                      <td>{equipo.tipo}</td>
                      <td>{equipo.numero_serie}</td>
                      <td>{equipo.fecha_entrada}</td>
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

      {/* MODAL */}
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
                  value={equipoSeleccionado.fecha_entrada}
                  onChange={(e) => setEquipoSeleccionado({ ...equipoSeleccionado, fecha_entrada: e.target.value })}
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
