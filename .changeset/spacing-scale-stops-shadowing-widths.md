---
"@nikolayvalev/design-system": patch
---

Stop the spacing scale shadowing Tailwind's width utilities.

v3 exposes the spacing scale to Tailwind as `--spacing-2xs` … `--spacing-3xl`, and
Tailwind resolves `w-*`, `min-w-*`, `max-w-*` and `basis-*` against `--spacing-*`
before `--container-*`. In every Tailwind v4 consumer, `max-w-3xl` compiled to 4rem
instead of 48rem and `max-w-xl` to 2rem instead of 36rem, collapsing prose columns
to a word per line.

`global.css` now maps `--width-*`, `--min-width-*`, `--max-width-*` and
`--flex-basis-*` back to the container scale for the eight shared names, so those
utilities mean what they mean in stock Tailwind again. Named spacing utilities
(`p-md`, `gap-lg`, `size-sm`) are unchanged. Consumers that worked around the bug
with `max-w-(--container-3xl)` can keep it or revert to `max-w-3xl`; both now
compile to the same value.
