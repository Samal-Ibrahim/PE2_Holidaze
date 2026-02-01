# Husky - Git Hooks Configuration

## Installation

Husky is already initialized in your project. The hooks are located in `.husky/` directory.

## Pre-commit Hook

The pre-commit hook runs automatically before each commit and:
1. Runs `lint-staged` to lint only staged files
2. Runs `npm run lint` to check code quality
3. Runs `npm test` to execute tests

### What lint-staged does:

For `*.ts` and `*.tsx` files:
- Runs `npm run lint` (Biome linter)
- Runs `npm run format` (Biome formatter)

For `*.json` files:
- Runs `npm run format`

## How to Use

Simply commit your code as usual:

```bash
git add .
git commit -m "Your commit message"
```

If any linting or test failures occur, the commit will be blocked. Fix the issues and try again.

## Bypassing Husky (Not recommended)

If you absolutely need to skip Husky checks:

```bash
git commit --no-verify -m "Your message"
```

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `.lintstagedrc.json` - lint-staged configuration
- `package.json` - Contains `prepare` script for Husky initialization
