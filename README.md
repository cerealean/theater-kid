# 🎭 Theater Kid

A modern Angular chat application for AI conversations with a theatrical theme.

## Features

- 🎪 **Multiple AI Providers**: Support for OpenAI and OpenRouter
- 💬 **Real-time Streaming**: Live response streaming from AI models
- 🎨 **Beautiful UI**: Theater-inspired design with spotlight effects
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Responsive**: Works on all screen sizes
- 🔒 **Secure**: Proper markdown sanitization and type safety

## Quick Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/cerealean/theater-kid)

Get started instantly with a fully configured Angular development environment in the cloud:

1. Click the "Open in GitHub Codespaces" badge above
2. Wait for the environment to initialize (dependencies install automatically)
3. Run `npm start` to start the development server
4. Your Angular app will be available at the forwarded port

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Code Quality & Formatting

This project uses [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) with [Angular ESLint](https://github.com/angular-eslint/angular-eslint) for code quality.

### Linting

To check for code quality issues:

```bash
npm run lint
```

To automatically fix linting issues where possible:

```bash
npm run lint:fix
```

### Code Formatting

To format all source files:

```bash
npm run format
```

To check if files are properly formatted:

```bash
npm run format:check
```

### CI/CD Pipeline

Run all quality checks, build, and tests (as used in CI):

```bash
npm run ci
```

This command runs:

1. ESLint for code quality
2. Prettier format check
3. Build verification
4. Unit tests

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Continuous Integration

This project uses separate GitHub Actions workflows for pull requests and releases:

### CI Workflow (Pull Requests and Main Branch)

The CI workflow runs on every push and pull request and includes:

1. ✅ Checks code formatting with Prettier
2. ✅ Runs ESLint for code quality
3. ✅ Builds the application
4. ✅ Runs unit tests
5. ✅ Uploads build artifacts

### Release Workflow (Main Branch Only)

When code is pushed to the main branch and CI passes, a separate release workflow runs:

1. ✅ Performs semantic versioning analysis
2. ✅ Updates CHANGELOG.md and package.json
3. ✅ Creates GitHub releases
4. ✅ Rebuilds the application with updated version
5. ✅ Uploads release build artifacts

Pull requests must pass all CI checks before they can be merged.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Development Workflow

This project uses **Commitlint** and **Husky** to ensure clean commits and maintain code quality.

### Making Commits

Use standard git commit commands with conventional commit message format:

```bash
git commit -m "feat: add new feature"
```

All commit messages are automatically validated against conventional commit standards.

### Pre-commit Hooks

The following checks run automatically:

- **Pre-commit**: Prettier formatting on all staged files
- **Commit-msg**: Conventional commit message validation

### Available Scripts

- `npm run prepare` - Install husky hooks (runs automatically after npm install)

## AI Assistant Instructions

For AI assistants and GitHub Copilot working on this project, comprehensive instructions are available at:

- **[GitHub Copilot Instructions](.github/copilot-instructions.md)** - Complete guide for AI assistants

These instructions cover commit practices, testing requirements, project architecture, and Theater Kid-specific patterns to ensure consistent, high-quality contributions.
