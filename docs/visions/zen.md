<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/zen.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Zen Garden

> Low-stimulus calm that keeps attention on the task.

**id** `zen` · **family** Minimal & Structured · **archetype** Calm Minimal · **default mode** light

Zen minimises stimulus so interfaces feel steady and mentally lightweight. Muted energy levels reduce cognitive overhead while simple geometry and soft pacing support sustained concentration.

**Mood:** calm, balanced, intentional

**Best for:** Productivity tools · Wellness and mindfulness apps · Focus-first workflows

## Import

```ts
import '@nikolayvalev/design-system/styles/zen.css';
import '@nikolayvalev/design-system/styles/fonts/zen.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.97 0.01 145)` | `oklch(0.18 0.02 150)` |
| `foreground` | `oklch(0.29 0.03 160)` | `oklch(0.93 0.015 145)` |
| `surface` | `oklch(0.99 0.01 150)` | `oklch(0.23 0.025 150)` |
| `surfaceForeground` | `oklch(0.28 0.03 160)` | `oklch(0.93 0.015 145)` |
| `accent` | `oklch(0.53 0.11 170)` | `oklch(0.68 0.11 170)` |
| `accentForeground` | `oklch(0.98 0.01 150)` | `oklch(0.16 0.02 150)` |
| `secondary` | `oklch(0.9 0.03 150)` | `oklch(0.30 0.025 150)` |
| `secondaryForeground` | `oklch(0.31 0.03 160)` | `oklch(0.93 0.01 145)` |
| `muted` | `oklch(0.93 0.02 150)` | `oklch(0.26 0.02 150)` |
| `mutedForeground` | `oklch(0.46 0.03 160)` | `oklch(0.70 0.03 155)` |
| `border` | `oklch(0.86 0.02 150)` | `oklch(0.34 0.025 150)` |
| `input` | `oklch(0.95 0.01 150)` | `oklch(0.27 0.02 150)` |
| `ring` | `oklch(0.6 0.11 170)` | `oklch(0.70 0.11 170)` |
| `danger` | `oklch(0.565 0.17 26)` | `oklch(0.56 0.17 26)` |
| `dangerForeground` | `oklch(0.98 0.01 150)` | `oklch(0.97 0.01 150)` |
| `chart1` | `oklch(0.62 0.11 170)` | `oklch(0.70 0.11 170)` |
| `chart2` | `oklch(0.66 0.12 140)` | `oklch(0.72 0.12 140)` |
| `chart3` | `oklch(0.7 0.1 90)` | `oklch(0.74 0.10 90)` |
| `chart4` | `oklch(0.58 0.09 200)` | `oklch(0.68 0.09 200)` |
| `chart5` | `oklch(0.62 0.1 45)` | `oklch(0.70 0.10 45)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Noto Sans", "Hiragino Sans", sans-serif` |
| Display face | `"Noto Serif", "Georgia", serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `0.98` · display `1.1` |
| Line height | tight `1.24` · normal `1.6` · relaxed `1.84` |
| Letter spacing | tight `-0.005em` · normal `0.01em` · wide `0.05em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `1rem` · control `0.75rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 1px 3px -1px rgba(88, 101, 94, 0.2)` |
| Hard shadow | `1px 1px 0 rgba(112, 126, 117, 0.14)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `2px` |
| Transparency | `0.94` |
| Grain | `0.02` |
| Ornaments | grain true · glow false · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `170ms` · normal `250ms` · slow `380ms` |
| Standard easing | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.25, 1, 0.3, 1)` |
| Physics | `float-soft` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
