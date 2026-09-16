<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/quiet-workshop.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Quiet Workshop

> A workshop, not a showroom — one accent, one seam, and type doing the rest.

**id** `quiet_workshop` · **family** Editorial & Print · **archetype** Unbleached Stock · **default mode** light

Quiet Workshop treats the page as material rather than screen: unbleached paper neutrals that were never chemically whitened, and a single fired-clay accent that appears only where something must be signalled. It stays flat by design — a permanent 1px seam is the entire depth vocabulary — so hierarchy falls to typography and to the disciplined use of one colour.

**Mood:** warm, restrained, material, deliberate

**Best for:** Personal sites and portfolios · Case studies and written work · Products that would rather be read than looked at

## Import

```ts
import '@nikolayvalev/design-system/styles/quiet_workshop.css';
import '@nikolayvalev/design-system/styles/fonts/quiet_workshop.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.992 0.004 75)` | `oklch(0.175 0.008 55)` |
| `foreground` | `oklch(0.21 0.012 55)` | `oklch(0.96 0.006 75)` |
| `surface` | `oklch(1 0.003 75)` | `oklch(0.205 0.009 55)` |
| `surfaceForeground` | `oklch(0.21 0.012 55)` | `oklch(0.96 0.006 75)` |
| `accent` | `oklch(0.565 0.14 40)` | `oklch(0.67 0.15 42)` |
| `accentForeground` | `oklch(0.985 0.01 75)` | `oklch(0.18 0.01 55)` |
| `secondary` | `oklch(0.96 0.01 70)` | `oklch(0.27 0.012 55)` |
| `secondaryForeground` | `oklch(0.27 0.012 55)` | `oklch(0.96 0.006 75)` |
| `muted` | `oklch(0.96 0.008 70)` | `oklch(0.27 0.012 55)` |
| `mutedForeground` | `oklch(0.52 0.018 55)` | `oklch(0.72 0.012 65)` |
| `border` | `oklch(0.9 0.011 65)` | `oklch(0.29 0.012 55)` |
| `input` | `oklch(0.9 0.011 65)` | `oklch(0.29 0.012 55)` |
| `ring` | `oklch(0.59 0.14 40)` | `oklch(0.67 0.15 42)` |
| `danger` | `oklch(0.55 0.21 27)` | `oklch(0.64 0.19 27)` |
| `dangerForeground` | `oklch(0.985 0.01 75)` | `oklch(0.18 0.01 55)` |
| `chart1` | `oklch(0.59 0.14 40)` | `oklch(0.67 0.15 42)` |
| `chart2` | `oklch(0.7 0.11 46)` | `oklch(0.78 0.11 48)` |
| `chart3` | `oklch(0.47 0.12 38)` | `oklch(0.56 0.14 40)` |
| `chart4` | `oklch(0.79 0.07 52)` | `oklch(0.87 0.07 56)` |
| `chart5` | `oklch(0.36 0.09 36)` | `oklch(0.45 0.12 38)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Inter", "Helvetica Neue", system-ui, sans-serif` |
| Display face | `"Playfair Display", Georgia, serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.4` |
| Line height | tight `1.05` · normal `1.625` · relaxed `1.75` |
| Letter spacing | tight `-0.025em` · normal `0em` · wide `0.14em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.5rem` · control `0.375rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 1px 2px hsl(28 25% 12% / 0.12)` |
| Hard shadow | `0 0 0 rgba(0, 0, 0, 0)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `1` |
| Grain | `0` |
| Ornaments | grain false · glow false · texture false |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `120ms` · normal `200ms` · slow `320ms` |
| Standard easing | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.17, 1, 0.3, 1)` |
| Physics | `flat-settle` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
