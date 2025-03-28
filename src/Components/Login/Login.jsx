import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import compu from "../../assets/images/compu.png";
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
    <section className="vh-100" style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'contain', backgroundPosition: 'center' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-8">
            <div className="card" style={{ borderRadius: '2rem', opacity: 0.90 }}> {/* Más transparencia en el rectángulo */}
              <div className="row g-0">
                {/* Columna con el formulario de login */}
                <div className="col-md-6 col-lg-7 d-flex align-items-center justify-content-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form onSubmit={handleSubmit}> {/* Conexión con el submit */}
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i className="fas fa-cog fa-2x me-3" style={{ color: '#007236' }}></i>
                        <span className="h1 fw-bold mb-0">Iniciar sesión</span>
                      </div>
  
                      {/* Campo de Usuario */}
                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="usuario"
                          className="form-control form-control-lg"
                          placeholder="Usuario"
                          value={usuario}  // Vínculo con el estado
                          onChange={handleChange}  // Llamada a la función handleChange
                        />
                      </div>
  
                      {/* Campo de Contraseña */}
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          placeholder="Contraseña"
                          value={contrasena}  // Vínculo con el estado
                          onChange={handleChange}  // Llamada a la función handleChange
                        />
                      </div>
  
                      {/* Botón de Iniciar sesión */}
                      <div className="pt-1 mb-4" style={{ display: 'flex', justifyContent: 'center' }}> {/* Centrado del botón */}
                        <button
                          className="btn btn-primary"
                          type="submit"  // Cambié el tipo a submit
                          style={{ fontSize: '16px', padding: '10px 50px', width: 'auto' }} // Botón más pequeño y menos largo
                        >
                          INGRESAR
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
  
                {/* Columna con la imagen más pequeña */}
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={compu} // Usamos la imagen importada
                    alt="Login image"
                    className="img-fluid"
                    style={{
                      objectFit: 'cover', // Asegura que la imagen cubra bien el área
                      objectPosition: 'center', // Centra la imagen
                      borderRadius: '1rem 0 0 1rem', // Bordes redondeados para la imagen
                      height: '80%', // Reduce el tamaño de la imagen
                      width: '90%', // Reduce el tamaño de la imagen
                      margin: 'auto' // Centra la imagen
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
