---
description: SCSS/CSS Best Practices — BEM naming, custom properties, no !important, modular styles
applyTo: '**/*.{scss,css}'
---

## BEM Naming Convention

Use Block__Element--Modifier for all class names. Never use camelCase or PascalCase in CSS.

```scss
// Block — represents a standalone UI component
.product-card {
}

// Element — a child part of the block, separated by double underscore
.product-card__title {
}
.product-card__image {
}
.product-card__price {
}
.product-card__actions {
}

// Modifier — a variant of the block or element, separated by double hyphen
.product-card--featured {
}
.product-card--out-of-stock {
}
.product-card__title--truncated {
}
.product-card__price--discounted {
}
```

Rules:

- Block names are always `kebab-case`
- Elements use double underscore `__`
- Modifiers use double hyphen `--`
- A modifier always goes with its block or element: `.product-card.product-card--featured`, never just `.featured`
- Never abbreviate block names cryptically: `.pc__ttl` is unacceptable — use `.product-card__title`

## No Hardcoded Values

Never hardcode colors, spacing, font sizes, border radii, shadows, or z-index as raw literal values.

**Define design tokens as CSS custom properties in a global `:root` block:**

```scss
// styles/tokens.scss
:root {
  // Colors
  --color-primary: #1a73e8;
  --color-primary-hover: #1557b0;
  --color-secondary: #fbbc04;
  --color-text: #202124;
  --color-text-muted: #5f6368;
  --color-surface: #ffffff;
  --color-surface-alt: #f8f9fa;
  --color-border: #dadce0;
  --color-error: #d93025;
  --color-success: #1e8e3e;

  // Spacing
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  // Typography
  --font-size-xs: 0.75rem; // 12px
  --font-size-sm: 0.875rem; // 14px
  --font-size-base: 1rem; // 16px
  --font-size-lg: 1.125rem; // 18px
  --font-size-xl: 1.25rem; // 20px
  --font-size-2xl: 1.5rem; // 24px
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-base: 1.5;

  // Shape
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 9999px;

  // Shadows
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  // Z-index scale
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-tooltip: 500;
  --z-toast: 600;
}
```

**Use them in component styles:**

```scss
// ✅ Good
.product-card {
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  color: var(--color-text);

  &__title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
  }

  &__price {
    font-size: var(--font-size-xl);
    color: var(--color-primary);
  }
}

// ❌ Bad — hardcoded values
.product-card {
  padding: 16px;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 8px;
  color: #202124;
}
```

**Use SCSS variables (`$`) only for SCSS-only context** (breakpoints, mixin parameters, `calc()` inputs):

```scss
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

@mixin respond-to($bp) {
  @media (min-width: $bp) {
    @content;
  }
}
```

## Avoid `!important`

- Never use `!important` — it defeats the CSS cascade and makes debugging painful
- If you think you need it, fix the root cause by reducing selector specificity instead
- The only permitted exception: accessibility utility classes in a dedicated `utilities.scss` file:
  ```scss
  // utilities.scss — the ONLY place !important is allowed
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
  }
  ```

## Optimize Selectors

- **Prefer class selectors** over element/tag selectors:
  ```scss
  // ✅ Good
  .btn {
  }
  .nav-link {
  }

  // ❌ Bad — too broad, too specific
  button {
  }
  nav a {
  }
  ```
- **Never use ID selectors** (`#my-id`) in component styles — they have extremely high specificity
- **Avoid attribute selectors** (`[data-type="primary"]`) in hot paths — use classes instead
- **Avoid deeply chained descendant selectors** (`.a .b .c .d`) — they're fragile and hard to override
- Target the element directly with a BEM class — one class is almost always enough

## Minimize Nesting

Maximum **3 levels** of nesting. Beyond that, use additional BEM classes instead.

```scss
// ✅ Good — flat BEM
.nav {
}
.nav__item {
}
.nav__item--active {
}
.nav__link {
}
.nav__link:hover {
}

// ❌ Bad — 4+ levels deep
.nav {
  ul {
    li {
      a {
        &:hover {
        } // 4 levels deep!
      }
    }
  }
}
```

Use `&` only for:

- Pseudo-classes: `&:hover`, `&:focus`, `&:disabled`
- Pseudo-elements: `&::before`, `&::after`, `&::placeholder`
- BEM modifiers: `&--active`, `&--large`
- State classes: `&.is-open`, `&.is-loading`

```scss
// ✅ Correct use of &
.btn {
  // Base styles...

  &:hover {
    background: var(--color-primary-hover);
  }
  &:focus-visible {
    outline: 2px solid var(--color-primary);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &::before {
    content: '';
  }

  &--primary {
    background: var(--color-primary);
  }
  &--secondary {
    background: transparent;
  }

  &.is-loading {
    pointer-events: none;
  }
}

// ❌ Wrong — creates descendant selectors
.btn {
  & .icon {
    margin-right: var(--spacing-xs);
  } // outputs: .btn .icon
  & span {
    font-weight: bold;
  } // outputs: .btn span
}
```

## Modularize CSS

- **One SCSS file per component** — Angular's `styleUrl` provides automatic view encapsulation
- **Global styles** go in `apps/<app>/src/styles/`:
  ```
  styles/
    tokens.scss       — CSS custom properties (:root)
    typography.scss   — base font rules
    reset.scss        — CSS reset/normalize
    utilities.scss    — .sr-only, .visually-hidden, etc.
  ```
- Import shared SCSS partials with `@use` (never `@import` — it's deprecated):
  ```scss
  @use '../../../styles/tokens' as *;
  @use '../../../styles/mixins' as m;
  ```
- **Never put component-specific rules in global files** — a rule for `.product-card` belongs only in `product-card.scss`
- **Never repeat the same CSS rules** across component files — extract to a mixin or utility class

## Units

| Property                       | Unit              | Reason                                          |
| ------------------------------ | ----------------- | ----------------------------------------------- |
| Font size                      | `rem`             | Scales with browser accessibility settings      |
| Line height                    | unitless (`1.5`)  | Relative to element's own font size             |
| Spacing (padding, margin, gap) | `rem` or `px`     | `rem` preferred for consistency with font scale |
| Borders, shadows, outlines     | `px`              | Fine details that should not scale              |
| Layout widths                  | `%`, `fr`, `ch`   | Responsive containers                           |
| Breakpoints                    | `px` in SCSS vars | Consistent with browser defaults                |
| Viewport-relative              | `vw`, `vh`, `dvh` | Full-screen layouts, hero sections              |

Rules:

- Never mix `em` and `rem` in the same property — pick one and be consistent per project
- Never use `px` for font sizes (breaks accessibility when users change browser font size)
- Avoid arbitrary magic pixel values — if you're writing `margin-top: 13px`, that value should be a token
