# TheaterKid

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Quick Start with GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/cerealean/theater-kid)

Get started instantly with a fully configured Angular development environment in the cloud:

1. Click the "Open in GitHub Codespaces" badge above
2. Wait for the environment to initialize (dependencies install automatically)
3. Run `npm start` to start the development server
4. Your Angular app will be available at the forwarded port

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

This project includes a GitHub Actions workflow that automatically runs on every push and pull request. The CI pipeline:

1. ✅ Checks code formatting with Prettier
2. ✅ Runs ESLint for code quality
3. ✅ Builds the application
4. ✅ Runs unit tests
5. ✅ Uploads build artifacts

Pull requests must pass all CI checks before they can be merged.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
