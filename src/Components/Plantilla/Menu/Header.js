import React, { useContext } from "react";
import { UserContext } from "../../Context/user/UserContext"; // Importa el contexto directamente
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = () => {
  const { usuario } = useContext(UserContext);
  console.log("Usuario desde Header:", usuario); // Asegúrate de que aquí se imprime el usuario correctamente

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
            <Link className="nav-link" to="#" onClick={''}>
              Cerrar sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;