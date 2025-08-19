# Core Module Instructions

## Overview

The `core` module contains the foundational services, interfaces, and utilities that power the Theater Kid application. This includes AI providers, storage services, markdown processing, and shared business logic.

## Key Components

### 🤖 LLM (AI Provider) Integration

Located in `core/llm/`:

- Implement the `AiProvider` interface for all new providers
- Support streaming responses with proper error handling
- Use AbortController for cancellation support
- Never include API keys in source code - always user-supplied
- Test with mock responses for consistency

### 💾 Storage Services

Located in `core/services/`:

- Use IndexedDB for client-side persistence
- Implement proper encryption for sensitive data (API keys)
- Support import/export functionality
- Handle storage quota limitations gracefully

### 📝 Markdown Processing

Located in `core/markdown/`:

- Always sanitize user-generated content
- Support code highlighting and copy-to-clipboard
- Handle large content with collapsible sections
- Disable inline images by default (security)

### 🎯 Directives

Located in `core/directives/`:

- Focus on reusable UI behaviors
- Support theater-themed effects (spotlight, curtains)
- Use proper cleanup in ngOnDestroy
- Test with different browsers for compatibility

## Development Guidelines

### 🔧 Service Creation

When creating new services:

```typescript
@Injectable({
  providedIn: 'root', // Prefer root injection for core services
})
export class MyService {
  // Use dependency injection
  constructor(private storage: StorageService) {}

  // Use signals for reactive state
  private _data = signal<Data[]>([]);
  data = this._data.asReadonly();
}
```

### 🛡️ Error Handling

Implement robust error handling:

```typescript
// Use Result pattern for operations that can fail
type Result<T> = { success: true; data: T } | { success: false; error: string };

async someOperation(): Promise<Result<Data>> {
  try {
    const data = await this.apiCall();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 🧪 Testing Core Services

- Mock external dependencies (HTTP, storage)
- Test error conditions and edge cases
- Verify proper cleanup of resources
- Test async operations with proper awaiting

### 🔒 Security Best Practices

- Validate all inputs
- Sanitize outputs going to DOM
- Use Angular's built-in security features
- Implement CSP-compatible solutions
- Encrypt sensitive data at rest

## AI Provider Implementation Checklist

When adding a new AI provider:

- [ ] Implement `AiProvider` interface
- [ ] Support streaming chat completions
- [ ] Handle rate limiting and retries
- [ ] Implement proper error handling
- [ ] Add configuration validation
- [ ] Create comprehensive unit tests
- [ ] Document API key requirements
- [ ] Test with real API endpoints
- [ ] Verify cancellation works properly
- [ ] Update provider registry

## Storage Service Guidelines

- Use consistent key naming conventions
- Implement proper migration strategies for schema changes
- Handle storage quota exceeded scenarios
- Provide clear error messages for storage issues
- Support both session-scoped and persistent storage
- Implement data export/import for user portability

## Performance Considerations

- Use lazy loading for heavy services
- Implement proper caching strategies
- Debounce expensive operations
- Use Web Workers for CPU-intensive tasks
- Monitor memory usage in long-running sessions
- Optimize for mobile performance
