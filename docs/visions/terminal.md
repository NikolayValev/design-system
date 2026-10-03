<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/terminal.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Terminal

> Command-line certainty rendered as UI.

**id** `terminal` · **family** Technical & Utility · **archetype** CRT Utility · **default mode** dark

Terminal prioritises speed, precision, and semantic clarity for technical workflows. Monospace hierarchy improves data alignment and minimal decoration keeps throughput high for expert users.

**Mood:** utilitarian, code-native, deterministic

**Best for:** Developer tools · Infrastructure consoles · Operational control surfaces

## Import

```ts
import '@nikolayvalev/design-system/styles/terminal.css';
import '@nikolayvalev/design-system/styles/fonts/terminal.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.97 0.01 145)` | `oklch(0.17 0.03 150)` |
| `foreground` | `oklch(0.22 0.04 150)` | `oklch(0.87 0.12 150)` |
| `surface` | `oklch(0.99 0.005 145)` | `oklch(0.2 0.03 150)` |
| `surfaceForeground` | `oklch(0.22 0.04 150)` | `oklch(0.87 0.12 150)` |
| `accent` | `oklch(0.52 0.18 145)` | `oklch(0.8 0.18 145)` |
| `accentForeground` | `oklch(0.98 0.01 145)` | `oklch(0.14 0.03 150)` |
| `secondary` | `oklch(0.90 0.02 150)` | `oklch(0.62 0.14 170)` |
| `secondaryForeground` | `oklch(0.24 0.04 150)` | `oklch(0.14 0.03 150)` |
| `muted` | `oklch(0.94 0.015 145)` | `oklch(0.25 0.03 150)` |
| `mutedForeground` | `oklch(0.45 0.05 150)` | `oklch(0.72 0.09 150)` |
| `border` | `oklch(0.84 0.02 145)` | `oklch(0.47 0.08 150)` |
| `input` | `oklch(0.96 0.01 145)` | `oklch(0.23 0.03 150)` |
| `ring` | `oklch(0.54 0.18 145)` | `oklch(0.81 0.18 145)` |
| `danger` | `oklch(0.55 0.2 30)` | `oklch(0.65 0.2 30)` |
| `dangerForeground` | `oklch(0.98 0.01 145)` | `oklch(0.14 0.03 150)` |
| `chart1` | `oklch(0.55 0.18 145)` | `oklch(0.81 0.18 145)` |
| `chart2` | `oklch(0.58 0.15 170)` | `oklch(0.74 0.15 170)` |
| `chart3` | `oklch(0.62 0.15 100)` | `oklch(0.76 0.15 100)` |
| `chart4` | `oklch(0.60 0.16 60)` | `oklch(0.71 0.16 60)` |
| `chart5` | `oklch(0.58 0.15 20)` | `oklch(0.7 0.15 20)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"JetBrains Mono", "Cascadia Code", monospace` |
| Display face | `"VT323", "JetBrains Mono", monospace` |
| Mono face | `"JetBrains Mono", "Cascadia Code", monospace` |
| Scale multipliers | body `0.98` · display `1.08` |
| Line height | tight `1.16` · normal `1.5` · relaxed `1.68` |
| Letter spacing | tight `0em` · normal `0.01em` · wide `0.06em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.2rem` · control `0.2rem` · pill `0.2rem` |
| Border weight | `2px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 2px 5px -2px rgba(0, 0, 0, 0.5)` |
| Hard shadow | `3px 3px 0 rgba(0, 0, 0, 0.6)` |
| Glow | `0 0 24px rgba(96, 255, 179, 0.32)` |
| Surface blur | `0px` |
| Transparency | `0.96` |
| Grain | `0.02` |
| Ornaments | grain true · glow true · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `80ms` · normal `120ms` · slow `200ms` |
| Standard easing | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.15, 0.95, 0.2, 1)` |
| Physics | `scanline-step` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
