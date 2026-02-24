# Error Envelope Contract

Platform services should return errors in this envelope:

```json
{
  "error": {
    "code": "auth.invalid_credentials",
    "message": "Invalid email or password.",
    "request_id": "req_01H..."
  }
}
```

Schema source:

- `contracts/error-envelope.schema.json`

Validation helper:

```bash
node scripts/contracts/validate-error-envelope.mjs --file ./error-response.json
```

Expected required fields:

- `error.code` (string)
- `error.message` (string)
- `error.request_id` (string)

Linked-repo sample check (from `.github/dependent-apps.json`):

```bash
pnpm contracts:linked-error-envelope:check
```

## CI Integration Snippet (Reference)

Backend/frontend repos can add a validation step for sample error fixtures:

```yaml
- name: Validate error envelope fixtures
  run: node scripts/contracts/validate-error-envelope.mjs --file contracts/examples/error.sample.json
```

This repository keeps a baseline fixture at:

- `contracts/examples/error-envelope.sample.json`
