import { LLMProvider, ProviderInfo, CreateChatParams } from './types';
import { readSSE } from './sse';

export class OpenRouterProvider implements LLMProvider {
  info: ProviderInfo = {
    id: 'openrouter',
    label: 'OpenRouter',
    supportsStreaming: true,
    needsBYOK: false,
  };
  private key: string | null = null;
  setKey(k: string | null) {
    this.key = k;
  }
  async createChat({ model, messages, stream, onToken, abortSignal }: CreateChatParams) {
    const key = this.key || localStorage.getItem('tk:openrouter') || '';
    if (!key) throw new Error('Connect to OpenRouter first');
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': location.origin,
      'X-Title': 'Theater Kid',
    };
    const body = JSON.stringify({ model, stream: !!stream, messages });
    const resp = await fetch(url, { method: 'POST', headers, body, signal: abortSignal });
    if (stream && onToken) {
      await readSSE(resp, onToken);
      return;
    }
    const json = await resp.json();
    return { text: json.choices?.[0]?.message?.content ?? '' };
  }
}
