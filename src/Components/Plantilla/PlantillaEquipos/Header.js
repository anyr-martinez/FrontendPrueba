import React from "react";
import { useContextUsuario } from "../../Context/user/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { usuario, setCerrarSesion } = useContextUsuario();
  const navigate = useNavigate();


  const handleLogout = () => {
    setCerrarSesion(); // Cierra la sesión y borra el contexto
    navigate("/"); // Redirige al login
  };

  const renderUsername = () => {
    if (usuario && usuario.usuario) {
      return <span style={{ color: "#145a32", fontWeight: "600" }}>Bienvenido, {usuario.nombre}</span>;
    }
    return <span style={{ color: "#FF6600" }}>Invitado</span>;
  };
  

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" style={{color: "#145a32"}} ></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/Home" className="nav-link" style={{color: "#145a32", fontWeight: "700"}}>
            Menú
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="#">
            <FontAwesomeIcon icon={faUser} style={{ color:  "#FF6600"}} className="mr-2" />
            {renderUsername()}
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
  );
};

export default Header;
