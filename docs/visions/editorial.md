<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/editorial.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Editorial

> Publication-grade typography where hierarchy and pacing lead.

**id** `editorial` · **family** Editorial & Print · **archetype** Print Modernism · **default mode** light

Editorial provides a publication-grade baseline where text hierarchy and story pacing stay central. Balanced spacing keeps long-form layouts scannable and its component vocabulary suits content-first teams.

**Mood:** polished, authoritative, narrative

**Best for:** Newsrooms and publishing suites · Long-form content products · Content-first marketing sites

## Import

```ts
import '@nikolayvalev/design-system/styles/editorial.css';
import '@nikolayvalev/design-system/styles/fonts/editorial.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.99 0 0)` | `oklch(0.18 0.01 250)` |
| `foreground` | `oklch(0.22 0.02 250)` | `oklch(0.96 0.01 250)` |
| `surface` | `oklch(1 0 0)` | `oklch(0.22 0.015 250)` |
| `surfaceForeground` | `oklch(0.22 0.02 250)` | `oklch(0.96 0.01 250)` |
| `accent` | `oklch(0.56 0.19 22)` | `oklch(0.66 0.19 22)` |
| `accentForeground` | `oklch(0.99 0 0)` | `oklch(0.16 0.02 250)` |
| `secondary` | `oklch(0.9 0.01 250)` | `oklch(0.30 0.02 250)` |
| `secondaryForeground` | `oklch(0.24 0.02 250)` | `oklch(0.95 0.01 250)` |
| `muted` | `oklch(0.94 0.01 250)` | `oklch(0.26 0.02 250)` |
| `mutedForeground` | `oklch(0.46 0.02 250)` | `oklch(0.72 0.02 250)` |
| `border` | `oklch(0.84 0.01 250)` | `oklch(0.34 0.02 250)` |
| `input` | `oklch(0.95 0.01 250)` | `oklch(0.27 0.02 250)` |
| `ring` | `oklch(0.57 0.18 22)` | `oklch(0.68 0.18 22)` |
| `danger` | `oklch(0.55 0.22 24)` | `oklch(0.565 0.21 24)` |
| `dangerForeground` | `oklch(0.99 0 0)` | `oklch(0.97 0 0)` |
| `chart1` | `oklch(0.57 0.18 22)` | `oklch(0.68 0.18 22)` |
| `chart2` | `oklch(0.64 0.14 250)` | `oklch(0.72 0.14 250)` |
| `chart3` | `oklch(0.65 0.16 110)` | `oklch(0.74 0.16 110)` |
| `chart4` | `oklch(0.7 0.14 70)` | `oklch(0.78 0.14 70)` |
| `chart5` | `oklch(0.63 0.14 315)` | `oklch(0.72 0.14 315)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Inter", "Helvetica Neue", sans-serif` |
| Display face | `"DM Serif Display", "Times New Roman", serif` |
| Mono face | `"JetBrains Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.28` |
| Line height | tight `1.08` · normal `1.5` · relaxed `1.65` |
| Letter spacing | tight `-0.02em` · normal `-0.005em` · wide `0.02em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.3rem` · control `0.25rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 1px 3px -1px rgba(0, 0, 0, 0.16)` |
| Hard shadow | `2px 2px 0 rgba(12, 23, 41, 0.18)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `1` |
| Grain | `0` |
| Ornaments | grain false · glow false · texture false |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `110ms` · normal `170ms` · slow `280ms` |
| Standard easing | `cubic-bezier(0.25, 0.7, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.17, 1, 0.3, 1)` |
| Physics | `grid-snap` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
