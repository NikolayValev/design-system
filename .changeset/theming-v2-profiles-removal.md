---
"@nikolayvalev/design-system": major
---

Remove the legacy token-profile system. `createTheme`, `applyTheme`,
`createTailwindPreset`, `publicProfile`/`dashboardProfile`/`experimentalProfile`,
the profile token types, the `./tailwind` and `./tokens` entry points, and the
`public/dashboard/experimental.css` files are gone. The `@nikolayvalev/design-tokens`
package is discontinued. Use `VisionProvider` + the vision themes; import per-vision
CSS from `@nikolayvalev/design-system/styles/<visionId>.css`.
