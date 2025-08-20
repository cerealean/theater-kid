import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type Provider = 'openrouter' | 'openai' | 'fake';
export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // Cache localStorage values
  private readonly STORAGE_KEYS = {
    provider: 'tk:provider',
    model: 'tk:model',
    system: 'tk:system',
    theme: 'tk:theme',
    openrouter: 'tk:openrouter',
    openai: 'tk:openai',
    debugFake: 'tk:debugFake',
  } as const;

  // Default values
  private readonly DEFAULTS = {
    provider: 'openrouter' as Provider,
    model: 'openai/gpt-4o-mini',
    system: '',
    theme: 'dark' as Theme,
    debugFake: false,
  } as const;

  readonly storage = inject(StorageService);

  readonly theme = signal<Theme>(
    this.storage.getItem(this.STORAGE_KEYS.theme) ?? this.DEFAULTS.theme,
  );
  readonly provider = signal<Provider>(
    this.storage.getItem(this.STORAGE_KEYS.provider) ?? this.DEFAULTS.provider,
  );
  readonly model = signal<string>(
    this.storage.getItem(this.STORAGE_KEYS.model) ?? this.DEFAULTS.model,
  );
  readonly system = signal<string>(
    this.storage.getItem(this.STORAGE_KEYS.system) ?? this.DEFAULTS.system,
  );
  readonly debugFake = signal<boolean>(this.getInitialDebugFake());

  constructor() {
    effect(() => {
      this.storage.setItem(this.STORAGE_KEYS.theme, this.theme());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_KEYS.provider, this.provider());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_KEYS.model, this.model());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_KEYS.system, this.system());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_KEYS.debugFake, String(this.debugFake()));
    });
  }

  getOpenRouterKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.openrouter);
  }

  setOpenRouterKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEYS.openrouter, key);
  }

  getOpenAIKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.openai);
  }

  setOpenAIKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEYS.openai, key);
  }

  private getInitialDebugFake(): boolean {
    // Check query param first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debugFake') === '1') {
      return true;
    }

    // Fall back to localStorage
    const stored = this.storage.getItem(this.STORAGE_KEYS.debugFake);
    return stored === 'true';
  }

  setDebugFake(enabled: boolean): void {
    this.debugFake.set(enabled);
  }
}
