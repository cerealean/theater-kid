import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { ChatMessage } from '../../core/llm/types';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { OpenAIProvider } from '../../core/llm/openai.provider';
import { OpenRouterProvider } from '../../core/llm/openrouter.provider';
import { startOpenRouterPKCE, finishOpenRouterPKCE } from '../../core/llm/openrouter.oauth';

@Component({
  standalone: true,
  selector: 'tk-stage',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-56px)] grid grid-rows-[auto_1fr_auto]">
      <header class="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
        <div class="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div class="font-semibold tracking-wide">🎭 Theater Kid — Stage</div>
          
          <select class="tk-input px-2 py-2" [(ngModel)]="providerValue">
            <option value="openrouter">OpenRouter (OAuth)</option>
            <option value="openai">OpenAI (BYOK)</option>
          </select>
          
          <input class="tk-input px-3 py-2 w-64" placeholder="Model (e.g. openai/gpt-4o-mini)" [(ngModel)]="modelValue" />
          
          <div class="ml-auto flex items-center gap-2">
            <ng-container *ngIf="provider() === 'openrouter'; else openaiKey">
              <button class="tk-btn" (click)="connectOpenRouter()">Connect OpenRouter</button>
            </ng-container>
            <ng-template #openaiKey>
              <input class="tk-input px-3 py-2" placeholder="OpenAI API Key" type="password" (keydown.enter)="saveOpenAIKey($any($event.target).value)"/>
              <button class="tk-btn" (click)="saveOpenAIKey(($any($event.target).previousElementSibling.value))">Save</button>
            </ng-template>
            
            <label class="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" class="tk-input" [checked]="streaming()" (change)="streaming.set($any($event.target).checked)"/>
              stream
            </label>
          </div>
        </div>
      </header>
      
      <main class="overflow-auto">
        <div class="max-w-screen-md mx-auto p-4 space-y-3">
          <div *ngFor="let m of messages(); let i = index" class="flex">
            <div class="max-w-[80ch] w-fit px-4 py-3 rounded-bubble shadow-stage border border-white/10"
                 [ngClass]="{
                   'ml-auto': m.role === 'user',
                   'bg-white/5': m.role !== 'assistant',
                   'bg-primary/10': m.role === 'assistant'
                 }">
              <div class="text-xs opacity-70 mb-1" *ngIf="m.role==='system'">System</div>
              <div class="prose prose-invert max-w-none" [innerHTML]="md.render(m.content)"></div>
            </div>
          </div>
        </div>
      </main>
      
      <footer class="border-t border-white/10">
        <div class="max-w-screen-md mx-auto p-4">
          <textarea class="tk-input w-full p-3" rows="4" 
                    placeholder="Type and hit Send… (Shift+Enter newline)" 
                    [(ngModel)]="inputValue" 
                    (keydown.enter)="onEnterKey($any($event))"></textarea>
          <div class="mt-2 flex items-center justify-end gap-2">
            <input class="tk-input px-3 py-2 w-full" 
                   placeholder="(optional) System prompt for this scene" 
                   [(ngModel)]="systemValue"/>
            <button class="tk-btn" (click)="send()" [disabled]="busy()">Send</button>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class StageComponent {
  provider = signal<'openrouter'|'openai'>((localStorage.getItem('tk:provider') as any) || 'openrouter');
  model = signal<string>(localStorage.getItem('tk:model') || 'openai/gpt-4o-mini');
  system = signal<string>(localStorage.getItem('tk:system') || '');
  input = signal<string>('');
  messages = signal<ChatMessage[]>([]);
  streaming = signal<boolean>(true);
  busy = signal<boolean>(false);

  // Getters and setters for ngModel
  get inputValue() { return this.input(); }
  set inputValue(value: string) { this.input.set(value); }
  
  get systemValue() { return this.system(); }
  set systemValue(value: string) { this.system.set(value); }
  
  get modelValue() { return this.model(); }
  set modelValue(value: string) { this.model.set(value); }
  
  get providerValue() { return this.provider(); }
  set providerValue(value: 'openrouter'|'openai') { this.provider.set(value); }

  private abort?: AbortController;
  private openai = new OpenAIProvider();
  private openrouter = new OpenRouterProvider();

  constructor(public md: MarkdownService) { this.finishOAuthIfNeeded(); }

  async finishOAuthIfNeeded() {
    const key = await finishOpenRouterPKCE();
    if (key) {
      localStorage.setItem('tk:openrouter', key);
      this.openrouter.setKey(key);
      this.messages.update(m => [...m, { role: 'system', content: '✅ OpenRouter connected.' }]);
    } else {
      const existing = localStorage.getItem('tk:openrouter');
      if (existing) this.openrouter.setKey(existing);
    }
  }

  connectOpenRouter() { startOpenRouterPKCE(location.origin + location.pathname); }
  saveOpenAIKey(raw: string) {
    const key = raw.trim(); if (!key) return;
    localStorage.setItem('tk:openai', key);
    this.openai.setKey(key);
    this.messages.update(m => [...m, { role: 'system', content: '🔑 OpenAI key saved.' }]);
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
      this.messages.update(m => [...m, { role: 'system', content: this.systemValue }]);
    }
    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.inputValue = '';
    this.busy.set(true);

    const svc = this.provider() === 'openai' ? this.openai : this.openrouter;
    const model = this.modelValue;
    this.abort?.abort();
    this.abort = new AbortController();

    if (this.streaming()) {
      let acc = '';
      this.messages.update(m => [...m, { role: 'assistant', content: '…' }]);
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
          }
        });
      } catch (e: any) {
        this.messages.update(m => [...m, { role: 'system', content: '❌ ' + (e?.message || e) }]);
      } finally {
        this.busy.set(false);
      }
    } else {
      try {
        const res = await svc.createChat({ model, messages: this.messages(), stream: false, abortSignal: this.abort.signal });
        this.messages.update(m => [...m, { role: 'assistant', content: res?.text ?? '' }]);
      } catch (e: any) {
        this.messages.update(m => [...m, { role: 'system', content: '❌ ' + (e?.message || e) }]);
      } finally {
        this.busy.set(false);
      }
    }
  }
}