import { Injectable } from '@angular/core';

type CanBeStored = string | number | boolean | object | [] | undefined | null;

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem<T = CanBeStored>(key: string, value: T): void {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  getItem<T = CanBeStored>(key: string): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : (undefined as T);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
