import { Injectable, signal } from '@angular/core';

export type Provider = 'openrouter' | 'openai';
export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
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
  } as const;

  // Default values
  private readonly DEFAULTS = {
    provider: 'openrouter' as Provider,
    model: 'openai/gpt-4o-mini',
    system: '',
    theme: 'dark' as Theme,
  } as const;

  getProvider(): Provider {
    return (localStorage.getItem(this.STORAGE_KEYS.provider) as Provider) || this.DEFAULTS.provider;
  }

  setProvider(provider: Provider): void {
    localStorage.setItem(this.STORAGE_KEYS.provider, provider);
  }

  getModel(): string {
    return localStorage.getItem(this.STORAGE_KEYS.model) || this.DEFAULTS.model;
  }

  setModel(model: string): void {
    localStorage.setItem(this.STORAGE_KEYS.model, model);
  }

  getSystem(): string {
    return localStorage.getItem(this.STORAGE_KEYS.system) || this.DEFAULTS.system;
  }

  setSystem(system: string): void {
    localStorage.setItem(this.STORAGE_KEYS.system, system);
  }

  getTheme(): Theme {
    return (localStorage.getItem(this.STORAGE_KEYS.theme) as Theme) || this.DEFAULTS.theme;
  }

  setTheme(theme: Theme): void {
    localStorage.setItem(this.STORAGE_KEYS.theme, theme);
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
}
