<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/museum.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Museum

> Print-era discipline and archival warmth for cultivated reading.

**id** `museum` · **family** Editorial & Print · **archetype** Editorial Heritage · **default mode** light

Museum channels print-era discipline with modern token systems. Serif architecture lends gravity to headings while measured timing and archival warmth make reading-focused flows feel tangible and trustworthy.

**Mood:** warm, curated, literary

**Best for:** Museum and gallery storytelling · Journals and essays · Premium long-form reading

## Import

```ts
import '@nikolayvalev/design-system/styles/museum.css';
import '@nikolayvalev/design-system/styles/fonts/museum.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.97 0.01 80)` | `oklch(0.17 0.02 50)` |
| `foreground` | `oklch(0.24 0.02 50)` | `oklch(0.94 0.01 80)` |
| `surface` | `oklch(0.99 0.005 90)` | `oklch(0.22 0.025 55)` |
| `surfaceForeground` | `oklch(0.23 0.02 50)` | `oklch(0.94 0.01 80)` |
| `accent` | `oklch(0.53 0.13 42)` | `oklch(0.68 0.13 42)` |
| `accentForeground` | `oklch(0.98 0.01 85)` | `oklch(0.16 0.02 50)` |
| `secondary` | `oklch(0.9 0.03 72)` | `oklch(0.30 0.03 55)` |
| `secondaryForeground` | `oklch(0.28 0.03 52)` | `oklch(0.94 0.01 80)` |
| `muted` | `oklch(0.93 0.02 75)` | `oklch(0.26 0.025 55)` |
| `mutedForeground` | `oklch(0.4 0.03 52)` | `oklch(0.70 0.03 60)` |
| `border` | `oklch(0.85 0.03 70)` | `oklch(0.34 0.03 55)` |
| `input` | `oklch(0.9 0.02 75)` | `oklch(0.27 0.025 55)` |
| `ring` | `oklch(0.56 0.11 42)` | `oklch(0.70 0.12 42)` |
| `danger` | `oklch(0.56 0.19 27)` | `oklch(0.56 0.19 27)` |
| `dangerForeground` | `oklch(0.98 0.02 85)` | `oklch(0.97 0.01 85)` |
| `chart1` | `oklch(0.62 0.14 41)` | `oklch(0.72 0.14 41)` |
| `chart2` | `oklch(0.58 0.09 175)` | `oklch(0.68 0.09 175)` |
| `chart3` | `oklch(0.43 0.06 230)` | `oklch(0.66 0.08 230)` |
| `chart4` | `oklch(0.78 0.17 88)` | `oklch(0.78 0.17 88)` |
| `chart5` | `oklch(0.73 0.16 65)` | `oklch(0.75 0.16 65)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Source Serif 4", "Georgia", serif` |
| Display face | `"Cormorant Garamond", "Times New Roman", serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.16` |
| Line height | tight `1.2` · normal `1.5` · relaxed `1.75` |
| Letter spacing | tight `-0.01em` · normal `0em` · wide `0.03em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.5rem` · control `0.375rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 2px 5px -2px rgba(37, 29, 20, 0.22)` |
| Hard shadow | `3px 3px 0 0 rgba(69, 54, 37, 0.18)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `0.92` |
| Grain | `0.08` |
| Ornaments | grain true · glow false · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `130ms` · normal `190ms` · slow `320ms` |
| Standard easing | `cubic-bezier(0.2, 0.65, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Physics | `soft-fade` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
