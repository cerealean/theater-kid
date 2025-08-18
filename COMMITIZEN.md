# Commitizen and Husky Setup

This project now uses:

- **Commitizen** for conventional commit messages
- **Husky** for Git hooks
- **lint-staged** for running formatters on staged files

## Usage

### Making commits

Instead of `git commit`, use:

```bash
npm run commit
```

This will guide you through creating a conventional commit message.

### Pre-commit hooks

The following checks run automatically before each commit:

- Prettier formatting on staged files

## Scripts

- `npm run commit` - Interactive commit with commitizen
- `npm run prepare` - Install husky hooks (runs automatically after npm install)
