## Summary

Describe the change in 2-4 sentences.

## Why

Describe the product or engineering reason.

## Architecture Impact

- [ ] Shared contract change (`design-system`, `auth`, `state`)
- [ ] App manifest change
- [ ] CI/CD workflow change
- [ ] Terraform/IaC change

## Verification

- [ ] `pnpm turbo run build`
- [ ] `pnpm turbo run typecheck`
- [ ] `pnpm turbo run lint`
- [ ] `node scripts/ci/dry-run-design-system-impact.mjs` (if design-system changed)
- [ ] `terraform -chdir=infra/terraform validate` (if infra changed)

## Risk

List operational, security, or compatibility risks.

## Rollback

Explain how to revert quickly if this fails in production.

