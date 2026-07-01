import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:shop',
              onlyDependOnLibsWithTags: ['scope:shop', 'scope:shared'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:api', 'scope:shared'],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:data'],
            },
          ],
        },
      ],
    },
  },
  // ── TypeScript strict rules (mirrors .github/instructions/typescript.instructions.md) ──
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    rules: {
      // No `any` — use `unknown` and narrow with type guards
      '@typescript-eslint/no-explicit-any': 'error',

      // No `var` — use `const` or `let`
      'no-var': 'error',

      // Prefer `const` when variable is never reassigned
      'prefer-const': 'error',

      // Use `import type` for type-only imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // No unused variables (catches dead code)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // No non-null assertion `!` — handle undefined explicitly
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Warn on `as any` — use `unknown` + type guard instead
      // (full `assertionStyle: never` is too strict for Angular test patterns)
      '@typescript-eslint/no-unsafe-type-assertion': 'off',

      // No `console.log` left in committed code (use proper logging)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // No magic numbers — name your constants
      'no-magic-numbers': [
        'warn',
        {
          ignore: [-1, 0, 1, 2, 100],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreClassFieldInitialValues: true,
        },
      ],

      // Functions should have explicit return types (helps catch mistakes early)
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
    },
  },

  // ── JavaScript-only rules (no TypeScript files) ──
  {
    files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
