import { Injectable } from '@angular/core';

type CanBeStored = string | number | boolean | object | [] | undefined | null;
interface StorageItem {
  item: CanBeStored;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem<T extends CanBeStored>(key: string, value: T): void {
    const serialized = JSON.stringify({ item: value, timestamp: Date.now() });
    localStorage.setItem(key, serialized);
  }

  getItem<T extends CanBeStored>(key: string): T {
    const item = localStorage.getItem(key);

    return this.safeParse<StorageItem>(item)?.item as T;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  private safeParse<T>(item: string | null): T | undefined {
    try {
      return item ? JSON.parse(item) : undefined;
    } catch {
      return undefined;
    }
  }
}
