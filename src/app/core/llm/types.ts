export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  tkid?: string;
}
export interface CreateChatParams {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  onToken?: (chunk: string) => void;
  abortSignal?: AbortSignal;
}
export interface ProviderInfo {
  id: 'openrouter' | 'openai' | 'fake';
  label: string;
  supportsStreaming: boolean;
  needsBYOK: boolean;
}
export interface LLMProvider {
  info: ProviderInfo;
  setKey(key: string | null): void;
  createChat(params: CreateChatParams): Promise<{ text: string } | void>;
}
