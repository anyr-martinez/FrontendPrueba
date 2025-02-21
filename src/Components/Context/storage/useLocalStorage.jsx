import { useState } from 'react';

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName); // Fixed keyname typo
      
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      // Handle function updates
      const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
      
      // Save to localStorage
      window.localStorage.setItem(keyName, JSON.stringify(valueToStore)); // Fixed newVakye typo
      
      // Save state
      setStoredValue(valueToStore);
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  };

  return [storedValue, setValue];
};