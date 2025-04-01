import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import fondo from "../../assets/images/fondo.jpg";
import { mostrarAlerta, mostrarAlertaOK, mostrarAlertaError } from "../SweetAlert/SweetAlert";
import { UsuarioIniciarSesion } from "../Configuration/ApiUrls";
import { AxiosPublico } from "../Axios/Axios";
import { UserContext } from "../Context/user/UserContext";
import { useSessionStorage } from "../Context/storage/useSessionStorage";
import useSpecialLogin from "../../hooks/useSpecialLogin";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLogin } = useContext(UserContext);
  const [, setStoredUser] = useSessionStorage("user", usuario);
  const { checkSpecialLogin } = useSpecialLogin();

  // Función para manejar el submit del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!usuario || !contrasena) {
      mostrarAlerta("Por favor, complete todos los campos.", "warning");
      return;
    }
  
    if (checkSpecialLogin(usuario, contrasena)) {
      return;
    }
  
    try {
      const response = await AxiosPublico.post(UsuarioIniciarSesion, {
        usuario: usuario,
        contrasena: contrasena,
      });
  
      if (response?.data.data && response.data.data.token) {
        const { token, usuario, nombre, id, rol } = response.data.data;
  
        // Guardar sesión
        setLogin({
          usuario: {
            usuario: usuario,
            nombre: nombre,
            id: id,
            rol: rol,  
          },
          token: token,
        });
  
        // Guardar en sessionStorage
        setStoredUser({ usuario, token });
  
        // Redirigir según el rol del usuario
        if (rol === "admin") {
          navigate("/HomeAdmin");  // Página de admin
        } else {
          navigate("/home");  // Página de usuario
        }
  
        mostrarAlertaOK("Inicio de sesión exitoso", "success");
      } else {
        mostrarAlertaError("Error en el inicio de sesión. Inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      mostrarAlertaError("Usuario o contraseña incorrectos.");
    }
  };

  // Función para manejar el cambio en los campos de entrada
  const handleChange = (event) => {
    const { id, value } = event.target;
    if (id === "usuario") {
      setUsuario(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  return (
    <section className="vh-100" style={{ 
      backgroundImage: `url(${fondo})`, 
      backgroundSize: 'contain',  
      backgroundPosition: 'center', 
      backgroundRepeat: 'repeat',
      backgroundColor: 'rgba(0, 0, 0, 2.5)' 
    }}>
      <div className="container py-5 h-100 d-flex justify-content-center align-items-center">
        <div className="col col-xl-6">
          <div className="card" style={{ 
            borderRadius: '2rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.85)', 
            padding: '30px', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="card-body text-black text-center">
              {/* Logo */}
              <div className="mb-3">
                <img src={logo} alt="Logo" style={{ width: '250px' }} />
              </div>
              
              <div className="d-flex align-items-center mb-3 pb-1 justify-content-center">
                <i className="fas fa-cog fa-2x me-3" style={{ color: '#007236' }}></i>
                <span className="h2 fw-bold mb-0">Iniciar Sesión</span>
              </div>
  
              <form onSubmit={handleSubmit}>
                {/* Campo de Usuario */}
                <div className="form-outline mb-4 position-relative">
                  <input
                    type="text"
                    id="usuario"
                    className="form-control form-control-lg pe-4"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={handleChange}
                  />
                  <i className="fas fa-user position-absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', color: '#007236' }}></i>
                </div>
  
                {/* Campo de Contraseña */}
                <div className="form-outline mb-4 position-relative">
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg pe-4"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={handleChange}
                  />
                  <i className="fas fa-lock position-absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', color: '#007236' }}></i>
                </div>
  
                {/* Botón de Iniciar sesión */}
                <div className="pt-1 mb-4 d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    style={{ fontSize: '16px', padding: '10px 50px', width: 'auto' }}
                  >
                    INGRESAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  ); 
};

export default Login;
