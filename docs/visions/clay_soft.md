<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/clay-soft.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Clay_Soft

> Tactile softness that stays welcoming without losing utility.

**id** `clay_soft` · **family** Minimal & Structured · **archetype** Soft 3D · **default mode** light

Clay Soft mixes tactile warmth with modern component rigor. Rounded surfaces reduce intimidation in first-use contexts while the UI retains clear interaction boundaries and a welcoming brand voice.

**Mood:** rounded, friendly, handcrafted

**Best for:** Consumer onboarding flows · Approachable product UIs · Friendly brand experiences

## Import

```ts
import '@nikolayvalev/design-system/styles/clay_soft.css';
import '@nikolayvalev/design-system/styles/fonts/clay_soft.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.94 0.04 320)` | `oklch(0.19 0.03 320)` |
| `foreground` | `oklch(0.31 0.04 320)` | `oklch(0.94 0.02 315)` |
| `surface` | `oklch(0.97 0.03 320)` | `oklch(0.24 0.035 320)` |
| `surfaceForeground` | `oklch(0.31 0.04 320)` | `oklch(0.94 0.02 315)` |
| `accent` | `oklch(0.82 0.12 14)` | `oklch(0.70 0.12 14)` |
| `accentForeground` | `oklch(0.28 0.03 320)` | `oklch(0.16 0.03 320)` |
| `secondary` | `oklch(0.86 0.09 230)` | `oklch(0.30 0.04 230)` |
| `secondaryForeground` | `oklch(0.28 0.03 320)` | `oklch(0.94 0.02 315)` |
| `muted` | `oklch(0.9 0.05 315)` | `oklch(0.26 0.03 318)` |
| `mutedForeground` | `oklch(0.45 0.04 320)` | `oklch(0.70 0.04 320)` |
| `border` | `oklch(0.84 0.05 312)` | `oklch(0.35 0.04 315)` |
| `input` | `oklch(0.95 0.03 315)` | `oklch(0.27 0.03 318)` |
| `ring` | `oklch(0.81 0.12 14)` | `oklch(0.72 0.12 14)` |
| `danger` | `oklch(0.57 0.2 23)` | `oklch(0.56 0.2 23)` |
| `dangerForeground` | `oklch(0.98 0.02 320)` | `oklch(0.97 0.01 315)` |
| `chart1` | `oklch(0.81 0.12 14)` | `oklch(0.72 0.12 14)` |
| `chart2` | `oklch(0.83 0.1 220)` | `oklch(0.72 0.10 220)` |
| `chart3` | `oklch(0.84 0.1 120)` | `oklch(0.74 0.10 120)` |
| `chart4` | `oklch(0.8 0.1 70)` | `oklch(0.72 0.10 70)` |
| `chart5` | `oklch(0.79 0.11 300)` | `oklch(0.70 0.11 300)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Baloo 2", "Nunito Sans", sans-serif` |
| Display face | `"Fredoka", "Baloo 2", sans-serif` |
| Mono face | `"JetBrains Mono", "Consolas", monospace` |
| Scale multipliers | body `1.04` · display `1.2` |
| Line height | tight `1.14` · normal `1.5` · relaxed `1.78` |
| Letter spacing | tight `-0.01em` · normal `0.005em` · wide `0.035em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `1.25rem` · control `9999px` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `inset 6px 6px 14px rgba(255, 255, 255, 0.65), inset -8px -8px 16px rgba(187, 153, 215, 0.32), 0 2px 6px -3px rgba(122, 93, 142, 0.24)` |
| Hard shadow | `4px 4px 0 rgba(122, 93, 142, 0.24)` |
| Glow | `0 0 0 rgba(0, 0, 0, 0)` |
| Surface blur | `0px` |
| Transparency | `1` |
| Grain | `0.02` |
| Ornaments | grain false · glow false · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `200ms` · normal `320ms` · slow `520ms` |
| Standard easing | `cubic-bezier(0.32, 0.72, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.16, 1.35, 0.3, 1)` |
| Physics | `spring-high-bounce` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
