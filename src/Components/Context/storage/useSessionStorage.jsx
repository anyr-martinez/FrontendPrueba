import { useState } from "react";
import { DesEncriptar, Encriptar } from "../../Encrypt/Crypto"; 

export const useSessionStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const encryptedValue = window.sessionStorage.getItem(keyName);//Valor ya encriptado en sessionStorage

      if (encryptedValue) {
        const decryptedValue = DesEncriptar(encryptedValue);
        
        if (decryptedValue && typeof decryptedValue === "string") {
          try {
            const parsedValue = JSON.parse(decryptedValue);  //Valor desencriptado y parseado
            return parsedValue;
          } catch (error) {
            console.error(`Error al parsear JSON desencriptado (${keyName}):`, error);
            return defaultValue;
          }
        } else {
          console.warn(`No se pudo desencriptar correctamente (${keyName}).`);
          return defaultValue;
        }
      } else {
        // Guardamos el valor por defecto si no existe
        const encryptedDefaultValue = Encriptar(JSON.stringify(defaultValue));
        window.sessionStorage.setItem(keyName, encryptedDefaultValue);
        console.log(`Guardando valor por defecto en sessionStorage (${keyName}):`, defaultValue);
        return defaultValue;
      }
    } catch (err) {
      console.error(`Error al leer desde sessionStorage (${keyName}):`, err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      const encryptedValue = Encriptar(JSON.stringify(newValue));
      window.sessionStorage.setItem(keyName, encryptedValue); //Guarda un nuevo valor en sessionStorage
      console.log(`Nuevo valor guardado en sessionStorage (${keyName}):`, newValue);
      setStoredValue(newValue);
    } catch (err) {
      console.error(`Error al escribir en sessionStorage (${keyName}):`, err);
    }
  };

  return [storedValue, setValue];
};
