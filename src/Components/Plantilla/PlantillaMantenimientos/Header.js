import React, { useState, useEffect } from "react";
import { useContextUsuario } from "../../Context/user/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { usuario, setCerrarSesion } = useContextUsuario();
  const navigate = useNavigate();
  const [fechaRegistro, setFechaRegistro] = useState(null);
  const [rol, setRol] = useState(""); // Para almacenar el rol del usuario

  useEffect(() => {
    // Fecha de registro: Usamos la fecha actual
    const now = new Date();
    setFechaRegistro(now);

    // Asignamos el rol basado en el rol del usuario
    if (usuario) {
      if (usuario.rol === "admin") {
        setRol("Administrador");
      } else if (usuario.rol === "usuario") {
        setRol("Usuario");
      }
    }
  }, [usuario]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav
        className="main-header navbar navbar-expand navbar-light shadow-sm"
        style={{ backgroundColor: "#F0F0E6" }}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" style={{ color: "#007236" }}></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a
              href="/"
              className="nav-link"
              style={{ color: "#007236", fontWeight: "700" }}
            >
              Inicio
            </a>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link d-flex align-items-center"
              href="#"
              data-toggle="modal"
              data-target="#userModal"
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "#FF7F32" }}
                className="mr-2"
              />
              <span
                style={{
                  color: "#007236",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {usuario ? `Bienvenido(a), ${usuario.nombre}` : "Invitado"}
              </span>
            </a>
          </li>

          {usuario && usuario.login && (
            <li className="nav-item">
              <Link className="nav-link" to="#" onClick={handleLogout}>
                Cerrar sesión
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Modal de Usuario */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div
            className="modal-content"
            style={{ borderRadius: "12px", backgroundColor: "#F0F0E6" }}
          >
            <div
              className="modal-header"
              style={{ backgroundColor: "#007236", color: "#fff" }}
            >
              <h5 className="modal-title" id="userModalLabel">
                Perfil de Usuario
              </h5>
              <button
                type="button"
                className="close text-white"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              <FontAwesomeIcon
                icon={faUser}
                size="4x"
                style={{ color: "#FF7F32" }}
                className="mb-3"
              />
              <h4 className="font-weight-bold" style={{ color: "#007236" }}>
                {usuario?.nombre}
              </h4>
              <p className="text-muted">@{usuario?.usuario}</p>
              <hr />
              <p>
                <strong>Rol:</strong> {rol || "Cargando..."}
              </p>
              <p>
                <strong>Fecha de Registro:</strong>{" "}
                {fechaRegistro ? fechaRegistro.toLocaleDateString() : "Cargando..."}
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#FF7F32", color: "#fff" }}
                data-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
