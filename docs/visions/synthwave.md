<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/synthwave.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Synthwave

> Neon drama balanced with clear hierarchy.

**id** `synthwave` · **family** Atmospheric & Luminous · **archetype** Retro Futurism · **default mode** dark

Synthwave balances nostalgia and legibility through neon accents, dark fields, and rhythmic transitions. Vivid glow signatures create memorable action points while contrast hierarchy stays intact.

**Mood:** retro-future, electric, night-mode

**Best for:** Entertainment interfaces · Music and creative tools · Expressive dark themes

## Import

```ts
import '@nikolayvalev/design-system/styles/synthwave.css';
import '@nikolayvalev/design-system/styles/fonts/synthwave.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.97 0.015 295)` | `oklch(0.22 0.06 296)` |
| `foreground` | `oklch(0.22 0.05 296)` | `oklch(0.95 0.02 270)` |
| `surface` | `oklch(0.99 0.01 292)` | `oklch(0.28 0.08 300)` |
| `surfaceForeground` | `oklch(0.22 0.05 296)` | `oklch(0.95 0.02 270)` |
| `accent` | `oklch(0.55 0.23 335)` | `oklch(0.76 0.23 335)` |
| `accentForeground` | `oklch(0.98 0.01 292)` | `oklch(0.18 0.05 295)` |
| `secondary` | `oklch(0.90 0.03 295)` | `oklch(0.72 0.2 215)` |
| `secondaryForeground` | `oklch(0.24 0.05 296)` | `oklch(0.18 0.05 295)` |
| `muted` | `oklch(0.94 0.02 292)` | `oklch(0.3 0.05 292)` |
| `mutedForeground` | `oklch(0.44 0.05 296)` | `oklch(0.82 0.05 270)` |
| `border` | `oklch(0.84 0.03 295)` | `oklch(0.46 0.12 305)` |
| `input` | `oklch(0.96 0.015 292)` | `oklch(0.33 0.07 295)` |
| `ring` | `oklch(0.58 0.23 334)` | `oklch(0.79 0.23 334)` |
| `danger` | `oklch(0.55 0.24 20)` | `oklch(0.7 0.24 20)` |
| `dangerForeground` | `oklch(0.98 0.01 292)` | `oklch(0.19 0.05 295)` |
| `chart1` | `oklch(0.58 0.23 334)` | `oklch(0.79 0.23 334)` |
| `chart2` | `oklch(0.58 0.20 215)` | `oklch(0.72 0.2 215)` |
| `chart3` | `oklch(0.60 0.22 285)` | `oklch(0.75 0.22 285)` |
| `chart4` | `oklch(0.64 0.20 120)` | `oklch(0.78 0.2 120)` |
| `chart5` | `oklch(0.60 0.20 60)` | `oklch(0.74 0.2 60)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Space Grotesk", "Avenir Next", sans-serif` |
| Display face | `"Space Grotesk", "Avenir Next", sans-serif` |
| Mono face | `"Fira Code", "Consolas", monospace` |
| Scale multipliers | body `1.01` · display `1.2` |
| Line height | tight `1.18` · normal `1.5` · relaxed `1.7` |
| Letter spacing | tight `0.03em` · normal `0.016em` · wide `0.065em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.75rem` · control `0.6rem` · pill `9999px` |
| Border weight | `0px` |
| Edge strategy | Float — the shadow defines the edge; there is no hairline. |
| Ambient shadow | `0 18px 44px -22px rgba(0, 0, 0, 0.6)` |
| Hard shadow | `2px 2px 0 rgba(16, 4, 34, 0.5)` |
| Glow | `0 0 34px rgba(255, 74, 190, 0.45)` |
| Surface blur | `10px` |
| Transparency | `0.84` |
| Grain | `0.02` |
| Ornaments | grain true · glow true · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `150ms` · normal `230ms` · slow `390ms` |
| Standard easing | `cubic-bezier(0.22, 0.7, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.25, 1, 0.35, 1)` |
| Physics | `neon-pulse` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
