# TheaterKid

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

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

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Development Workflow

This project uses **Commitizen** and **Husky** to ensure clean commits and maintain code quality.

### Making Commits

Instead of using `git commit`, use the interactive commitizen CLI:

```bash
npm run commit
```

This will guide you through creating a conventional commit message with the proper format.

### Pre-commit Hooks

The following checks run automatically before each commit:

- **Prettier** formatting on all staged files
- Files are automatically staged after formatting

### Available Scripts

- `npm run commit` - Interactive commit with commitizen (recommended)
- `npm run prepare` - Install husky hooks (runs automatically after npm install)
