# Routes Module Instructions

## Overview

The `routes` module contains the main feature areas of the Theater Kid application: Stage (chat interface), Backstage (settings/configuration), and Theater (main shell). Each route represents a distinct user experience with its own UI patterns and interactions.

## Route Structure

### 🎭 Stage Route (`routes/stage/`)

The main chat interface where users interact with AI characters.

#### Key Components:

- **Stage Component**: Main chat container with theatrical styling
- **Theater Booth**: Control panel for lighting, effects, and character management
- **Stage Input**: Message input with send functionality
- **Empty Messages Display**: Welcome screen when no messages exist

#### Guidelines:

- Support real-time streaming of AI responses
- Implement proper message scrolling and auto-scroll behavior
- Handle keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Support message retry and cancellation
- Implement copy-to-clipboard for messages
- Test with various message lengths and formats

### 🎪 Backstage Route (`routes/backstage/`)

Settings and configuration area.

#### Guidelines:

- Secure handling of API keys (encrypt at rest)
- Validate all user inputs
- Provide clear feedback for configuration changes
- Support import/export of settings
- Test configuration persistence across sessions

### 🏛️ Theater Route (`routes/theater/`)

Main application shell and navigation.

#### Guidelines:

- Handle responsive navigation patterns
- Support keyboard navigation
- Implement proper loading states
- Handle route transitions smoothly
- Test across different screen sizes

## Component Development Guidelines

### 🎨 UI/UX Patterns

```typescript
// Use consistent input/output patterns
@Component({
  selector: 'app-stage-input',
  template: `...`,
  inputs: ['disabled', 'placeholder'],
  outputs: ['messageSubmit', 'messageCancel'],
})
export class StageInputComponent {
  @input() disabled = signal(false);
  @input() placeholder = signal('Enter your message...');

  @output() messageSubmit = output<string>();
  @output() messageCancel = output<void>();
}
```

### 🎬 Theater-Themed Components

- Use theatrical metaphors consistently (stage, curtains, spotlight, etc.)
- Implement smooth animations for visual effects
- Support light/dark themes with proper contrast
- Test animations on different devices and browsers
- Provide reduced motion options for accessibility

### 📱 Responsive Design

- Mobile-first approach for all route components
- Test on various screen sizes (mobile, tablet, desktop)
- Use appropriate touch targets (minimum 44px)
- Ensure keyboard accessibility
- Handle orientation changes gracefully

## State Management

### 🔄 Component State

- Use signals for reactive state management
- Keep component state minimal and focused
- Use services for shared state between route components
- Implement proper cleanup in ngOnDestroy

### 💾 Data Persistence

- Route-level data should persist across navigation
- Use appropriate storage scope (session vs persistent)
- Handle browser refresh scenarios
- Implement proper error recovery

## Testing Route Components

### 🧪 Component Testing

```typescript
describe('StageComponent', () => {
  let component: StageComponent;
  let fixture: ComponentFixture<StageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StageComponent],
      providers: [
        // Mock services
        { provide: LlmService, useValue: mockLlmService },
        { provide: StorageService, useValue: mockStorageService },
      ],
    }).compileComponents();
  });

  it('should handle message submission', async () => {
    // Test actual user interactions
    const message = 'Hello, AI!';
    component.onMessageSubmit(message);

    expect(mockLlmService.sendMessage).toHaveBeenCalledWith(message);
  });
});
```

### 🎭 Theater-Specific Testing

- Test theatrical effects and animations
- Verify proper character switching
- Test spotlight and lighting effects
- Validate stage transitions
- Check curtain animations

### 🔗 Integration Testing

- Test route navigation flows
- Verify data persistence across routes
- Test deep linking and URL handling
- Validate guard behaviors
- Check lazy loading functionality

## Performance Optimization

### ⚡ Route-Level Optimization

- Use OnPush change detection where appropriate
- Implement virtual scrolling for message lists
- Lazy load heavy components
- Optimize image and asset loading
- Debounce user input appropriately

### 🎪 Animation Performance

- Use CSS transforms for smooth animations
- Avoid animating layout properties
- Use `will-change` property judiciously
- Test on lower-end devices
- Provide performance-reduced options

## Accessibility Guidelines

### ♿ WCAG Compliance

- Provide proper ARIA labels for theatrical elements
- Support keyboard navigation throughout
- Ensure sufficient color contrast
- Provide alternative text for visual effects
- Test with screen readers

### 🎭 Theater Accessibility

- Describe visual effects in accessible ways
- Provide audio cues for important actions
- Support high contrast mode
- Offer simplified visual modes
- Test with assistive technologies

## Error Handling

### 🚨 User-Facing Errors

- Display clear, actionable error messages
- Provide retry mechanisms for failed operations
- Handle network connectivity issues gracefully
- Implement proper fallback UI states

### 🛠️ Developer Experience

- Use proper error boundaries
- Log errors with sufficient context
- Implement error tracking in production
- Provide debugging information in development

## Route-Specific Considerations

### Stage Route

- Handle streaming interruptions gracefully
- Support message editing and deletion
- Implement proper message ordering
- Handle very long conversations efficiently

### Backstage Route

- Validate configuration changes before applying
- Provide confirmation for destructive actions
- Support configuration backup/restore
- Handle migration of old settings

### Theater Route

- Maintain navigation state across page reloads
- Support browser back/forward navigation
- Handle unauthorized access appropriately
- Implement proper loading indicators
