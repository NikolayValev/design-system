# @nikolayvalev/design-tokens

Install this package when you want token primitives, theme profiles, and Tailwind integration without runtime UI components.

## Install

```bash
pnpm add @nikolayvalev/design-tokens
```

## Usage

```ts
import '@nikolayvalev/design-tokens/styles/public.css';
import { createTailwindPreset, publicProfile } from '@nikolayvalev/design-tokens/tailwind';
```

```ts
import { createTheme, applyTheme, publicProfile } from '@nikolayvalev/design-tokens';
```

## Export Paths

- `@nikolayvalev/design-tokens`
- `@nikolayvalev/design-tokens/tokens`
- `@nikolayvalev/design-tokens/tailwind`
- `@nikolayvalev/design-tokens/styles/public.css`
- `@nikolayvalev/design-tokens/styles/dashboard.css`
- `@nikolayvalev/design-tokens/styles/experimental.css`
