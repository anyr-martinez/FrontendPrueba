import { useState } from "react";
import { DesEncriptar, Encriptar } from "../../Encrypt/Crypto";  // Asegúrate de que estas funciones estén importadas correctamente

export const useSessionStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Verifica si hay datos en sessionStorage
      const encryptedValue = window.sessionStorage.getItem(keyName);

      if (encryptedValue) {
        // Intentamos desencriptar el valor
        const decryptedValue = DesEncriptar(encryptedValue);

        // Verificamos si los datos desencriptados son válidos
        if (decryptedValue) {
          return decryptedValue;  // Ya no hacemos JSON.parse aquí, DesEncriptar devuelve un objeto
        } else {
          console.error("No se pudo desencriptar el valor de sessionStorage.");
          return defaultValue;
        }
      } else {
        // Si no hay valor, lo encriptamos y lo guardamos
        const encryptedDefaultValue = Encriptar(JSON.stringify(defaultValue));  // Encriptamos el valor
        window.sessionStorage.setItem(keyName, encryptedDefaultValue);
        return defaultValue;
      }
    } catch (err) {
      console.error("Error al leer desde sessionStorage:", err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      // Encriptamos el valor antes de guardarlo
      const encryptedValue = Encriptar(JSON.stringify(newValue));
      window.sessionStorage.setItem(keyName, encryptedValue);
      setStoredValue(newValue);
    } catch (err) {
      console.error("Error al escribir en sessionStorage:", err);
    }
  };

  return [storedValue, setValue];
};
