# 🎭 Contributing to Theater Kid

Thank you for your interest in contributing to Theater Kid! This guide will help you get started with contributing to our modern Angular chat application for AI conversations.

## 🚀 Getting Started

### Prerequisites

- **Node.js LTS (v20+)**: Latest stable Node.js runtime
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control system

### Environment Setup

1. **Fork and Clone**: Fork the repository and clone your fork locally

   ```bash
   git clone https://github.com/YOUR_USERNAME/theater-kid.git
   cd theater-kid
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

   This automatically sets up Husky git hooks for code quality.

3. **Start Development Server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

### Alternative: GitHub Codespaces

For cloud-based development, use GitHub Codespaces:

1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Dependencies are automatically installed
3. See [.devcontainer/README.md](.devcontainer/README.md) for details

## 🛠️ Development Workflow

### Making Changes

1. **Create a Feature Branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**: Follow established patterns in the codebase

3. **Write Tests**:
   - **All code changes (except miniscule changes that don't affect logic) must include automated tests**
   - Follow existing test patterns in `src/**/*.spec.ts`
   - Use Angular testing utilities (TestBed, ComponentFixture)
   - Ensure good test coverage for new functionality

4. **Run Quality Checks**:
   ```bash
   npm run ci
   ```
   This runs linting, formatting checks, build verification, and all tests.

### Commit Guidelines

We use **Conventional Commits** with automatic validation:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update README"
```

**Commit Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Pre-commit Hooks:**

- Prettier formatting runs automatically on staged files
- Commit message validation ensures conventional format

## 📋 Code Quality Requirements

### **❗ MANDATORY: All code must pass `npm run ci` before being allowed to merge**

The `npm run ci` command includes:

1. **ESLint**: Code quality and Angular best practices
2. **Prettier**: Code formatting verification
3. **Build**: Compilation and bundle verification
4. **Tests**: All unit tests must pass

### Manual Quality Checks

```bash
# Lint your code
npm run lint
npm run lint:fix  # Auto-fix issues where possible

# Format your code
npm run format
npm run format:check

# Run tests
npm test          # Single run
npm run test:watch # Watch mode for development

# Build the application
npm run build
```

## 🧪 Testing Requirements

### **📝 Testing is Mandatory**

- **All new code must have corresponding automated tests**
- Exception: Miniscule changes that don't change application logic
- Follow established testing patterns in the codebase

### Testing Guidelines

1. **Unit Tests**: Test individual components, services, and utilities
2. **Component Tests**: Use Angular TestBed for component testing
3. **Service Tests**: Test business logic and data handling
4. **Integration Tests**: Test component interactions where appropriate

### Test File Organization

- Place test files next to the code they test: `component.spec.ts`
- Use descriptive test names: `should update stage when character changes`
- Group related tests with `describe` blocks
- Use `beforeEach` for common setup

## 🔄 Pull Request Process

1. **Ensure Your Branch is Up-to-Date**:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run Final Checks**:

   ```bash
   npm run ci
   ```

   **This must pass without errors before submitting your PR.**

3. **Submit Pull Request**:
   - Use a descriptive title following conventional commit format
   - Provide detailed description of changes
   - Reference any related issues
   - Include screenshots for UI changes

4. **Code Review Process**:
   - All PRs require review before merging
   - Address feedback promptly
   - Keep commits focused and atomic

### Branch Protection

The `main` branch has protection rules requiring:

- ✅ Pull request before merging
- ✅ Status checks must pass (CI pipeline)
- ✅ Branch must be up-to-date
- ✅ Review approval

## 📦 Versioning & Releases

### **Automatic Semantic Versioning**

- **Versioning is handled automatically by semantic-release**
- No manual version bumps needed
- Versions are determined by conventional commit messages:
  - `fix:` → Patch version (1.0.1)
  - `feat:` → Minor version (1.1.0)
  - `BREAKING CHANGE:` → Major version (2.0.0)

### Release Process

1. **Merge to Main**: When PRs are merged to `main` branch
2. **Automatic Release**: Release workflow runs after CI passes:
   - Analyzes commits for version bump
   - Updates `CHANGELOG.md` and `package.json`
   - Creates GitHub release
   - Builds and uploads release artifacts

**You don't need to manage versions manually!**

## 🎯 Code Scaffolding

Use Angular CLI for consistent code generation:

```bash
# Generate a new component
ng generate component component-name

# Generate a service
ng generate service service-name

# See all available schematics
ng generate --help
```

## 📚 Additional Resources

- [README.md](README.md) - Project overview and setup
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Testing Guide](https://angular.dev/guide/testing)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the established coding standards

## ❓ Getting Help

- Create an issue for bugs or feature requests
- Join discussions in existing issues
- Review the existing documentation and codebase

---

Thank you for contributing to Theater Kid! 🎭✨
