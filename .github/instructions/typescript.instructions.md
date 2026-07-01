---
description: TypeScript Best Practices — enforces strict typing and modern TypeScript idioms
alwaysApply: true
---

## Strict Mode

- Always enable strict mode in `tsconfig.json` — never set `strict: false`
- Enable `noUncheckedIndexedAccess: true` for safer array/object access
- Enable `exactOptionalPropertyTypes: true` to distinguish `undefined` from a missing property

## Type Safety

- Use `unknown` instead of `any` for values of uncertain type; narrow with type guards before use
- Use the `satisfies` operator for type-checking without widening — never use `as` for type assertions unless absolutely necessary:
  ```ts
  // ✅ Good
  const config = { timeout: 5000, retries: 3 } satisfies Partial<Config>;

  // ❌ Bad — silently widens the type
  const config = { timeout: 5000, retries: 3 } as Config;
  ```
- Prefer discriminated unions with a `type` or `kind` field over optional properties:
  ```ts
  // ✅ Good
  type Result = { kind: 'success'; data: User } | { kind: 'error'; message: string };

  // ❌ Bad — hard to narrow, easy to misuse
  type Result = { data?: User; message?: string; isError: boolean };
  ```
- Use exhaustive `switch` with `never` in the `default` branch when handling union types:
  ```ts
  function handle(result: Result): string {
    switch (result.kind) {
      case 'success':
        return result.data.name;
      case 'error':
        return result.message;
      default: {
        const _exhaustive: never = result;
        throw new Error(`Unhandled result kind: ${JSON.stringify(_exhaustive)}`);
      }
    }
  }
  ```

## Imports

- Use `import type` for type-only imports — keeps the JS output clean:
  ```ts
  import type { User } from './user.model';
  import { UserService } from './user.service';
  ```

## Literal Types and Const Assertions

- Add `as const` assertions when literal types are needed (on arrays and objects):
  ```ts
  const ROLES = ['admin', 'user', 'guest'] as const;
  type Role = (typeof ROLES)[number]; // 'admin' | 'user' | 'guest'

  const THEME = { primary: '#1a73e8', secondary: '#fbbc04' } as const;
  ```

## Runtime Type Checks

- Use type predicates (`x is T`) over type assertions for runtime type narrowing:
  ```ts
  // ✅ Good — safe, reusable
  function isUser(value: unknown): value is User {
    return typeof value === 'object' && value !== null && 'id' in value && typeof (value as Record<string, unknown>)['id'] === 'string';
  }

  // ❌ Bad — unsafe cast
  const user = response as User;
  ```

## Indexed Access Safety

- When `noUncheckedIndexedAccess` is enabled, always check for `undefined` before using indexed results:
  ```ts
  const first = items[0];
  if (first !== undefined) {
    console.log(first.name);
  }

  // Or use optional chaining
  const name = items[0]?.name;
  ```

## Enums

- Prefer `const` objects with `as const` over TypeScript `enum` to avoid JS runtime overhead and tree-shaking issues:
  ```ts
  // ✅ Good
  const Status = {
    Active: 'active',
    Inactive: 'inactive',
    Pending: 'pending',
  } as const;
  type Status = (typeof Status)[keyof typeof Status];

  // ❌ Avoid
  enum Status {
    Active = 'active',
    Inactive = 'inactive',
    Pending = 'pending',
  }
  ```

## Naming

- Interfaces and Types: `PascalCase` — do NOT prefix interfaces with `I` (no `IUser`, use `User`)
- Type parameters: single uppercase letter or descriptive PascalCase (`T`, `TKey`, `TResult`, `TData`)
- Module-level constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS`)
- Local constants within a function: `camelCase` (`const maxItems = 10`)
- Never shadow built-in names (`name`, `length`, `event`, `error`)
