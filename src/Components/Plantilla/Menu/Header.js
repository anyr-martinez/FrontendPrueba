import React, { useEffect } from "react";
import { useContextUsuario } from "../../Context/user/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { usuario, setCerrarSesion } = useContextUsuario();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Usuario desde Header:", usuario); // Verifica si cambia aquí
  }, [usuario]); // Esto hará que el efecto se ejecute cada vez que 'usuario' cambie

  const handleLogout = () => {
    setCerrarSesion();
    navigate("/");
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="/" className="nav-link">
            Inicio
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="#">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            {usuario ? `Bienvenido, ${usuario.login}` : "Invitado"}
          </a>
        </li>

        {usuario && (
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
