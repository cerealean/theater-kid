import { TestBed } from '@angular/core/testing';
import { FakeStreamingProvider } from './fake-streaming.provider';

describe('FakeStreamingProvider', () => {
  let provider: FakeStreamingProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    provider = new FakeStreamingProvider();
  });

  it('should create', () => {
    expect(provider).toBeTruthy();
  });

  it('should have correct provider info', () => {
    expect(provider.info.id).toBe('fake');
    expect(provider.info.label).toBe('Fake Provider (Debug)');
    expect(provider.info.supportsStreaming).toBe(true);
    expect(provider.info.needsBYOK).toBe(false);
  });

  it('should not require API key', () => {
    expect(() => provider.setKey(null)).not.toThrow();
    expect(() => provider.setKey('test-key')).not.toThrow();
  });

  it('should return text response in non-streaming mode', async () => {
    const result = await provider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: false,
    });

    expect(result).toBeDefined();
    expect(result!.text).toBeTruthy();
    expect(typeof result!.text).toBe('string');
    expect(result!.text.length).toBeGreaterThan(0);
  });

  it('should stream tokens when streaming is enabled', async () => {
    const tokens: string[] = [];
    const onToken = jasmine.createSpy('onToken').and.callFake((token: string) => {
      tokens.push(token);
    });

    const result = await provider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
      onToken,
    });

    expect(result).toBeUndefined(); // Streaming mode returns void
    expect(onToken).toHaveBeenCalled();
    expect(tokens.length).toBeGreaterThan(0);

    // Check that we received multiple chunks
    expect(tokens.length).toBeGreaterThan(1);

    // Check that combined tokens form a complete response
    const fullText = tokens.join('');
    expect(fullText.length).toBeGreaterThan(0);
  });

  it('should respect abort signal', async () => {
    const abortController = new AbortController();
    const tokens: string[] = [];
    const onToken = jasmine.createSpy('onToken').and.callFake((token: string) => {
      tokens.push(token);
      // Abort after first token
      if (tokens.length === 1) {
        abortController.abort();
      }
    });

    await provider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
      onToken,
      abortSignal: abortController.signal,
    });

    // Should have received at least one token before aborting
    expect(tokens.length).toBeGreaterThanOrEqual(1);
    // Should not have received all possible tokens due to abort
    expect(tokens.length).toBeLessThan(10); // Assuming normal response would be longer
  });

  it('should handle custom configuration', async () => {
    const customProvider = new FakeStreamingProvider({
      sentences: [1, 1], // Exactly 1 sentence
      tokensPerChunk: [1, 1], // 1 character per chunk
      avgDelayMs: 1, // Very fast for testing
      jitterMs: 0, // No jitter
      initialThinkingMs: 1, // Minimal initial delay
    });

    const tokens: string[] = [];
    const onToken = jasmine.createSpy('onToken').and.callFake((token: string) => {
      tokens.push(token);
    });

    const startTime = Date.now();
    await customProvider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: true,
      onToken,
    });
    const endTime = Date.now();

    expect(onToken).toHaveBeenCalled();
    expect(tokens.length).toBeGreaterThan(5); // Should break into multiple 1-char chunks

    // Should complete relatively quickly due to fast config
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('should generate different responses on multiple calls', async () => {
    const response1 = await provider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: false,
    });

    const response2 = await provider.createChat({
      model: 'fake-model',
      messages: [{ role: 'user', content: 'Hello' }],
      stream: false,
    });

    expect(response1!.text).not.toBe(response2!.text);
  });
});
