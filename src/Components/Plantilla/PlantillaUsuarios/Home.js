import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AxiosPrivado, AxiosPublico } from "../../Axios/Axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo3 from '../../../assets/images/logo3.jpg';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  faLock,
  faTrash,
  faFilePdf,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import {
  ListarUsuarios,
  CrearUsuario,
  ActualizarUsuario,
  EliminarUsuario,
  UsuarioActualizarContrasena,
} from "../../Configuration/ApiUrls";
import { useSessionStorage } from "../../Context/storage/useSessionStorage";
import {
  mostrarAlertaError,
  mostrarAlertaOK,
} from "../../SweetAlert/SweetAlert";

export default function HomeUsuarios() {
  const [user] = useSessionStorage("user", {});
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("Agregar");
  const [usuarioseleccionado, setUsuarioSeleccionado] = useState({
    id_usuario: "",
    nombre: "",
    usuario: "",
    contrasena: "",
    confirmarContrasena: "",
    rol: "",
  });
  const [filtros, setFiltros] = useState({
    id: "",
    nombre: "",
    usuario: "",
    incluirRoles: "conRoles",
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await AxiosPublico.get(ListarUsuarios);
      setUsuarios(respuesta.data.data);
    } catch (error) {
      console.error(
        "Error al obtener los usuarios:",
        error.response ? error.response.data.data : error
      );
    }
  };

  const handleShow = (
    modo,
    usuario = {
      id_usuario: "",
      nombre: "",
      usuario: "",
      contrasena: "",
      confirmarContrasena: "",
      rol: "",
    }
  ) => {
    setModo(modo);
    setUsuarioSeleccionado(usuario);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!user || !user.token) {
        console.log("No token disponible, redirigiendo al login");
        window.location.href = "/HomeAdmin"; // Redirigir al home si no hay token
        return;
      }

      // Validación para Confirmar Contraseña
      if (modo === "Agregar" || modo === "Actualizar Contraseña") {
        if (
          usuarioseleccionado.contrasena !==
          usuarioseleccionado.confirmarContrasena
        ) {
          mostrarAlertaError("Las contraseñas no coinciden.");
          return;
        }
      }

      // Verifica que usuarioseleccionado tiene los datos correctos
      console.log("Usuario seleccionado para verificar:", usuarioseleccionado);

      // Verificar si el usuario ya existe en la base de datos
      try {
        const verificarUsuario = await AxiosPublico.get(
          `http://localhost:3000/api/users/users/${usuarioseleccionado.usuario}`
        );

        // Si el usuario existe y no es el mismo que estamos editando, se muestra el mensaje de error
      if (verificarUsuario.status === 200 && usuarioseleccionado.id_usuario !== verificarUsuario.data.user.id_usuario) {
        mostrarAlertaError('El Usuario ya existe!');
        return; 
      }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Si la respuesta es 404, significa que el usuario no existe, por lo que puedes proceder con el POST
          console.log("Usuario no encontrado, podemos crear uno nuevo");
        } else {
          mostrarAlertaError("Error al verificar el usuario");
          return;
        }
      }

      // Si el usuario no existe, proceder con la creación (POST)
      let response;

      if (modo === "Agregar") {
        console.log("Usuario para crear:", usuarioseleccionado);

        // Aquí asegúrate de que la URL y los datos de usuario sean correctos
        response = await AxiosPrivado.post(CrearUsuario, usuarioseleccionado, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log("Respuesta del servidor:", response);
        setUsuarios((prevUsuarios) => [...prevUsuarios, response.data]);
        obtenerUsuarios();
        mostrarAlertaOK("Usuario Creado Exitosamente!");
      } else if (modo === "Editar") {
        response = await AxiosPrivado.put(
          `${ActualizarUsuario}/${usuarioseleccionado.id_usuario}`,
          usuarioseleccionado,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setUsuarios((prevUsuarios) =>
          prevUsuarios.map((usuario) =>
            usuario.id_usuario === usuarioseleccionado.id_usuario
              ? response.data
              : usuario
          )
        );
        obtenerUsuarios();
        mostrarAlertaOK("Usuario Actualizado Exitosamente!");
      } else if (modo === "Eliminar") {
        if (usuarioseleccionado.id_usuario) {
          try {
            response = await AxiosPrivado.delete(
              `${EliminarUsuario}/${usuarioseleccionado.id_usuario}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );

            if (response.status === 200 || response.status === 201) {
              setUsuarios((prevUsuarios) =>
                prevUsuarios.filter(
                  (usuario) =>
                    usuario.id_usuario !== usuarioseleccionado.id_usuario
                )
              );
              obtenerUsuarios();
              mostrarAlertaOK("Usuario Eliminado Exitosamente!");
            } else {
              mostrarAlertaError("Error al eliminar el usuario");
            }
          } catch (error) {
            console.error("Error al realizar la operación:", error);
            mostrarAlertaError(
              "Error al realizar la operación, por favor intenta nuevamente."
            );
          }
        }
      } else if (modo === "Actualizar Contraseña") {
        response = await AxiosPrivado.put(
          `${UsuarioActualizarContrasena}/${usuarioseleccionado.id_usuario}`,
          {
            contrasena: usuarioseleccionado.contrasena,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        mostrarAlertaOK("Contraseña Actualizada Exitosamente!");
        setShowModal(false);
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
    if (!usuarios || !Array.isArray(usuarios)) return [];
    return [...new Set(usuarios.map((usuario) => usuario[campo]))];
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredUsuarios = (usuarios || []).filter((usuario) => {
    return (
      (filtros.id === "" ||
        usuario.id_usuario.toString().includes(filtros.id)) &&
      (filtros.nombre === "" || usuario.nombre === filtros.nombre) &&
      (filtros.usuario === "" || usuario.usuario === filtros.usuario)
    );
  });

  const generarReportePDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logo3;

    doc.addImage(img, "JPEG", 20, 18, 42, 30);

    // Centrar el título
    doc.setFontSize(20).setFont("helvetica", "bold"); // Tamaño de fuente del título
    const title = "Reporte de Usuarios";
    const titleWidth = doc.getTextWidth(title); // Calcular el ancho del título
    const pageWidth = doc.internal.pageSize.getWidth(); // Ancho de la página
    const titleX = (pageWidth - titleWidth) / 2; // Calcular la posición X para centrar
    doc.text(title, titleX, 40); // Ajustar la posición Y según sea necesario

    // Generar la tabla
    autoTable(doc, {
      startY: 50, // Posición de la tabla
      head: [["ID", "Nombre", "Usuario", "Rol"]],
      body: usuarios.map((usuario) => [
        usuario.id_usuario,
        usuario.nombre,
        usuario.usuario,
        usuario.rol,
      ]),
      headStyles: {
        fillColor: [0, 114, 54],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        font: "helvetica",
        fontSize: 12,
        halignalign: "center",
      },
      bodyStyles: {
        font: "helvetica",
      },
    });

    // Guardar el PDF
    doc.save("reporte_usuarios.pdf");
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
            Gestión de Usuarios TI
          </h1>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant="success"
              className="mr-2"
              onClick={() => handleShow("Agregar")}
            >
              Registrar Usuario
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
              <div className="col-md-4">
                <select
                  className="form-control"
                  name="nombre"
                  value={filtros.nombre}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por Nombre</option>
                  {obtenerValoresUnicos("nombre").map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  name="usuario"
                  value={filtros.usuario}
                  onChange={handleFilterChange}
                >
                  <option value="">Filtrar por Usuario</option>
                  {obtenerValoresUnicos("usuario").map((usuario) => (
                    <option key={usuario} value={usuario}>
                      {usuario}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button variant="danger" onClick={generarReportePDF}>
              <FontAwesomeIcon icon={faFilePdf} /> Generar Reporte
            </Button>
          </div>

          <div className="card">
            <div
              className="card-body"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                      <td>{usuario.id_usuario}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.usuario}</td>
                      <td>{usuario.rol}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleShow("Editar", usuario)}
                          >
                            <FontAwesomeIcon icon={faUserEdit} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleShow("Eliminar", usuario)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() =>
                              handleShow("Actualizar Contraseña", usuario)
                            }
                          >
                            <FontAwesomeIcon icon={faLock} />
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

      {/* Modal para Agregar/Editar/Eliminar Usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modo} Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modo !== "Eliminar" ? (
            <Form>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioseleccionado.nombre}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioseleccionado,
                      nombre: e.target.value,
                    })
                  }
                  disabled={modo === "Actualizar Contraseña"}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={usuarioseleccionado.usuario}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioseleccionado,
                      usuario: e.target.value,
                    })
                  }
                  disabled={modo === "Actualizar Contraseña"}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={usuarioseleccionado.rol || ""}
                  onChange={(e) =>
                    setUsuarioSeleccionado({
                      ...usuarioseleccionado,
                      rol: e.target.value,
                    })
                  }
                  disabled={modo === "Actualizar Contraseña"}
                >
                  <option value="">Seleccione Un Rol</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                </Form.Control>
              </Form.Group>
              {(modo === "Agregar" || modo === "Actualizar Contraseña") && (
                <>
                  <Form.Group>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={usuarioseleccionado.contrasena}
                      onChange={(e) =>
                        setUsuarioSeleccionado({
                          ...usuarioseleccionado,
                          contrasena: e.target.value,
                        })
                      }
                      disabled={modo === "Editar"}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      value={usuarioseleccionado.confirmarContrasena}
                      onChange={(e) =>
                        setUsuarioSeleccionado({
                          ...usuarioseleccionado,
                          confirmarContrasena: e.target.value,
                        })
                      }
                      disabled={modo === "Editar"}
                    />
                  </Form.Group>
                </>
              )}
            </Form>
          ) : (
            <p>
              ¿Estás seguro de eliminar este usuario? <br />
              <strong>{usuarioseleccionado.nombre}</strong>
            </p>
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
