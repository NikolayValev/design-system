<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/brutalist.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Brutalist

> Function first — structure over decoration.

**id** `brutalist` · **family** Technical & Utility · **archetype** Bold Utility · **default mode** dark

Brutalist strips styling to structural essentials so interaction intent is obvious at a glance. Hard geometry communicates boundaries instantly and high contrast reduces ambiguity in dense UIs.

**Mood:** direct, structural, assertive

**Best for:** Internal tools · Data terminals · Utility-focused products

## Import

```ts
import '@nikolayvalev/design-system/styles/brutalist.css';
import '@nikolayvalev/design-system/styles/fonts/brutalist.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.99 0 0)` | `oklch(0.98 0 0)` |
| `foreground` | `oklch(0.08 0 0)` | `oklch(0.18 0 0)` |
| `surface` | `oklch(1 0 0)` | `oklch(0.96 0 0)` |
| `surfaceForeground` | `oklch(0.08 0 0)` | `oklch(0.18 0 0)` |
| `accent` | `oklch(0.55 0.27 29)` | `oklch(0.54 0.27 29)` |
| `accentForeground` | `oklch(0.99 0 0)` | `oklch(0.98 0 0)` |
| `secondary` | `oklch(0.94 0 0)` | `oklch(0.22 0 0)` |
| `secondaryForeground` | `oklch(0.12 0 0)` | `oklch(0.98 0 0)` |
| `muted` | `oklch(0.96 0 0)` | `oklch(0.9 0 0)` |
| `mutedForeground` | `oklch(0.38 0 0)` | `oklch(0.26 0 0)` |
| `border` | `oklch(0.08 0 0)` | `oklch(0.18 0 0)` |
| `input` | `oklch(0.97 0 0)` | `oklch(0.94 0 0)` |
| `ring` | `oklch(0.12 0 0)` | `oklch(0.63 0.26 29)` |
| `danger` | `oklch(0.50 0.24 30)` | `oklch(0.56 0.24 30)` |
| `dangerForeground` | `oklch(0.99 0 0)` | `oklch(0.98 0 0)` |
| `chart1` | `oklch(0.55 0.27 29)` | `oklch(0.64 0.27 29)` |
| `chart2` | `oklch(0.52 0.26 240)` | `oklch(0.62 0.26 240)` |
| `chart3` | `oklch(0.60 0.23 87)` | `oklch(0.73 0.23 87)` |
| `chart4` | `oklch(0.50 0.24 150)` | `oklch(0.58 0.24 150)` |
| `chart5` | `oklch(0.48 0.21 335)` | `oklch(0.52 0.21 335)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Space Grotesk", "Arial Black", sans-serif` |
| Display face | `"Archivo Black", "Helvetica Neue", sans-serif` |
| Mono face | `"JetBrains Mono", "Consolas", monospace` |
| Scale multipliers | body `1.03` · display `1.22` |
| Line height | tight `1.08` · normal `1.5` · relaxed `1.58` |
| Letter spacing | tight `-0.03em` · normal `0em` · wide `0.04em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.1rem` · control `0.1rem` · pill `0.1rem` |
| Border weight | `2px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 1px 0 rgba(0, 0, 0, 0.25)` |
| Hard shadow | `4px 4px 0 0 rgba(0, 0, 0, 1)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `1` |
| Grain | `0` |
| Ornaments | grain false · glow false · texture false |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `90ms` · normal `130ms` · slow `210ms` |
| Standard easing | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.1, 0.9, 0.2, 1)` |
| Physics | `snap-step` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
