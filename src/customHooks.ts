// React Custom Hooks Logic Simulators (for Node.js-based environment testing)

export function simulateUseToggle(initialValue = false) {
  let value = initialValue;
  const toggle = () => {
    value = !value;
    return value;
  };
  return [() => value, toggle] as const;
}

export class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  clear() {
    this.store = {};
  }
}

export function simulateUseLocalStorage<T>(key: string, initialValue: T, storage: MockLocalStorage) {
  const getValue = (): T => {
    const val = storage.getItem(key);
    return val ? JSON.parse(val) : initialValue;
  };

  const setValue = (newValue: T) => {
    storage.setItem(key, JSON.stringify(newValue));
  };

  return [getValue, setValue] as const;
}
