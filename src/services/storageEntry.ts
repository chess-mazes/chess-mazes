export function loadFromLocalStorage<T>(key: string, initialValue: T) {
  if (typeof window === 'undefined') return initialValue;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`error while getting local storage value of ${key}`);
    console.error(error);
    return initialValue;
  }
}

export function setLocalStorage<T>(key: string, valueToStore: T) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  } catch (error) {
    console.error(`error while setting local storage value of ${key}`);
    console.error(error);
  }
}

export class StorageEntry<T> {
  constructor(public key: string, public initialValue: T) {}

  public get(): T {
    return loadFromLocalStorage(this.key, this.initialValue);
  }

  public set(value: T) {
    setLocalStorage(this.key, value);
  }
}
