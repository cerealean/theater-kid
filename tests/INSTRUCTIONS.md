# Testing Instructions

## Overview

Theater Kid uses a comprehensive testing strategy with Jasmine/Karma for unit tests and Playwright for end-to-end testing. All code changes must include appropriate tests.

## Testing Philosophy

- **Test behavior, not implementation**: Focus on what the code does, not how it does it
- **Test user scenarios**: Write tests that reflect actual user interactions
- **Test edge cases**: Consider error conditions, empty states, and boundary conditions
- **Maintain test quality**: Tests should be as well-written as production code

## Unit Testing with Jasmine/Karma

### 🧪 Test Structure

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jasmine.SpyObj<ServiceName>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ServiceName', ['method1', 'method2']);

    await TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [{ provide: ServiceName, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    mockService = TestBed.inject(ServiceName) as jasmine.SpyObj<ServiceName>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### 🎭 Theater-Specific Testing Patterns

#### Testing Theatrical Components

```typescript
it('should toggle spotlight effect', () => {
  spyOn(component.toggleSpotlight, 'emit');
  component.onToggleSpotlight();
  expect(component.toggleSpotlight.emit).toHaveBeenCalled();
});

it('should display character information correctly', () => {
  const testCharacter = 'Hamlet';
  const testRole = 'Prince of Denmark';

  fixture.componentRef.setInput('currentCharacter', testCharacter);
  fixture.componentRef.setInput('characterRole', testRole);
  fixture.detectChanges();

  expect(component.currentCharacter()).toBe(testCharacter);
  expect(component.characterRole()).toBe(testRole);
});
```

#### Testing AI Provider Services

```typescript
describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenAIProvider],
    });

    provider = TestBed.inject(OpenAIProvider);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should stream chat responses', async () => {
    const mockResponse = 'Hello from AI';
    const streamPromise = provider.streamChat('Hello');

    const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
    expect(req.request.method).toBe('POST');

    // Simulate streaming response
    req.flush(mockResponse);

    const result = await streamPromise;
    expect(result).toContain(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

#### Testing Storage Services

```typescript
describe('StorageService', () => {
  let service: StorageService;
  let mockIndexedDB: jasmine.SpyObj<IDBDatabase>;

  beforeEach(() => {
    mockIndexedDB = jasmine.createSpyObj('IDBDatabase', ['transaction']);
    service = new StorageService();
  });

  it('should save session data', async () => {
    const sessionData = { id: '1', title: 'Test Session', messages: [] };

    const result = await service.saveSession(sessionData);

    expect(result.success).toBe(true);
    expect(result.data.id).toBe(sessionData.id);
  });

  it('should handle storage errors gracefully', async () => {
    // Mock storage failure
    spyOn(service, 'getStorageConnection').and.rejectWith(new Error('Storage unavailable'));

    const result = await service.saveSession({});

    expect(result.success).toBe(false);
    expect(result.error).toContain('Storage unavailable');
  });
});
```

### 🧩 Testing Reactive Components with Signals

```typescript
it('should update reactive state', () => {
  const initialValue = 'initial';
  const newValue = 'updated';

  component.setValue(initialValue);
  expect(component.value()).toBe(initialValue);

  component.setValue(newValue);
  expect(component.value()).toBe(newValue);
});

it('should react to input changes', () => {
  const testEffect = jasmine.createSpy('effect');

  TestBed.runInInjectionContext(() => {
    effect(() => testEffect(component.value()));
  });

  component.setValue('new value');
  fixture.detectChanges();

  expect(testEffect).toHaveBeenCalledWith('new value');
});
```

### 🎨 Testing UI Components

```typescript
it('should render message content', () => {
  const message = 'Hello, world!';
  fixture.componentRef.setInput('content', message);
  fixture.detectChanges();

  const messageElement = fixture.debugElement.query(By.css('.message-content'));
  expect(messageElement.nativeElement.textContent).toContain(message);
});

it('should handle click events', () => {
  spyOn(component, 'onClick');

  const button = fixture.debugElement.query(By.css('button'));
  button.nativeElement.click();

  expect(component.onClick).toHaveBeenCalled();
});
```

## End-to-End Testing with Playwright

### 🎪 E2E Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theater Kid Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load chat interface', async ({ page }) => {
    await expect(page.locator('[data-testid="stage-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
  });

  test('should handle message submission', async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    await messageInput.fill('Hello, AI!');
    await sendButton.click();

    await expect(page.locator('[data-testid="user-message"]')).toContainText('Hello, AI!');
  });
});
```

### 🎭 Testing Theatrical Effects

```typescript
test('should toggle spotlight effect', async ({ page }) => {
  const spotlightToggle = page.locator('[data-testid="spotlight-toggle"]');

  await spotlightToggle.click();
  await expect(page.locator('.spotlight-active')).toBeVisible();

  await spotlightToggle.click();
  await expect(page.locator('.spotlight-active')).not.toBeVisible();
});

test('should animate curtain transitions', async ({ page }) => {
  const curtainButton = page.locator('[data-testid="curtain-toggle"]');

  await curtainButton.click();

  // Wait for animation to complete
  await page.waitForTimeout(1000);

  await expect(page.locator('.curtains-closed')).toBeVisible();
});
```

## Test Data Management

### 🎯 Mock Data Creation

```typescript
// test-helpers/mock-data.ts
export const createMockSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'mock-session-1',
  title: 'Mock Session',
  messages: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'mock-message-1',
  role: 'user',
  content: 'Mock message content',
  timestamp: new Date(),
  ...overrides,
});
```

### 🔧 Test Utilities

```typescript
// test-helpers/component-utils.ts
export const setComponentInputs = (fixture: ComponentFixture<any>, inputs: Record<string, any>) => {
  Object.entries(inputs).forEach(([key, value]) => {
    fixture.componentRef.setInput(key, value);
  });
  fixture.detectChanges();
};

export const waitForAsyncOperation = async (
  fixture: ComponentFixture<any>,
  operation: () => Promise<any>,
) => {
  await operation();
  fixture.detectChanges();
  await fixture.whenStable();
};
```

## Testing Best Practices

### ✅ Do's

- Write tests first (TDD) when possible
- Use descriptive test names that explain the expected behavior
- Keep tests focused and test one thing at a time
- Use appropriate assertions (toBe vs toEqual vs toContain)
- Clean up after tests (spies, subscriptions, etc.)
- Test both success and error scenarios

### ❌ Don'ts

- Don't test implementation details
- Don't create overly complex test setups
- Don't rely on test execution order
- Don't ignore flaky tests - fix them
- Don't test third-party library functionality
- Don't skip testing edge cases and error conditions

### 🎭 Theater Kid Specific Guidelines

- Test theatrical animations and effects
- Verify proper character switching behavior
- Test AI response streaming and cancellation
- Validate markdown rendering and sanitization
- Test keyboard shortcuts and accessibility features
- Verify responsive design across screen sizes

## Running Tests

### 📋 Test Commands

```bash
# Run all unit tests once
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage
npm test -- --code-coverage

# Run specific test file
npm test -- --include="**/component-name.spec.ts"

# Run E2E tests
npm run snapshots

# Run E2E tests in headed mode (see browser)
npx playwright test --headed
```

### 🐛 Debugging Tests

```bash
# Debug unit tests in Chrome
npm test -- --browsers=Chrome

# Debug E2E tests
npx playwright test --debug

# Record E2E test actions
npx playwright codegen localhost:4200
```

## Continuous Integration

All tests must pass in CI before code can be merged. The CI pipeline runs:

1. **Linting**: Code quality checks
2. **Formatting**: Code style verification
3. **Building**: Compilation verification
4. **Unit Tests**: All Jasmine/Karma tests
5. **E2E Tests**: Critical user path verification

If any step fails, the entire pipeline fails and changes cannot be merged.
