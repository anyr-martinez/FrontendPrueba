import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../Components/Context/user/UserContext';
import { useSessionStorage } from '../Components/Context/storage/useSessionStorage';

const useAuth = () => {
  const { user, token } = useContext(UserContext);  // Obtenemos los datos del contexto
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
  const [storedUser] = useSessionStorage('user');  // Datos del usuario desde sessionStorage

  // Al iniciar la aplicación, verificamos si el usuario está autenticado
  useEffect(() => {
    if (storedUser && storedUser.token) {
      setIsAuthenticated(true);
    } else if (user && user.token) {
      setIsAuthenticated(true);
    }
  }, [storedUser, user]);

  // Retornamos si está autenticado y los datos del usuario
  return { isAuthenticated, user: user || storedUser };
};

export default useAuth;
