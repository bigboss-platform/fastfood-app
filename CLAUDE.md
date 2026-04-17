# FastFood App — Claude Context

## Current Task
Check `docs/fastfood/tasks/INDEX.md` in the `bigboss` repo for current task status.  
Task files live at `docs/fastfood/tasks/TASK-XX-[STATUS]-name.md`.

## What This Is
Next.js 15 end-user app for the FastFood vertical. Customers browse the menu, add to cart, authenticate via OTP, select delivery or pickup, and place orders.  
URL structure: `/{tenant-slug}` — every route is tenant-aware.

## Stack
- Next.js 15 (App Router), TypeScript strict, CSS Modules only
- No UI component libraries, no animation libraries (pure CSS keyframes)
- Vitest + React Testing Library (unit), Playwright (E2E against staging only)
- Dev Container — open in VS Code and reopen in container

## Project Structure
```
app/
  [tenant-slug]/
    layout.tsx    — server component, fetches + injects tenant theme CSS vars
    page.tsx      — renders MenuExperienceContainer
  globals.css     — design tokens (:root CSS vars), reset, all keyframe animations
feature/
  loading/        — loading screen component
  menus/          — menu experience (server container + client components + hooks)
  cart/           — cart drawer, cart state hook
  auth/           — OTP flow components, useAuth hook, auth service
  orders/         — delivery options, bill screen, active order view
  shared/         — drawer component, shared utilities
tests/
  unit/           — mirrors feature/ folder structure
  e2e/            — Playwright specs (run against staging only)
```

## Feature Folder File Naming
`{descriptive-name}.{folder-name-singular}.{extension}`

Examples:
- `menu-item.component.tsx` (inside `components/`)
- `use-menu-scroll.hook.ts` (inside `hooks/`)
- `menu.service.ts` (inside `services/`)
- `order-status.enum.ts` (inside `enums/`)
- `order.constant.ts` (inside `constants/`)
- `menu-item.interface.ts` (inside `interfaces/`)
- `menu-experience.style.module.css` (inside `styles/`)

## Hard Rules — Never Break These

### TypeScript
- `strict: true` — no exceptions
- Never use `null` — use `undefined` only at external boundaries, never as business state
- Never use `any` — type everything explicitly
- Never use non-null assertion `!` — handle the case properly
- Use `EMPTY_X` constants as the canonical empty state for every interface

### Empty Object Pattern
Every interface must have a matching `EMPTY_X` constant in `constants/`:
```typescript
// interfaces/order.interface.ts
export interface IOrder { id: string; status: OrderStatus; ... }

// constants/order.constant.ts
export const EMPTY_ORDER: IOrder = { id: "", status: OrderStatus.PENDING, ... }
```
Never return `null` or `undefined` from a service — return `EMPTY_ORDER` on failure.

### No Comments
- No inline comments
- No block comments
- No JSDoc
- Code must be self-explanatory through naming

### Exports
- Named exports only inside `feature/` — never `export default`
- `app/` directory files may use default exports (Next.js requires it for pages/layouts)

### CSS
- CSS Modules only — `styles/*.style.module.css`
- No Tailwind, no styled-components, no inline styles
- Design tokens via CSS custom properties — always `var(--token-name)`
- Mobile-first: base styles for mobile, `@media (min-width: 768px)` for desktop
- Animations via CSS keyframes defined in `globals.css` — reference by class name
- `prefers-reduced-motion` must be respected

### Components
- Server components by default in `app/` directory
- Add `"use client"` only when component needs: state, effects, event handlers, browser APIs
- Server actions use `"use server"` at the top of the file

### Services
- Services in `feature/*/services/` are `"use server"` — they call the backend API directly
- Services NEVER throw — they return `EMPTY_X` on any failure
- No `console.log` — errors are silently handled with empty returns

### Utils
- Pure data-transformation functions (no state, no effects, no API calls) go in `feature/*/utils/{name}.util.ts`
- Never define them inline inside a container or component file
- Named exports only, same as the rest of `feature/`

### data-testid
Every interactive element and major container must have `data-testid`.  
E2E tests target these — never use class names or text content in selectors.

## Design Tokens (key ones)
```css
--color-primary          /* brand color — from tenant theme */
--color-background
--color-surface
--color-text-primary
--color-text-secondary
--color-border
--spacing-xs / sm / md / lg / xl / 2xl
--font-size-sm / md / lg / xl / 2xl
--font-weight-normal / medium / bold
--radius-sm / md / lg / full
```

## State That Lives in localStorage
- `bb_access_token` — end user JWT
- `bb_refresh_token` — end user refresh token
- `bb_active_order_id` — current active order (cleared when order completes)

## Terminology
- `Tenant` — the business (never "store", "restaurant", "client")
- `End User` — the person placing the order (never "customer" alone)
- Spanish UI labels — all user-facing text is in Spanish

## Running Things (inside Dev Container)
```bash
pnpm dev              # start on :3001
pnpm type-check       # TypeScript check
pnpm lint             # ESLint
pnpm test:unit        # Vitest unit tests
pnpm test:unit --run  # single run (no watch)
```

## Forbidden Patterns
- `null` as a value — use `EMPTY_X` constants
- `any` type — type everything
- `export default` inside `feature/`
- Utility functions defined inline in containers or components — use `feature/*/utils/` instead
- Inline styles — CSS Modules only
- Comments in code
- `console.log`
- Throwing from service functions — return `EMPTY_X`
- Animation libraries — pure CSS only
- Non-null assertion `!`
