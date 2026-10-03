<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/immersive.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Immersive

> Cinematic depth that shapes attention with light and motion.

**id** `immersive` · **family** Atmospheric & Luminous · **archetype** Atmospheric Glow · **default mode** dark

Immersive treats the page as a stage, using layered backgrounds, glow, and blur to create spatial orientation. Longer eased motion supports cinematic pacing without harsh separators.

**Mood:** atmospheric, fluid, high-fidelity

**Best for:** Media and entertainment · Immersive onboarding · Premium storytelling canvases

## Import

```ts
import '@nikolayvalev/design-system/styles/immersive.css';
import '@nikolayvalev/design-system/styles/fonts/immersive.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.97 0.015 258)` | `oklch(0.21 0.04 260)` |
| `foreground` | `oklch(0.22 0.04 260)` | `oklch(0.95 0.02 250)` |
| `surface` | `oklch(0.99 0.01 255)` | `oklch(0.26 0.05 262)` |
| `surfaceForeground` | `oklch(0.22 0.04 260)` | `oklch(0.95 0.02 250)` |
| `accent` | `oklch(0.56 0.23 290)` | `oklch(0.74 0.23 290)` |
| `accentForeground` | `oklch(0.98 0.01 255)` | `oklch(0.18 0.04 260)` |
| `secondary` | `oklch(0.90 0.03 258)` | `oklch(0.37 0.07 252)` |
| `secondaryForeground` | `oklch(0.24 0.04 260)` | `oklch(0.94 0.02 250)` |
| `muted` | `oklch(0.94 0.02 258)` | `oklch(0.29 0.04 260)` |
| `mutedForeground` | `oklch(0.44 0.04 260)` | `oklch(0.8 0.03 250)` |
| `border` | `oklch(0.84 0.03 260)` | `oklch(0.41 0.07 265)` |
| `input` | `oklch(0.96 0.015 258)` | `oklch(0.31 0.05 260)` |
| `ring` | `oklch(0.58 0.20 288)` | `oklch(0.77 0.2 288)` |
| `danger` | `oklch(0.55 0.24 25)` | `oklch(0.67 0.24 25)` |
| `dangerForeground` | `oklch(0.98 0.01 255)` | `oklch(0.18 0.04 260)` |
| `chart1` | `oklch(0.58 0.23 290)` | `oklch(0.74 0.23 290)` |
| `chart2` | `oklch(0.58 0.20 202)` | `oklch(0.7 0.2 202)` |
| `chart3` | `oklch(0.60 0.20 138)` | `oklch(0.75 0.2 138)` |
| `chart4` | `oklch(0.64 0.21 70)` | `oklch(0.8 0.21 70)` |
| `chart5` | `oklch(0.58 0.20 18)` | `oklch(0.7 0.2 18)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Manrope", "Inter", sans-serif` |
| Display face | `"Sora", "Manrope", sans-serif` |
| Mono face | `"IBM Plex Mono", "Consolas", monospace` |
| Scale multipliers | body `1` · display `1.12` |
| Line height | tight `1.18` · normal `1.5` · relaxed `1.72` |
| Letter spacing | tight `-0.015em` · normal `0em` · wide `0.02em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.9rem` · control `0.7rem` · pill `9999px` |
| Border weight | `0px` |
| Edge strategy | Float — the shadow defines the edge; there is no hairline. |
| Ambient shadow | `0 16px 40px -18px rgba(0, 0, 0, 0.55)` |
| Hard shadow | `0 0 0 rgba(0, 0, 0, 0)` |
| Glow | `0 0 32px rgba(157, 95, 255, 0.34)` |
| Surface blur | `14px` |
| Transparency | `0.82` |
| Grain | `0.04` |
| Ornaments | grain true · glow true · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `180ms` · normal `260ms` · slow `420ms` |
| Standard easing | `cubic-bezier(0.2, 0.7, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Physics | `float-ease` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
