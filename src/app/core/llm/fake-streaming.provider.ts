import { faker } from '@faker-js/faker/locale/en';
import { LLMProvider, ProviderInfo, CreateChatParams } from './types';

// Default configuration constants
const DEFAULT_MIN_SENTENCES = 1;
const DEFAULT_MAX_SENTENCES = 3;
const DEFAULT_MIN_TOKENS_PER_CHUNK = 1;
const DEFAULT_MAX_TOKENS_PER_CHUNK = 5;
const DEFAULT_AVG_DELAY_MS = 40;
const DEFAULT_JITTER_MS = 40;

// Tokenization constants for paragraph cadence simulation
const NEWLINE_INJECTION_LOOKBACK = 6; // How many chunks back to look for newline injection
const MIN_NEWLINE_SPACING = 8; // Minimum spacing between newlines
const MAX_NEWLINE_SPACING = 16; // Maximum spacing between newlines

export interface FakeProviderConfig {
  avgDelayMs?: number; // average delay between chunks
  jitterMs?: number; // +/- jitter
  sentences?: [number, number]; // min/max sentences per reply
  tokensPerChunk?: [number, number]; // min/max chars per chunk
  initialThinkingMs?: number; // initial delay before first chunk
}

export class FakeStreamingProvider implements LLMProvider {
  info: ProviderInfo = {
    id: 'fake',
    label: 'Fake Provider (Debug)',
    supportsStreaming: true,
    needsBYOK: false,
  };

  constructor(private cfg: FakeProviderConfig = {}) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setKey(_key: string | null): void {
    // Fake provider doesn't need a key
  }

  async createChat({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messages: _messages,
    stream,
    onToken,
    abortSignal,
  }: CreateChatParams): Promise<{ text: string } | void> {
    const sentencesCount = this.randBetween(
      this.cfg.sentences?.[0] ?? DEFAULT_MIN_SENTENCES,
      this.cfg.sentences?.[1] ?? DEFAULT_MAX_SENTENCES,
    );
    const text = faker.lorem.sentences(sentencesCount);

    if (stream && onToken) {
      return this.streamResponse(text, onToken, abortSignal);
    } else {
      return { text };
    }
  }

  private async streamResponse(
    text: string,
    onToken: (chunk: string) => void,
    abortSignal?: AbortSignal,
  ): Promise<void> {
    const chunks = this.tokenize(
      text,
      this.cfg.tokensPerChunk ?? [DEFAULT_MIN_TOKENS_PER_CHUNK, DEFAULT_MAX_TOKENS_PER_CHUNK],
    );

    // Initial thinking delay
    const initialDelay =
      this.cfg.initialThinkingMs ?? (this.cfg.avgDelayMs ?? DEFAULT_AVG_DELAY_MS) * 2;
    await this.delay(initialDelay);

    if (abortSignal?.aborted) return;

    for (let i = 0; i < chunks.length; i++) {
      if (abortSignal?.aborted) return;

      onToken(chunks[i]);

      // Don't delay after the last chunk
      if (i < chunks.length - 1) {
        const avg = this.cfg.avgDelayMs ?? DEFAULT_AVG_DELAY_MS;
        const jitter = this.cfg.jitterMs ?? DEFAULT_JITTER_MS;
        const delayMs = Math.max(0, avg + (Math.random() * jitter * 2 - jitter));
        await this.delay(delayMs);
      }
    }
  }

  private tokenize(text: string, span: [number, number]): string[] {
    const out: string[] = [];
    let i = 0;
    while (i < text.length) {
      const n = this.randBetween(span[0], span[1]);
      out.push(text.slice(i, i + n));
      i += n;
    }

    // Occasionally inject a newline to mimic paragraph cadence
    for (
      let j = out.length - NEWLINE_INJECTION_LOOKBACK;
      j > 0;
      j -= this.randBetween(MIN_NEWLINE_SPACING, MAX_NEWLINE_SPACING)
    ) {
      if (j >= 0 && j < out.length) {
        out[j] += '\n';
      }
    }

    return out;
  }

  private randBetween(a: number, b: number): number {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
