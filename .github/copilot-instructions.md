# Theater Kid - AI Assistant Instructions

## Project Overview

Theater Kid is a modern Angular chat application for AI conversations with a theatrical theme. It's built with Angular 20+, TypeScript, Tailwind CSS, and follows modern web development practices with comprehensive CI/CD pipelines.

## Core Development Requirements

### 🚀 Always Commit Your Work

**CRITICAL**: When you complete any task or meaningful unit of work, you MUST commit your changes. This ensures progress is saved and tracked properly.

```bash
git add .
git commit -m "feat: brief description of what was added"
# or
git commit -m "fix: brief description of what was fixed"
# or
git commit -m "docs: brief description of documentation changes"
```

### 🧪 Unit Testing is Mandatory

For any logic added to the application, unit tests MUST be written. The project uses Jasmine and Karma for testing.

- **Location**: Place test files alongside source files with `.spec.ts` extension
- **Convention**: Follow existing test patterns (see examples in `src/app/routes/stage/theater-booth/theater-booth.component.spec.ts`)
- **Coverage**: Test all public methods, edge cases, and error conditions
- **Run tests**: `npm test` or `npm run test:watch` for development

### 📋 Project Roadmap

The complete project roadmap and development plan can be found in `docs/ROADMAP.md`. Refer to this document for:

- Current development priorities (P0, P1, P2)
- Milestone checklists
- Implementation notes and architectural decisions
- Backlog and future features

### 📦 Third-Party Libraries

It's acceptable to use third-party libraries from NPM, provided they are:

- **Secure**: No known vulnerabilities (check `npm audit`)
- **Well-maintained**: Active development, recent updates, good GitHub activity
- **Popular**: Reasonable download counts and community adoption
- **Compatible**: Works with Angular 20+ and TypeScript 5.8+
- **Documented**: Clear documentation and examples

Always justify library choices and prefer official Angular ecosystem packages when available.

## Project Structure & Conventions

### 📁 Folder Organization

```
src/app/
├── core/          # Providers, storage, types, services
├── routes/        # Feature modules (stage, backstage, theater)
├── shared/        # Reusable UI components, directives, utilities
└── app.*.ts       # App-level configuration
```

### 🎭 Naming Conventions

- **Components**: PascalCase with descriptive names (`TheaterBoothComponent`)
- **Services**: PascalCase ending in `Service` (`MarkdownService`)
- **Files**: kebab-case (`theater-booth.component.ts`)
- **CSS Classes**: Follow Tailwind utilities, use BEM for custom styles
- **Variables**: camelCase (`currentCharacter`, `isSpotlightActive`)

### 💾 State Management

- Use Angular signals for reactive state management
- Distinguish between ephemeral UI state and persisted data
- Use services for shared state and business logic
- Prefer dependency injection over global state

## Code Quality Standards

### ✨ Formatting & Linting

- **Prettier**: Automatic code formatting (`npm run format`)
- **ESLint**: Code quality and consistency (`npm run lint`)
- **Pre-commit hooks**: Automatically format and lint staged files
- **CI Pipeline**: All checks must pass (`npm run ci`)

### 📝 Commit Message Format

Use Conventional Commits format:

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(chat): add message streaming support
- fix(ui): resolve spotlight animation timing
- docs(readme): update installation instructions
- test(services): add unit tests for storage service
```

### 🔒 Security Considerations

- **Markdown Sanitization**: Always sanitize user-generated content
- **API Keys**: Never bundle API keys in code; user-supplied only
- **XSS Prevention**: Use Angular's built-in sanitization
- **CSP**: Follow Content Security Policy guidelines in docs

## Development Workflow

### 🛠️ Local Development

```bash
npm install          # Install dependencies
npm start           # Start dev server (http://localhost:4200)
npm test            # Run tests once
npm run test:watch  # Run tests in watch mode
npm run ci          # Run full CI pipeline locally
```

### 🔄 Making Changes

1. Create feature branch: `git checkout -b feat/your-feature`
2. Make incremental commits with conventional commit messages
3. Run tests frequently: `npm test`
4. Run CI before pushing: `npm run ci`
5. Push and create pull request

### 🎯 Code Generation

Use Angular CLI for scaffolding:

```bash
ng generate component features/my-component
ng generate service core/services/my-service
ng generate directive shared/directives/my-directive
```

## Angular-Specific Guidelines

### 🔧 Component Architecture

- Use standalone components (modern Angular approach)
- Implement proper input/output patterns
- Use signals for reactive programming
- Follow single responsibility principle

### 🎨 Styling

- **Primary**: Use Tailwind CSS utilities
- **Components**: Create component-specific styles sparingly
- **Theming**: Support light/dark themes
- **Responsive**: Mobile-first approach

### 🚦 Error Handling

- Implement proper error boundaries
- Use Angular's HttpErrorResponse for HTTP errors
- Provide user-friendly error messages
- Log errors appropriately for debugging

## Testing Guidelines

### ✅ Test Types

- **Unit Tests**: Test individual components, services, directives
- **Integration Tests**: Test component interactions
- **E2E Tests**: Use Playwright for end-to-end testing (`npm run snapshots`)

### 🎪 Theater-Specific Testing

- Test theatrical UI components (spotlights, curtains, stage effects)
- Mock AI provider responses for consistent testing
- Test character management and session persistence
- Verify markdown rendering and sanitization

## Performance Considerations

### ⚡ Optimization

- Use OnPush change detection strategy where appropriate
- Implement virtual scrolling for large message lists
- Lazy load feature modules
- Optimize bundle size with tree shaking

### 📱 Responsive Design

- Test on various screen sizes
- Ensure touch-friendly interfaces
- Optimize for mobile performance
- Use appropriate viewport meta tags

## Documentation Standards

### 📚 Code Documentation

- Use JSDoc for complex functions and classes
- Document public APIs and interfaces
- Explain business logic and architectural decisions
- Keep comments concise and up-to-date

### 📖 User Documentation

- Update README.md for significant changes
- Maintain changelog for releases
- Document API configurations and settings
- Provide troubleshooting guidance

## AI Provider Integration

### 🤖 Provider Standards

- Implement the `AiProvider` interface consistently
- Handle streaming responses properly
- Implement proper error handling and retries
- Support abort/cancellation functionality
- Never include API keys in source code

### 🔌 Extensibility

- Design for multiple provider support
- Use factory pattern for provider creation
- Implement proper configuration management
- Support both OpenAI and OpenRouter formats

## Troubleshooting Common Issues

### 🐛 Build Issues

- Run `npm install` if dependencies are missing
- Clear `node_modules` and reinstall if needed
- Check Angular and TypeScript version compatibility
- Verify all imports are correct

### 🧪 Test Issues

- Ensure all dependencies are properly mocked
- Check for async/await issues in tests
- Verify test data setup is correct
- Run tests individually to isolate failures

### 🎨 Styling Issues

- Check Tailwind configuration
- Verify CSS build process
- Test in different browsers
- Check for responsive design issues

---

## Quick Reference Commands

```bash
# Development
npm start                    # Start dev server
npm run build               # Build for production
npm run ci                  # Run full CI pipeline

# Testing
npm test                    # Run tests once
npm run test:watch         # Run tests in watch mode
npm run snapshots          # Run E2E tests

# Code Quality
npm run lint               # Check code quality
npm run lint:fix          # Fix linting issues
npm run format            # Format code
npm run format:check      # Check formatting

# Generation
ng generate component <name>    # Generate component
ng generate service <name>      # Generate service
ng generate directive <name>    # Generate directive
```

Remember: Quality over speed. Write clean, tested, documented code that follows the project's conventions and architectural patterns.
