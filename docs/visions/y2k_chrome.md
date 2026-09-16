<!--
  GENERATED FILE — do not edit.
  Source: packages/design-system/src/vde-themes/y2k-chrome.theme.ts
  Regenerate: pnpm --filter @nikolayvalev/design-system build
-->

# Y2K_Chrome

> Reflective pop futurism with unapologetic energy.

**id** `y2k_chrome` · **family** Expressive & Statement · **archetype** The Glitch · **default mode** light

Y2K Chrome amplifies spectacle with metallic highlights, hyper-clean gradients, and playful saturation. Specular accents create immediate visual signatures that differentiate key actions and support campaign storytelling.

**Mood:** flashy, synthetic, nostalgic-future

**Best for:** Fashion and entertainment · Youth-centric products · High-energy campaigns

## Import

```ts
import '@nikolayvalev/design-system/styles/y2k_chrome.css';
import '@nikolayvalev/design-system/styles/fonts/y2k_chrome.css';
```

## Colour

Both modes are hand-tuned; neither is derived from the other. Every pair that
carries text is contrast-checked at WCAG AA by `pnpm validate`.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `oklch(0.9 0.01 250)` | `oklch(0.17 0.02 255)` |
| `foreground` | `oklch(0.2 0.02 250)` | `oklch(0.94 0.015 250)` |
| `surface` | `linear-gradient(115deg, rgba(255,255,255,0.92) 0%, rgba(225,230,238,0.96) 24%, rgba(189,198,212,0.95) 48%, rgba(240,243,248,0.97) 76%, rgba(180,190,205,0.93) 100%)` | `linear-gradient(115deg, rgba(40,44,54,0.96) 0%, rgba(28,32,42,0.98) 24%, rgba(20,22,30,0.97) 48%, rgba(34,38,50,0.98) 76%, rgba(24,28,38,0.95) 100%)` |
| `surfaceForeground` | `oklch(0.2 0.02 250)` | `oklch(0.94 0.015 250)` |
| `accent` | `oklch(0.75 0.24 336)` | `oklch(0.74 0.24 336)` |
| `accentForeground` | `oklch(0.18 0.03 255)` | `oklch(0.16 0.03 255)` |
| `secondary` | `oklch(0.79 0.18 210)` | `oklch(0.30 0.05 210)` |
| `secondaryForeground` | `oklch(0.18 0.03 255)` | `oklch(0.94 0.015 250)` |
| `muted` | `oklch(0.87 0.03 245)` | `oklch(0.26 0.03 250)` |
| `mutedForeground` | `oklch(0.44 0.04 250)` | `oklch(0.70 0.04 250)` |
| `border` | `oklch(0.55 0.04 250)` | `oklch(0.42 0.06 255)` |
| `input` | `oklch(0.92 0.02 245)` | `oklch(0.27 0.03 252)` |
| `ring` | `oklch(0.75 0.24 336)` | `oklch(0.76 0.24 336)` |
| `danger` | `oklch(0.54 0.24 25)` | `oklch(0.56 0.24 25)` |
| `dangerForeground` | `oklch(0.95 0.02 250)` | `oklch(0.97 0.01 250)` |
| `chart1` | `oklch(0.75 0.24 336)` | `oklch(0.74 0.24 336)` |
| `chart2` | `oklch(0.79 0.18 210)` | `oklch(0.76 0.18 210)` |
| `chart3` | `oklch(0.72 0.18 294)` | `oklch(0.72 0.18 294)` |
| `chart4` | `oklch(0.8 0.2 76)` | `oklch(0.78 0.20 76)` |
| `chart5` | `oklch(0.72 0.18 22)` | `oklch(0.72 0.18 22)` |

## Type

| Property | Value |
| --- | --- |
| Body face | `"Space Grotesk", "Trebuchet MS", sans-serif` |
| Display face | `"Orbitron", "Eurostile", "Press Start 2P", sans-serif` |
| Mono face | `"VT323", "JetBrains Mono", monospace` |
| Scale multipliers | body `1.02` · display `1.24` |
| Line height | tight `1.08` · normal `1.5` · relaxed `1.66` |
| Letter spacing | tight `-0.01em` · normal `0.01em` · wide `0.06em` |

Sizes are the core scale multiplied by the values above and floored, so this
vision's interactive text is never below 14px and its body copy never below 16px
however it tunes the multipliers.

## Shape and depth

| Property | Value |
| --- | --- |
| Radius | surface `0.7rem` · control `0.55rem` · pill `9999px` |
| Border weight | `1px` |
| Edge strategy | Seam — the hairline defines the edge; the ambient shadow is a seam, not a second edge. |
| Ambient shadow | `0 2px 6px -2px rgba(31, 39, 56, 0.26)` |
| Hard shadow | `2px 2px 0 rgba(31, 39, 56, 0.3)` |
| Glow | `0 0 32px rgba(255, 79, 206, 0.4), 0 0 26px rgba(94, 241, 255, 0.36)` |
| Surface blur | `4px` |
| Transparency | `0.92` |
| Grain | `0.05` |
| Ornaments | grain true · glow true · texture true |

## Motion

| Property | Value |
| --- | --- |
| Durations | fast `120ms` · normal `190ms` · slow `320ms` |
| Standard easing | `cubic-bezier(0.2, 0.75, 0.2, 1)` |
| Emphatic easing | `cubic-bezier(0.2, 1, 0.3, 1)` |
| Physics | `chrome-glitch` |

All ambient and looping motion stops under `prefers-reduced-motion: reduce`.
