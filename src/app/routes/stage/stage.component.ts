import { Component, effect, signal, inject, OnInit } from '@angular/core';
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
  selector: 'tk-stage',
  imports: [CommonModule, FormsModule],
  templateUrl: './stage.component.html',
})
export class StageComponent implements OnInit {
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

  // Theater booth properties
  currentCharacter = signal<string>('');
  characterRole = signal<string>('');
  sceneContext = signal<string>('');
  characterTraits = signal<string[]>([]);
  performanceNotes = signal<string>('');

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

    // Auto-scroll to bottom when messages change
    effect(() => {
      this.messages(); // Track changes to messages
      setTimeout(() => this.scrollToBottom(), 50);
      this.analyzeCharacterFromMessages();
    });

    // Watch for route parameter changes
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.sceneId.set(params.get('sceneId'));
    });
  }

  ngOnInit(): void {
    // Component initialization if needed
    this.initializeDemoCharacter();
  }

  private initializeDemoCharacter(): void {
    // Set some initial demo data to showcase the theater booth
    if (this.messages().length === 0) {
      this.currentCharacter.set('Lady Evangeline');
      this.characterRole.set('Victorian Medium');
      this.sceneContext.set(
        'A mysterious parlor filled with crystal balls and ancient books, where spirits whisper secrets from beyond...',
      );
      this.characterTraits.set(['Mysterious', 'Wise', 'Elegant', 'Mystical']);
      this.performanceNotes.set(
        'Speaks in an ethereal, otherworldly manner with knowledge of the unseen realm',
      );
    }
  }

  private scrollToBottom(): void {
    const messagesContainer = document.querySelector('.overflow-y-auto');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private analyzeCharacterFromMessages(): void {
    const messages = this.messages();
    const systemMessage = messages.find((m) => m.role === 'system');
    const assistantMessages = messages.filter((m) => m.role === 'assistant');

    // Extract character name and role from system prompt
    if (systemMessage) {
      // Look for character names (common patterns)
      const namePatterns = [
        /you are ([^.,\n]+)/i,
        /name is ([^.,\n]+)/i,
        /called ([^.,\n]+)/i,
        /i am ([^.,\n]+)/i,
      ];

      for (const pattern of namePatterns) {
        const match = systemMessage.content.match(pattern);
        if (match && match[1].trim().length > 0) {
          this.currentCharacter.set(this.capitalizeFirst(match[1].trim()));
          break;
        }
      }

      // Extract role/occupation
      const rolePatterns = [
        /you are (?:a |an )?([^.,\n]*(?:wizard|knight|princess|king|queen|doctor|teacher|detective|pirate|vampire|elf|dwarf|warrior|mage|rogue|bard|assassin))/i,
        /profession(?:al)? ([^.,\n]+)/i,
        /work as (?:a |an )?([^.,\n]+)/i,
      ];

      for (const pattern of rolePatterns) {
        const match = systemMessage.content.match(pattern);
        if (match && match[1].trim().length > 0) {
          this.characterRole.set(this.capitalizeFirst(match[1].trim()));
          break;
        }
      }

      // Set scene context from system prompt
      this.sceneContext.set(
        systemMessage.content.slice(0, 150) + (systemMessage.content.length > 150 ? '...' : ''),
      );
    }

    // Analyze assistant responses for traits
    if (assistantMessages.length > 0) {
      const traits: string[] = [];
      const combinedContent = assistantMessages
        .map((m) => m.content)
        .join(' ')
        .toLowerCase();

      // Detect personality traits based on language patterns
      const traitPatterns = {
        Mysterious: /\b(enigmatic|secretive|mysterious|hidden|shadow|whisper)\b/g,
        Wise: /\b(wise|ancient|knowledge|learned|experienced|sage)\b/g,
        Brave: /\b(brave|courageous|fearless|bold|valiant|heroic)\b/g,
        Funny: /\b(joke|laugh|humor|funny|amusing|witty|jest)\b/g,
        Kind: /\b(kind|gentle|caring|compassionate|warm|tender)\b/g,
        Fierce: /\b(fierce|intense|passionate|strong|powerful|mighty)\b/g,
        Elegant: /\b(elegant|graceful|refined|sophisticated|noble)\b/g,
        Playful: /\b(playful|mischievous|fun|cheerful|lively)\b/g,
      };

      for (const [trait, pattern] of Object.entries(traitPatterns)) {
        const matches = combinedContent.match(pattern);
        if (matches && matches.length >= 2) {
          // Require multiple instances
          traits.push(trait);
        }
      }

      this.characterTraits.set(traits.slice(0, 5)); // Limit to 5 traits

      // Generate performance notes based on conversation style
      if (assistantMessages.length >= 2) {
        const lastMessage = assistantMessages[assistantMessages.length - 1].content;
        if (lastMessage.includes('?')) {
          this.performanceNotes.set('Character is curious and engaging');
        } else if (lastMessage.includes('!')) {
          this.performanceNotes.set('Character shows strong emotions');
        } else if (lastMessage.length > 100) {
          this.performanceNotes.set('Character is eloquent and detailed');
        } else {
          this.performanceNotes.set('Character is concise and direct');
        }
      }
    }

    // Set defaults if nothing detected
    if (!this.currentCharacter() && messages.length > 0) {
      this.currentCharacter.set('Anonymous Character');
    }
    if (!this.characterRole() && messages.length > 0) {
      this.characterRole.set('Mysterious Performer');
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Theater ambiance controls
  toggleSpotlight(): void {
    this.performanceNotes.set('✨ Spotlight activated - Character feels illuminated and focused');
    setTimeout(() => {
      if (this.performanceNotes().includes('Spotlight activated')) {
        this.performanceNotes.set('Character returns to natural lighting');
      }
    }, 3000);
  }

  toggleCurtains(): void {
    this.performanceNotes.set('🎭 Curtains drawn - Character feels more intimate and private');
    setTimeout(() => {
      if (this.performanceNotes().includes('Curtains drawn')) {
        this.performanceNotes.set('Curtains opened - Character feels ready to perform');
      }
    }, 3000);
  }

  toggleMusic(): void {
    this.performanceNotes.set('🎵 Ambient music playing - Character feels the rhythm of the scene');
    setTimeout(() => {
      if (this.performanceNotes().includes('music playing')) {
        this.performanceNotes.set('Music fades - Character returns to natural ambiance');
      }
    }, 3000);
  }

  triggerApplause(): void {
    this.performanceNotes.set('👏 Audience applauds - Character feels appreciated and energized!');
    setTimeout(() => {
      if (this.performanceNotes().includes('applauds')) {
        this.performanceNotes.set('Applause fades - Character bows gracefully');
      }
    }, 3000);
  }

  resetCharacter(): void {
    this.currentCharacter.set('');
    this.characterRole.set('');
    this.sceneContext.set('');
    this.characterTraits.set([]);
    this.performanceNotes.set('');
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
