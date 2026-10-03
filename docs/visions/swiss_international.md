<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/swiss-international.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Swiss International

> Grid discipline that turns complexity into structure.

**id** `swiss_international` · **family** Minimal & Structured · **archetype** The Grid · **default mode** light

Swiss International turns complexity into structure with sober spacing, strict alignment, and low-noise contrast. Typographic rhythm favours readability before decoration and stays coherent under dense content.

**Mood:** ordered, neutral, precise

**Best for:** Enterprise dashboards · Information-dense systems · Reference and documentation

## Import

```ts
import '@nikolayvalev/design-system/styles/swiss_international.css';
import '@nikolayvalev/design-system/styles/fonts/swiss_international.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.985 0 0)` | `oklch(0.15 0 0)` |
| `foreground` | `oklch(0.18 0 0)` | `oklch(0.95 0 0)` |
| `surface` | `oklch(1 0 0)` | `oklch(0.20 0 0)` |
| `surfaceForeground` | `oklch(0.18 0 0)` | `oklch(0.95 0 0)` |
| `accent` | `oklch(0.565 0.18 29)` | `oklch(0.68 0.18 29)` |
| `accentForeground` | `oklch(0.98 0 0)` | `oklch(0.16 0 0)` |
| `secondary` | `oklch(0.93 0 0)` | `oklch(0.30 0 0)` |
| `secondaryForeground` | `oklch(0.2 0 0)` | `oklch(0.95 0 0)` |
| `muted` | `oklch(0.95 0 0)` | `oklch(0.26 0 0)` |
| `mutedForeground` | `oklch(0.42 0 0)` | `oklch(0.70 0 0)` |
| `border` | `oklch(0.16 0 0)` | `oklch(0.82 0 0)` |
| `input` | `oklch(0.97 0 0)` | `oklch(0.27 0 0)` |
| `ring` | `oklch(0.2 0 0)` | `oklch(0.92 0 0)` |
| `danger` | `oklch(0.58 0.22 26)` | `oklch(0.565 0.22 26)` |
| `dangerForeground` | `oklch(0.98 0 0)` | `oklch(0.97 0 0)` |
| `chart1` | `oklch(0.58 0.18 29)` | `oklch(0.68 0.18 29)` |
| `chart2` | `oklch(0.56 0.14 245)` | `oklch(0.72 0.14 245)` |
| `chart3` | `oklch(0.65 0.15 100)` | `oklch(0.74 0.15 100)` |
| `chart4` | `oklch(0.62 0.13 70)` | `oklch(0.72 0.13 70)` |
| `chart5` | `oklch(0.58 0.14 330)` | `oklch(0.70 0.14 330)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Inter", "Helvetica Neue", "Arial", sans-serif` |
| Display face | `"Inter", "Helvetica Neue", "Arial Black", sans-serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.22` |
| Line height | tight `1.08` · normal `1.5` · relaxed `1.62` |
| Letter spacing | tight `-0.03em` · normal `0em` · wide `0.02em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0px` · control `0px` · pill `0px` |
| Border weight | `1px` |
| Edge strategy | Neither — no shadow at all. The hairline is the only edge. |
| Ambient shadow | `0 0 0 rgba(0, 0, 0, 0)` |
| Hard shadow | `0 0 0 rgba(0, 0, 0, 0)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `1` |
| Grain | `0.01` |
| Ornaments | grain false · glow false · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `70ms` · normal `110ms` · slow `170ms` |
| Standard easing | `linear` |
| Emphatic easing | `linear` |
| Physics | `linear-grid` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
