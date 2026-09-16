# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — an npm package (`@nikolayvalev/design-system`), a hosted MCP endpoint, a Storybook, and a public portal at `designsystem.nikolayvalev.com`.

## Users

Three audiences, and the unusual one is first because it drives the most design decisions:

- **AI coding agents.** Claude Code, Cursor, Windsurf and Copilot reach this system through the hosted MCP server (`docs/MCP_INTEGRATION.md`) and install component *source* into a consumer repo, shadcn-style, rather than importing a runtime dependency. An agent cannot see a screenshot or infer taste from a Storybook. It reads `DESIGN.md`, `CONTRIBUTION_GUIDE.md` and the token names, and it will faithfully reproduce whatever those files imply — including the mistakes. This is why the documented record is a product surface here and not an afterthought.

- **Nikolay's own applications.** `PersonalRouter` is the live external consumer. `second-brain-ui`, `mandate-zero` and `quitting-smoking-tracker` are named as linked repos in `.github/dependent-apps.json`. They do not want to look identical to each other; they want to stop re-deriving a token layer each time. The failure this system exists to prevent is documented in `Shared/03_Projects/PersonalWebsite/postmortem_design_system_token_drift.md`: tokens overridden locally, no enforcement in CI, products drifting apart while nominally sharing a system.

- **Engineers and recruiters evaluating the work.** The portal ships explicit `/engineers` and `/recruiters` routes (`docs/PUBLIC_PORTAL.md`). For this audience the system is itself the artifact under review — a visitor is judging whether the person who built it has taste and whether the engineering underneath would survive a code review. A design system that looks like an unmodified template argues against its author.

## Product Purpose

**Shared vibe, not identical appearance.**

The system provides infrastructure, not a house style. Projects built on it should feel related without being forced into one look, and should be able to diverge visually without fighting the system.

Concretely, that means the core is deliberately identity-free and the identity lives in named, swappable visions — 13 of them, each with a hand-tuned light *and* dark palette. `vde-core/` owns the contract and a single CSS emitter; `vde-themes/` owns the values. A consumer imports exactly one vision's CSS and gets a complete, coherent surface with no local override block.

The corollary matters as much as the rule: **because the core carries no identity, it has to carry a floor.** A system that permits any aesthetic still owes every consumer legible type, sufficient contrast, reachable focus, and motion that can be turned off. Range is the feature; the floor is what makes range safe.

## Register

Infrastructure, not a product surface. The voice in documentation is precise and declarative — it states what the rule is and why it exists, and it prefers naming a specific failure mode to offering encouragement. `CONTRIBUTING.md`'s "**ANY visual change to existing components is breaking**" is the register: unhedged, consequential, and followed by the reasoning.

Themes are allowed a voice of their own. A vision's `tagline`, `summary` and `mood` are the one place in the repo where evocative language is correct, because they are describing a visual character rather than a contract.

Avoid: marketing superlatives ("supercharge", "world-class", "blazing-fast"), forced-contrast constructions ("Not a library. A system."), and placeholder copy shipped as a component default. Section eyebrows reading "Launch faster" and "Capabilities" have been generic marketing claims sitting in the library's own templates — they are the exact failure this section exists to name.

## Accessibility & Inclusion

These hold in every vision, without exception, and are enforced rather than recommended:

- **Contrast** meets WCAG AA — 4.5:1 for body text, 3:1 for large text — verified per palette in both modes by a checker in `pnpm validate`, not by eye.
- **Body line-height** starts at 1.5×. Display type may be tighter; body may not.
- **Interactive text** is never below 14px, in any vision, however small the theme's character wants to be.
- **Every control has a visible `focus-visible` ring.** Keyboard users must be able to see where they are, including inside overlays and disclosure menus.
- **Motion is optional.** Every ambient or looping animation is disabled under `prefers-reduced-motion: reduce`. No vision may express itself through motion a user cannot stop.
- **Graphics carry accessible names.** Charts and decorative layers are either labelled or explicitly `aria-hidden` — never an unnamed `role="img"`.
- **Expressive themes are held to the same floor as quiet ones.** Neon, chrome and mesh are legitimate character; they are not a licence to drop below the line.
