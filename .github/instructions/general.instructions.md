---
description: General Code Quality — DRY, SOLID, naming conventions, quotes, and consistency
applyTo: '**'
---

## Naming Conventions

### Files

| File type         | Convention                | Example                         |
| ----------------- | ------------------------- | ------------------------------- |
| Angular component | `kebab-case.ts`           | `product-card.ts`               |
| Angular service   | `kebab-case.service.ts`   | `user.service.ts`               |
| Angular pipe      | `kebab-case.pipe.ts`      | `currency-format.pipe.ts`       |
| Angular guard     | `kebab-case.guard.ts`     | `auth.guard.ts`                 |
| Spec/test file    | `kebab-case.spec.ts`      | `product-card.spec.ts`          |
| Constants file    | `kebab-case.constants.ts` | `api-routes.constants.ts`       |
| Types/models      | `kebab-case.model.ts`     | `user.model.ts`                 |
| Utilities         | `kebab-case.utils.ts`     | `date-format.utils.ts`          |
| SCSS file         | `kebab-case.scss`         | `product-card.scss`             |
| NX library index  | `index.ts`                | (barrel file at `src/index.ts`) |

### TypeScript Identifiers

| Category                       | Convention                    | Examples                                 |
| ------------------------------ | ----------------------------- | ---------------------------------------- |
| Classes                        | `PascalCase`                  | `ProductCard`, `UserService`             |
| Interfaces                     | `PascalCase` (no `I` prefix)  | `User`, `ApiResponse` (not `IUser`)      |
| Type aliases                   | `PascalCase`                  | `UserId`, `LoadingState`                 |
| Enums (avoid — use `as const`) | `PascalCase`                  | `LoadingState`                           |
| Functions / methods            | `camelCase` verb              | `getUserById()`, `parseResponse()`       |
| Variables                      | `camelCase`                   | `currentUser`, `isLoading`               |
| Module-level constants         | `SCREAMING_SNAKE_CASE`        | `MAX_RETRY_COUNT`, `API_BASE_URL`        |
| Local constants (in functions) | `camelCase`                   | `const maxItems = 10`                    |
| Observable variables           | `camelCase` + `$` suffix      | `users$`, `destroy$`, `loading$`         |
| Angular `@Input()`             | `camelCase`                   | `productId`, `isDisabled`                |
| Angular `@Output()`            | `camelCase`, no `on` prefix   | `selected`, `closed`, `valueChange`      |
| Private class members          | `camelCase`, no `_` prefix    | `private userId`, `private readonly svc` |
| Type parameters                | Single letter or `PascalCase` | `T`, `TKey`, `TResult`, `TData`          |

### CSS / SCSS

| Category              | Convention       | Example                             |
| --------------------- | ---------------- | ----------------------------------- |
| CSS class names       | BEM `kebab-case` | `.product-card__title--featured`    |
| CSS custom properties | `--kebab-case`   | `--color-primary`, `--spacing-md`   |
| SCSS variables        | `$kebab-case`    | `$breakpoint-md`, `$font-size-base` |
| SCSS mixin names      | `kebab-case`     | `@mixin respond-to($bp)`            |

## Quotes

- **TypeScript / JavaScript:** Single quotes `'` — always:
  ```ts
  const name = 'Alice';
  import { Component } from '@angular/core';
  const url = '/api/v1/users';
  ```
- **HTML template attributes:** Double quotes `"` — always:
  ```html
  <app-card [title]="'Product'" class="featured" />
  ```
- **SCSS / CSS string values:** Single quotes `'`:
  ```scss
  font-family: 'Inter', sans-serif;
  content: 'Loading…';
  ```
- **JSON:** Double quotes `"` — required by spec
- **Escape rule:** Use the opposite quote type to avoid escaping:
  ```ts
  const message = "It's a beautiful day"; // ✅ avoids escaping
  const message = "It's a beautiful day"; // ❌ unnecessary escape
  ```

## DRY — Don't Repeat Yourself

If the same logic or pattern appears in more than one place, extract it. The right extraction level:

| Duplication scope                | Extraction                                         |
| -------------------------------- | -------------------------------------------------- |
| Within the same function         | Extract a private helper function                  |
| Within the same file             | Extract a private method or local constant         |
| Across multiple files in one app | Extract to a utility (`utils/`) or service         |
| Across multiple components       | Extract to a shared Angular component or directive |
| Across multiple apps             | Extract to a shared library in `packages/shared/`  |
| Repeated SCSS pattern            | Extract to a SCSS mixin or CSS utility class       |
| Repeated template snippet        | Extract to a standalone Angular component          |

Signs you're violating DRY:

- Copy-pasting code between files
- Changing the "same" logic in two places when requirements change
- Having nearly-identical functions that differ by one parameter

## SOLID Principles

### S — Single Responsibility Principle

- One class / service / component = one reason to change
- Angular components handle **presentation only** — business logic belongs in services
- Services are domain-focused: `UserService` handles users; it does not handle products
- If a service file exceeds ~200 lines, consider splitting it

### O — Open/Closed Principle

- Extend behavior through composition and Angular DI — do not modify existing classes to add features
- Use the strategy pattern: inject different implementations behind an `InjectionToken`
- Add new behavior by creating new services/components, not by modifying existing ones

### L — Liskov Substitution Principle

- Any subclass or derived type must be substitutable for its base without breaking callers
- If you extend a base service class, honor the same public contract
- Do not override methods in ways that change their pre/post-conditions

### I — Interface Segregation Principle

- Prefer small, focused interfaces over large "god" interfaces
- A class must not be forced to implement methods it has no use for
- Split large interfaces into composable smaller ones:
  ```ts
  // ✅ Good — composable
  interface Identifiable {
    id: string;
  }
  interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
  }
  interface User extends Identifiable, Timestamped {
    name: string;
    email: string;
  }

  // ❌ Bad — one bloated interface
  interface Entity {
    id: string;
    name: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  ```

### D — Dependency Inversion Principle

- Depend on abstractions (`InjectionToken`, interfaces) — not concrete implementations
- In Angular, always inject through DI — never `new MyService()` in application code:
  ```ts
  // ✅ Good — DI-managed
  private readonly service = inject(ProductService);

  // ❌ Bad — bypasses DI
  private readonly service = new ProductService();
  ```
- Use `InjectionToken` + factory providers to swap implementations for testing or environment differences

## No Magic Numbers or Strings

Replace all unexplained literals with named constants:

```ts
// ❌ Bad
if (retryCount > 3) {
  throw new Error('Too many retries');
}
setTimeout(callback, 30000);
fetch('/api/v1/users');

// ✅ Good
const MAX_RETRY_COUNT = 3;
const SESSION_TIMEOUT_MS = 30_000;
const API_USERS_ENDPOINT = '/api/v1/users';

if (retryCount > MAX_RETRY_COUNT) {
  throw new Error('Too many retries');
}
setTimeout(callback, SESSION_TIMEOUT_MS);
fetch(API_USERS_ENDPOINT);
```

Numeric separators (`1_000_000`) make large numbers readable — use them.

## Function and Method Design

- Functions do **one thing** — if you need "and" to describe it, split it
- Keep functions under ~20 lines; if longer, extract helpers
- Name functions and methods with **verbs**: `getUser()`, `parseResponse()`, `validateEmail()`
- Boolean-returning functions start with `is`, `has`, `can`, or `should`:
  ```ts
  isAuthenticated(): boolean { }
  hasPermission(role: Role): boolean { }
  canSubmit(): boolean { }
  shouldRefetch(): boolean { }
  ```
- Avoid boolean parameters — use options objects or overloads instead:
  ```ts
  // ❌ Bad — what does `true` mean?
  fetchUser(id, true);

  // ✅ Good — self-documenting
  fetchUser(id, { includePermissions: true });
  ```

## Comments

- Never explain **what** the code does — well-named identifiers do that
- Only explain **why**: a non-obvious constraint, a workaround for a bug, a subtle invariant
- Use `// TODO: <ticket>` for known technical debt — always include an issue/ticket reference
- Use `// FIXME:` for known bugs that must be fixed before release
- Never leave commented-out dead code — delete it and rely on git history
- Multi-line block comments (`/* */`) are for JSDoc on public API surfaces only

## Consistency Over Personal Preference

When in doubt, **match the surrounding code** — even if you would write it differently.
Consistency in a codebase is more valuable than any individual style preference.
Run `pnpm lint` and `pnpm exec nx format:check` before every commit — the pre-commit hook enforces this.
