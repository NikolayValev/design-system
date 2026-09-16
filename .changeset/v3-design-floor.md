---
"@nikolayvalev/design-system": major
---

Give the system a floor, real scales, and fonts that actually load.

The architecture was already right — `vde-core` owns the contract, `vde-themes` owns the
values — so this changes values and closes machinery holes rather than restructuring anything.

**Foundations.** A real seven-step type scale, resolved from each theme's multipliers and
clamped so no theme can push interactive text below 14px or body copy below 16px. The 8-point
spacing scale `ARCHITECTURE.md` documented but that never existed in code. A `--vde-measure`
token for prose. `boundaryLogic.radius` split into `surface` / `control` / `pill`, because one
radius for every element is why `clay_soft` rendered cards as capsules. Self-hosted fonts,
emitted per vision — all 12 visions named ~19 families and loaded none of them.
`prefers-reduced-motion` honoured, which nothing did.

**An enforced floor.** `validate-design-floors.mjs` checks contrast, line-height, tracking,
radius, edge redundancy and motion across every vision in both modes, and runs in
`pnpm validate`; it found 17 WCAG AA failures on button fills, all fixed by darkening the fill.
axe now asserts per story in the Storybook test runner. A new `no-raw-design-values` ESLint rule
covers raw colours, off-scale sizes and `text-xs`.

**Character kept.** Expressive visions keep their neon, chrome, mesh and spring. What went was
the unconsidered default: purple-to-cyan `rgba` literals hardcoded as fallbacks inside four
components, firing in every vision regardless of palette.

**Components.** Section eyebrows are opt-in and no longer ship placeholder marketing copy.
`FeatureTile`'s icon is inline with its heading. `NavigationOrb` gained focus styles, the 14px
floor, `inert`, Escape and focus restoration. Charts require a `title`.

Adds `quiet_workshop` as a thirteenth vision. Deprecates and freezes `src/intent/`.

See `MIGRATION_V3.md`.
