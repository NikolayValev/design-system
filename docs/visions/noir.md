<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/noir.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Noir

> High-contrast dark system built for focus and mood.

**id** `noir` · **family** Atmospheric & Luminous · **archetype** Cinematic Contrast · **default mode** dark

Noir privileges focus and selective emphasis with tight dark/light relationships and a reduced palette. Strong typographic contrast supports a dramatic, cinematic tone.

**Mood:** moody, high-contrast, dramatic

**Best for:** Premium dark products · Creative tooling · Cinematic admin experiences

## Import

```ts
import '@nikolayvalev/design-system/styles/noir.css';
import '@nikolayvalev/design-system/styles/fonts/noir.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.98 0.005 258)` | `oklch(0.14 0.01 260)` |
| `foreground` | `oklch(0.18 0.01 260)` | `oklch(0.93 0.01 255)` |
| `surface` | `oklch(1 0.002 255)` | `oklch(0.2 0.01 260)` |
| `surfaceForeground` | `oklch(0.18 0.01 260)` | `oklch(0.93 0.01 255)` |
| `accent` | `oklch(0.52 0.11 252)` | `oklch(0.73 0.11 252)` |
| `accentForeground` | `oklch(0.98 0.005 255)` | `oklch(0.14 0.01 260)` |
| `secondary` | `oklch(0.91 0.01 258)` | `oklch(0.31 0.02 255)` |
| `secondaryForeground` | `oklch(0.22 0.01 260)` | `oklch(0.92 0.01 255)` |
| `muted` | `oklch(0.94 0.008 258)` | `oklch(0.25 0.01 255)` |
| `mutedForeground` | `oklch(0.44 0.01 258)` | `oklch(0.68 0.02 255)` |
| `border` | `oklch(0.84 0.01 256)` | `oklch(0.35 0.02 255)` |
| `input` | `oklch(0.96 0.006 256)` | `oklch(0.26 0.02 255)` |
| `ring` | `oklch(0.54 0.12 252)` | `oklch(0.74 0.12 252)` |
| `danger` | `oklch(0.55 0.2 26)` | `oklch(0.54 0.2 26)` |
| `dangerForeground` | `oklch(0.98 0.005 255)` | `oklch(0.94 0.01 255)` |
| `chart1` | `oklch(0.55 0.12 252)` | `oklch(0.7 0.12 252)` |
| `chart2` | `oklch(0.58 0.15 180)` | `oklch(0.72 0.15 180)` |
| `chart3` | `oklch(0.60 0.12 80)` | `oklch(0.74 0.12 80)` |
| `chart4` | `oklch(0.55 0.15 22)` | `oklch(0.64 0.15 22)` |
| `chart5` | `oklch(0.56 0.12 320)` | `oklch(0.65 0.12 320)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Manrope", "Arial", sans-serif` |
| Display face | `"Playfair Display", "Georgia", serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.14` |
| Line height | tight `1.16` · normal `1.5` · relaxed `1.7` |
| Letter spacing | tight `-0.015em` · normal `0.005em` · wide `0.045em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.45rem` · control `0.375rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 2px 6px -2px rgba(0, 0, 0, 0.55)` |
| Hard shadow | `0 1px 0 rgba(255, 255, 255, 0.12)` |
| Glow | `0 0 24px rgba(151, 179, 255, 0.22)` |
| Surface blur | `8px` |
| Transparency | `0.9` |
| Grain | `0.02` |
| Ornaments | grain true · glow false · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `120ms` · normal `180ms` · slow `280ms` |
| Standard easing | `cubic-bezier(0.2, 0.65, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Physics | `filmic-cut` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
