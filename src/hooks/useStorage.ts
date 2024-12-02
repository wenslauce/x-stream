import { useState, useEffect, useCallback } from 'react';
import { storage } from '../services/storage';

export function useStorage<T>(key: string, initialValue: T) {
  // Get initial value from storage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getCacheItem<T>(key);
      return item ?? initialValue;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return initialValue;
    }
  });

  // Return wrapped version of storage setValue function
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for previous state
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.setCacheItem(key, valueToStore);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }, [key, storedValue]);

  // Remove item from storage
  const removeValue = useCallback(() => {
    try {
      storage.cacheStorage.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }, [key, initialValue]);

  // Listen for storage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `x-stream-cache-${key}`) {
        try {
          const newValue = e.newValue 
            ? JSON.parse(e.newValue).data as T 
            : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error parsing storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    key,
  };
}