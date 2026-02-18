# ADR-0001: Core Platform Contracts

## Status

Accepted

## Context

The monorepo contains multiple app surfaces that must move quickly without diverging architecture.
Historically, auth and state logic drift across products, and UI systems fork under schedule pressure.

## Decision

Adopt three mandatory shared contracts:

- `@nikolayvalev/design-system` for UI, theme, and token governance
- `@repo/auth` for authentication/session contract
- `@repo/state` for state factory and adapter consistency

Require each app to declare these contracts in `app.manifest.json` and enforce via CI dry-run checks.

## Consequences

### Positive

- Faster onboarding and less repo-specific reinvention.
- Lower risk when changing shared capabilities.
- Clear architecture signal for recruiters, collaborators, and clients.

### Negative

- App teams must coordinate version changes to shared packages.
- Additional CI checks can slow merge time slightly.

## Follow-Up

- Add contract compatibility tests for API schema drift.
- Add visual regression checks per design-system release.

