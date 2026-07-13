/**
 * useLocalStorage.ts — Custom Hook: Persistent State in localStorage
 *
 * Drop-in replacement for useState that persists the value to localStorage.
 * Useful for cart state, user preferences, auth tokens, etc.
 *
 * @example
 *   const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
 */

import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: could not read key "${key}"`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: could not set key "${key}"`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
