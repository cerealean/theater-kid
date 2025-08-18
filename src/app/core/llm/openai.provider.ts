import { LLMProvider, ProviderInfo, CreateChatParams } from './types';
import { readSSE } from './sse';

export class OpenAIProvider implements LLMProvider {
  info: ProviderInfo = { id: 'openai', label: 'OpenAI', supportsStreaming: true, needsBYOK: true };
  private key: string | null = null;
  setKey(k: string | null) { this.key = k; }
  async createChat({ model, messages, stream, onToken, abortSignal }: CreateChatParams) {
    if (!this.key) throw new Error('Missing OpenAI key');
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = { 'Authorization': `Bearer ${this.key}`, 'Content-Type': 'application/json' };
    const body = JSON.stringify({ model, stream: !!stream, messages });
    const resp = await fetch(url, { method: 'POST', headers, body, signal: abortSignal });
    if (stream && onToken) { await readSSE(resp, onToken); return; }
    const json = await resp.json();
    return { text: json.choices?.[0]?.message?.content ?? '' };
  }
}