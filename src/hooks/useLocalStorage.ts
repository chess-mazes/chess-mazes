import {StorageEntry} from '@/services/storageEntry';
import {useRef, useState} from 'react';

export function useLocalStorage<T>(key: string, initValue: T, onInit?: (value: T) => void) {
  const storageEntry = useRef(new StorageEntry<T>(key, initValue));
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = storageEntry.current.get();
    if (onInit) onInit(value);
    return value;
  });
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    storageEntry.current.set(valueToStore);
  };
  return [storedValue, setValue] as const;
}
