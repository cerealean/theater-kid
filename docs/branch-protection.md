# Branch Protection Setup

To enforce the CI/CD pipeline and ensure code quality, set up branch protection rules for the `main` branch:

## Recommended Branch Protection Settings

1. Go to your repository settings on GitHub
2. Navigate to "Branches" in the left sidebar
3. Add a branch protection rule for `main` with these settings:

### Required Settings:

- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - ✅ Required status check: `ci`
- ✅ **Require up-to-date branches before merging**
- ✅ **Include administrators** (recommended)

### Optional Settings:

- ✅ **Require review from code owners** (if you have a CODEOWNERS file)
- ✅ **Dismiss stale reviews when new commits are pushed**
- ✅ **Require linear history** (prevents merge commits)

## Status Checks

The CI workflow creates a status check named `ci` that must pass before merging. This check includes:

1. Code formatting verification (Prettier)
2. Linting (ESLint)
3. Build verification
4. Unit tests

After merging to main, a separate release workflow automatically runs to handle semantic versioning and releases.

With these settings, pull requests cannot be merged until:

- The CI pipeline passes completely
- All required reviews are obtained
- The branch is up-to-date with main

This ensures code quality and prevents broken code from reaching the main branch. Once merged, the release workflow handles automatic versioning and publishing.
