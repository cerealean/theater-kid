# GitHub Codespaces Development Environment

This repository includes a GitHub Codespaces configuration for cloud-based Angular development.

## Features

- **Node.js LTS (v20)**: Latest stable Node.js runtime
- **Angular CLI**: Globally installed and ready to use
- **Flexible Machine Size**: Choose the machine size that fits your needs and budget
- **VS Code Extensions**: Pre-configured with essential Angular/TypeScript development extensions
- **Port Forwarding**: Angular dev server (port 4200) automatically forwarded
- **Auto-setup**: Dependencies automatically installed on container creation

## Getting Started

1. Click the "Code" button on the GitHub repository
2. Select "Codespaces" tab
3. Click "Create codespace on main" or select an existing codespace
4. Wait for the environment to initialize (dependencies will be installed automatically)
5. Run `npm start` to start the Angular development server
6. The dev server will be available at the forwarded port 4200

## Available Commands

- `npm start` - Start the Angular development server
- `npm run build` - Build the application for production
- `npm test` - Run unit tests
- `ng generate component <name>` - Generate a new component
- `ng --help` - View Angular CLI help

## Extensions Included

- Angular Language Service
- TypeScript support
- Prettier code formatting
- ESLint for code quality
- GitLens for Git integration
- Angular snippets and productivity tools

## Development Workflow

1. Make your code changes
2. The Angular dev server will automatically reload on file changes
3. Use the integrated terminal for Angular CLI commands
4. Commit and push your changes using the integrated Git tools