---
description: Angular 21 Best Practices — standalone components, signals, typed DI, and performance
applyTo: '**/*.ts'
---

## Component Architecture

- Every component must be `standalone: true` — never create or import NgModules
- Always set `changeDetection: ChangeDetectionStrategy.OnPush` on every component:
  ```ts
  @Component({
    standalone: true,
    selector: 'app-product-card',
    templateUrl: './product-card.html',
    styleUrl: './product-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class ProductCard {}
  ```
- File naming follows Angular 21 convention — no `.component.` infix:
  - `product-card.ts` (not `product-card.component.ts`)
  - `product-card.html` (not `product-card.component.html`)
  - `product-card.scss` (not `product-card.component.scss`)
- Class naming: `ProductCard` not `ProductCardComponent`
- One component per file; keep components focused on a single responsibility (SRP)
- Use `selector: 'app-*'` prefix for app-level components; library components use the lib prefix

## Dependency Injection

- Always use the `inject()` function — never constructor injection:
  ```ts
  // ✅ Good
  export class ProductCard {
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);
  }

  // ❌ Avoid
  export class ProductCard {
    constructor(
      private readonly productService: ProductService,
      private readonly router: Router,
    ) {}
  }
  ```
- Use `providedIn: 'root'` for singleton services; use component-level `providers: []` for scoped services
- Use `InjectionToken` for non-class dependencies (config, feature flags):
  ```ts
  export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
  ```

## Reactivity — Signals First

- Prefer Angular Signals over RxJS for local and shared component state:
  ```ts
  // ✅ Good
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);

  increment() { this.count.update(n => n + 1); }
  ```
- Use `effect()` for side effects triggered by signal changes (logging, analytics, persistence)
- Use RxJS only for inherently async/stream operations: HTTP responses, WebSockets, event buses
- Bridge Observables to signals with `toSignal()`:
  ```ts
  private readonly products$ = inject(ProductService).getAll();
  readonly products = toSignal(this.products$, { initialValue: [] });
  ```
- Use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` instead of manual `ngOnDestroy`:
  ```ts
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.products$.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(products => { ... });
  }
  ```

## Templates

- Use the new control flow syntax — never `*ngIf`, `*ngFor`, `*ngSwitch`:
  ```html
  <!-- ✅ Good -->
  @if (user()) {
  <app-user-card [user]="user()!" />
  } @else {
  <app-skeleton />
  } @for (product of products(); track product.id) {
  <app-product-card [product]="product" />
  } @empty {
  <p>No products found.</p>
  } @switch (status()) { @case ('loading') { <app-spinner /> } @case ('error') { <app-error-banner /> } @default { <app-product-list /> } }
  ```
- Always provide a `track` expression in `@for` — use a unique ID, never `track $index` for mutable lists
- Use `@defer` for non-critical UI (below the fold, modals, tabs not initially visible):
  ```html
  @defer (on viewport) {
  <app-reviews-section />
  } @placeholder {
  <div class="reviews-placeholder"></div>
  }
  ```
- Never call methods in templates that have side effects or are computationally expensive — use signals or `computed()` instead
- Never access `document`, `window`, or `localStorage` directly in templates or components — use Angular's `DOCUMENT` token or `PlatformId`

## Forms

- Always use Typed Reactive Forms:
  ```ts
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  ```
- Never use `any` in form types (`FormGroup<any>` is forbidden)
- Use `fb.nonNullable.group()` for forms where controls should never be null

## Routing

- Use functional route guards — never class-based guards:
  ```ts
  export const routes: Routes = [
    {
      path: 'admin',
      canActivate: [() => inject(AuthService).isAdmin()],
      loadComponent: () => import('./admin/admin').then((m) => m.Admin),
    },
  ];
  ```
- Lazy-load all feature routes with `loadComponent` (single component) or `loadChildren` (feature routes)
- Never eagerly import large feature components at the app root level

## Performance

- Use `NgOptimizedImage` directive (`ngSrc`) for all `<img>` elements:
  ```html
  <img ngSrc="/assets/hero.jpg" width="800" height="400" priority />
  ```
- Avoid `ngOnChanges` for expensive derivations — use `input()` signals with `computed()` instead:
  ```ts
  // ✅ Good
  readonly userId = input.required<string>();
  readonly user = computed(() => this.userService.getById(this.userId()));

  // ❌ Avoid for derived values
  ngOnChanges(changes: SimpleChanges) { /* recalculate user */ }
  ```
- Set `loading="lazy"` on images that are below the fold

## Visibility Modifiers

- `protected` — for properties and methods used only in the template (keeps the public API clean)
- `private readonly` — for injected services and internal-only logic
- Never use `public` on component members — it's implicit and adds noise
- Never expose internal implementation details as public properties

## RxJS Conventions

- Suffix all Observable variables with `$`: `users$`, `loading$`, `selectedProduct$`
- Prefer pure pipeable operators (`map`, `filter`, `switchMap`, `combineLatest`)
- Never subscribe inside a subscribe — use `switchMap`, `mergeMap`, or `concatMap`
- Always handle errors in observable streams with `catchError`
- Always complete/unsubscribe — use `takeUntilDestroyed()`, `take(1)`, or `AsyncPipe`
