# Security Policy

## Supported Versions

We take security seriously in Theater Kid. Security updates are provided for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Theater Kid, please help us maintain a secure environment by reporting it responsibly.

### How to Report

**Please report all security vulnerabilities, or perceived security vulnerabilities, by creating a new issue in this repository:**

1. Go to [GitHub Issues](https://github.com/cerealean/theater-kid/issues/new)
2. Create a new issue with a clear title indicating it's a security concern
3. Include a detailed description of the vulnerability, including:
   - Steps to reproduce the issue
   - Potential impact
   - Affected versions (if known)
   - Any suggested fixes or workarounds

### What to Expect

- We will acknowledge your report within 48 hours
- We will investigate and provide an initial assessment within 5 business days
- We will keep you informed of our progress toward resolving the issue
- Once the vulnerability is resolved, we will coordinate disclosure and recognition

## Security Features

Theater Kid includes several built-in security measures:

### Content Security

- **Markdown Sanitization**: All user-provided markdown content is sanitized to prevent XSS attacks
- **HTML Filtering**: Dangerous HTML elements and attributes are automatically removed
- **Script Tag Protection**: JavaScript injection attempts are blocked

### API Security

- **User-Supplied Keys**: All API keys are user-provided and stored locally only
- **No Server-Side Storage**: Theater Kid does not store or transmit your API keys to our servers

### Development Security

- **Automated Security Testing**: Our CI/CD pipeline includes security-focused tests
- **Dependency Monitoring**: We regularly update dependencies to address known vulnerabilities
- **Code Quality Checks**: ESLint and other tools help identify potential security issues

## Responsible Disclosure

We believe in responsible disclosure of security vulnerabilities. Please:

- Give us reasonable time to address the issue before public disclosure
- Avoid accessing or modifying data that doesn't belong to you
- Do not perform testing that could harm our users or degrade service quality

Thank you for helping keep Theater Kid secure! 🎭
