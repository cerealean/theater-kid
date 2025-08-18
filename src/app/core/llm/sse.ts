export async function readSSE(
  response: Response, 
  onDelta: (text: string) => void, 
  onComplete?: () => void
): Promise<void> {
  if (!response.ok || !response.body) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      let lineEndIndex: number;
      while ((lineEndIndex = buffer.indexOf('\n\n')) !== -1) {
        const chunk = buffer.slice(0, lineEndIndex);
        buffer = buffer.slice(lineEndIndex + 2);
        
        const dataLine = chunk.split('\n').find(line => line.startsWith('data: '));
        if (!dataLine) continue;
        
        const data = dataLine.slice(6).trim();
        if (data === '[DONE]') {
          onComplete?.();
          return;
        }
        
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content ?? '';
          if (delta) {
            onDelta(delta);
          }
        } catch (parseError) {
          console.warn('Failed to parse SSE data:', data, parseError);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  
  onComplete?.();
}