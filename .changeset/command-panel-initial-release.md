---
"@nikolayvalev/command-panel": minor
---

Initial release of `@nikolayvalev/command-panel` — a portable, constrained generative-UI command-panel engine.

An LLM (Claude via the Vercel AI SDK) proposes widgets as JSX restricted to an allow-listed component vocabulary; every proposal is validated by an AST allow-list and rendered in a sandbox where `useMetric` is the only data channel. The package ships:

- the two registries — a component vocabulary (design-system primitives + chart primitives by default, host-extendable) and a read-only data registry;
- the `propose_widget` tool + a streaming generation handler, behind a `/server` entry so the AI SDK never reaches client bundles;
- the safe-render sandbox (validate → transpile → evaluate against a frozen scope → error boundary);
- the `CommandPanel` UI — chat with inline live widget previews and a `localStorage`-persisted pinned dashboard;
- a web-standard route-handler factory (drop into a Next.js route or any web server) plus a client `useMetric` transport.

Consumes `@nikolayvalev/design-system` as the source-of-truth component vocabulary (peer dependency).
