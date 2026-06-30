# Angular NX Monorepo

## Project Overview

NX 23 monorepo with Angular 21, using **pnpm** as the package manager.
Generated from the `nrwl/angular-template` which creates a demo shop + api structure.

## Structure

- `apps/shop` — Angular 21 frontend (standalone components, SCSS, Vite)
- `apps/api` — Node/Express backend API
- `apps/shop-e2e` — Playwright e2e tests
- `packages/shop/` — Shared Angular libraries (data, feature-product-detail, feature-products, shared-ui)
- `packages/api/` — Shared API packages
- `packages/shared/` — Cross-cutting shared packages

## Package Manager

Use **pnpm** for all installs.

```bash
pnpm nx build shop         # build the shop app
pnpm nx serve shop         # serve the shop app on localhost:4200
pnpm nx serve api          # serve the API on localhost:3000
pnpm nx test shop          # run unit tests
pnpm nx lint shop          # lint
pnpm nx run-many -t build  # build all projects
pnpm nx affected -t lint   # lint only affected projects
```

## Adding New Libraries

```bash
pnpm nx g @nx/angular:library packages/my-lib --standalone
pnpm nx g @nx/node:library packages/my-node-lib
```

## Husky Hooks

- **pre-commit**: runs `lint-staged` — eslint --fix on `.ts/.js`, prettier --write on all other staged files
- **pre-push**: no-op (affected test runner is commented out in `.husky/pre-push`)

## Code Conventions

- Standalone Angular components only (no NgModules)
- SCSS for styles
- ESLint flat config (`eslint.config.mjs`) — ESLint v9 format
- Prettier for all formatting (formatOnSave enabled in VS Code)
- TypeScript strict mode via `tsconfig.base.json`

## CI / GitHub Actions

- `.github/workflows/ci.yml` — runs lint, test, build, typecheck on push/PR to main

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
