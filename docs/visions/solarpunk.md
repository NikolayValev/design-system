<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/solarpunk.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Solarpunk

> Engineered optimism for civic and climate products.

**id** `solarpunk` · **family** Expressive & Statement · **archetype** Optimistic Ecology · **default mode** light

Solarpunk frames digital tools as constructive systems for communities and sustainability. Eco-forward colour signals progress and trust while soft contrast stays informative without alarm.

**Mood:** hopeful, organic, clean-tech

**Best for:** Civic and community tools · Climate and energy products · Public-good platforms

## Import

```ts
import '@nikolayvalev/design-system/styles/solarpunk.css';
import '@nikolayvalev/design-system/styles/fonts/solarpunk.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.95 0.03 120)` | `oklch(0.17 0.03 140)` |
| `foreground` | `oklch(0.27 0.05 145)` | `oklch(0.93 0.02 120)` |
| `surface` | `oklch(0.98 0.03 120)` | `oklch(0.22 0.035 140)` |
| `surfaceForeground` | `oklch(0.27 0.05 145)` | `oklch(0.93 0.02 120)` |
| `accent` | `oklch(0.53 0.11 145)` | `oklch(0.66 0.11 145)` |
| `accentForeground` | `oklch(0.97 0.02 118)` | `oklch(0.16 0.03 140)` |
| `secondary` | `oklch(0.72 0.12 50)` | `oklch(0.30 0.05 50)` |
| `secondaryForeground` | `oklch(0.24 0.05 142)` | `oklch(0.93 0.02 120)` |
| `muted` | `oklch(0.9 0.03 120)` | `oklch(0.26 0.03 135)` |
| `mutedForeground` | `oklch(0.41 0.05 145)` | `oklch(0.70 0.04 140)` |
| `border` | `oklch(0.76 0.08 138)` | `oklch(0.34 0.04 138)` |
| `input` | `oklch(0.93 0.03 120)` | `oklch(0.27 0.03 138)` |
| `ring` | `oklch(0.56 0.11 145)` | `oklch(0.68 0.11 145)` |
| `danger` | `oklch(0.56 0.2 33)` | `oklch(0.56 0.2 33)` |
| `dangerForeground` | `oklch(0.97 0.02 110)` | `oklch(0.97 0.01 110)` |
| `chart1` | `oklch(0.56 0.11 145)` | `oklch(0.68 0.11 145)` |
| `chart2` | `oklch(0.72 0.12 50)` | `oklch(0.72 0.12 50)` |
| `chart3` | `oklch(0.74 0.13 215)` | `oklch(0.74 0.13 215)` |
| `chart4` | `oklch(0.68 0.12 85)` | `oklch(0.74 0.12 85)` |
| `chart5` | `oklch(0.66 0.14 22)` | `oklch(0.72 0.14 22)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Source Sans 3", "Gill Sans", "Avenir Next", sans-serif` |
| Display face | `"Fraunces", "Georgia", serif` |
| Mono face | `"Fira Code", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.15` |
| Line height | tight `1.2` · normal `1.52` · relaxed `1.75` |
| Letter spacing | tight `-0.01em` · normal `0em` · wide `0.03em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `1.25rem` · control `1rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 2px 6px -2px rgba(58, 89, 39, 0.26)` |
| Hard shadow | `2px 3px 0 rgba(74, 110, 52, 0.22)` |
| Glow | `0 0 28px rgba(130, 199, 114, 0.3)` |
| Surface blur | `8px` |
| Transparency | `0.88` |
| Grain | `0.03` |
| Ornaments | grain true · glow true · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `180ms` · normal `320ms` · slow `520ms` |
| Standard easing | `cubic-bezier(0.2, 0.75, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.2, 1, 0.32, 1)` |
| Physics | `organic-blob-drift` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
