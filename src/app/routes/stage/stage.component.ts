import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { ChatMessage } from '../../core/llm/types';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { OpenAIProvider } from '../../core/llm/openai.provider';
import { OpenRouterProvider } from '../../core/llm/openrouter.provider';
import { startOpenRouterPKCE, finishOpenRouterPKCE } from '../../core/llm/openrouter.oauth';
import { ConfigService } from '../../core/services/config.service';

@Component({
  standalone: true,
  selector: 'app-stage',
  imports: [CommonModule, FormsModule],
  templateUrl: './stage.component.html',
})
export class StageComponent {
  private config = inject(ConfigService);
  private route = inject(ActivatedRoute);

  provider = signal<'openrouter' | 'openai'>(this.config.getProvider());
  model = signal<string>(this.config.getModel());
  system = signal<string>(this.config.getSystem());
  input = signal<string>('');
  messages = signal<ChatMessage[]>([]);
  streaming = signal<boolean>(true);
  busy = signal<boolean>(false);
  sceneId = signal<string | null>(null);

  // Getters and setters for ngModel
  get inputValue() {
    return this.input();
  }
  set inputValue(value: string) {
    this.input.set(value);
  }

  get systemValue() {
    return this.system();
  }
  set systemValue(value: string) {
    this.system.set(value);
  }

  get modelValue() {
    return this.model();
  }
  set modelValue(value: string) {
    this.model.set(value);
  }

  get providerValue() {
    return this.provider();
  }
  set providerValue(value: 'openrouter' | 'openai') {
    this.provider.set(value);
  }

  public md = inject(MarkdownService);

  private abort?: AbortController;
  private openai = new OpenAIProvider();
  private openrouter = new OpenRouterProvider();

  constructor() {
    this.finishOAuthIfNeeded();

    // Watch for route parameter changes
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.sceneId.set(params.get('sceneId'));
    });
  }

  async finishOAuthIfNeeded() {
    const key = await finishOpenRouterPKCE();
    if (key) {
      localStorage.setItem('tk:openrouter', key);
      this.openrouter.setKey(key);
      this.messages.update((m) => [...m, { role: 'system', content: '✅ OpenRouter connected.' }]);
    } else {
      const existing = localStorage.getItem('tk:openrouter');
      if (existing) this.openrouter.setKey(existing);
    }
  }

  connectOpenRouter() {
    startOpenRouterPKCE(location.origin + location.pathname);
  }
  saveOpenAIKey(raw: string) {
    const key = raw.trim();
    if (!key) return;
    localStorage.setItem('tk:openai', key);
    this.openai.setKey(key);
    this.messages.update((m) => [...m, { role: 'system', content: '🔑 OpenAI key saved.' }]);
  }

  onEnterKey(event: KeyboardEvent) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  async send() {
    const text = this.inputValue.trim();
    if (!text || this.busy()) return;

    if (this.systemValue && this.messages().length === 0) {
      this.messages.update((m) => [...m, { role: 'system', content: this.systemValue }]);
    }
    this.messages.update((m) => [...m, { role: 'user', content: text }]);
    this.inputValue = '';
    this.busy.set(true);

    const svc = this.provider() === 'openai' ? this.openai : this.openrouter;
    const model = this.modelValue;
    this.abort?.abort();
    this.abort = new AbortController();

    if (this.streaming()) {
      let acc = '';
      this.messages.update((m) => [...m, { role: 'assistant', content: '…' }]);
      const idx = this.messages().length - 1;
      try {
        await svc.createChat({
          model,
          messages: this.messages(),
          stream: true,
          abortSignal: this.abort.signal,
          onToken: (delta) => {
            acc += delta;
            const copy = this.messages().slice();
            copy[idx] = { role: 'assistant', content: acc };
            this.messages.set(copy);
          },
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.messages.update((m) => [...m, { role: 'system', content: '❌ ' + errorMessage }]);
      } finally {
        this.busy.set(false);
      }
    } else {
      try {
        const res = await svc.createChat({
          model,
          messages: this.messages(),
          stream: false,
          abortSignal: this.abort.signal,
        });
        this.messages.update((m) => [...m, { role: 'assistant', content: res?.text ?? '' }]);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.messages.update((m) => [...m, { role: 'system', content: '❌ ' + errorMessage }]);
      } finally {
        this.busy.set(false);
      }
    }
  }
}
