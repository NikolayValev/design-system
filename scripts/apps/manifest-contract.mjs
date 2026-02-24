const REQUIRED_CONTRACTS = Object.freeze({
  designSystem: '@nikolayvalev/design-system',
  auth: '@repo/auth',
  state: '@repo/state',
});

const ALLOWED_TOPOLOGIES = new Set(['monorepo', 'polyrepo']);

const asRecord = value => (value !== null && typeof value === 'object' && !Array.isArray(value) ? value : null);

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

const isHttpUrl = value => {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export { REQUIRED_CONTRACTS };

export const validateManifest = (manifest, options = {}) => {
  const { expectedId, sourceLabel = 'app.manifest.json' } = options;
  const errors = [];
  const warnings = [];

  const root = asRecord(manifest);
  if (!root) {
    errors.push(`${sourceLabel}: manifest root must be a JSON object.`);
    return { errors, warnings };
  }

  if (root.manifestVersion !== 2) {
    errors.push(`${sourceLabel}: manifestVersion must be 2.`);
  }

  if (!isNonEmptyString(root.id)) {
    errors.push(`${sourceLabel}: id must be a non-empty string.`);
  } else if (expectedId && root.id !== expectedId) {
    errors.push(`${sourceLabel}: id mismatch. Expected "${expectedId}", got "${root.id}".`);
  }

  if (!isNonEmptyString(root.displayName)) {
    errors.push(`${sourceLabel}: displayName must be a non-empty string.`);
  }

  if (!isNonEmptyString(root.domain)) {
    errors.push(`${sourceLabel}: domain must be a non-empty string.`);
  }

  if (!isNonEmptyString(root.topology) || !ALLOWED_TOPOLOGIES.has(root.topology)) {
    errors.push(`${sourceLabel}: topology must be one of "monorepo" or "polyrepo".`);
  }

  const frontend = asRecord(root.frontend);
  if (!frontend) {
    errors.push(`${sourceLabel}: frontend must be an object.`);
  } else {
    if (frontend.framework !== 'nextjs') {
      errors.push(`${sourceLabel}: frontend.framework must be "nextjs".`);
    }

    if (!isNonEmptyString(frontend.path)) {
      errors.push(`${sourceLabel}: frontend.path must be a non-empty string.`);
    }

    if (root.topology === 'polyrepo' && !isHttpUrl(frontend.repository)) {
      errors.push(`${sourceLabel}: frontend.repository must be a valid http(s) URL for polyrepo manifests.`);
    }
  }

  const backend = asRecord(root.backend);
  if (!backend) {
    errors.push(`${sourceLabel}: backend must be an object.`);
  } else {
    if (backend.framework !== 'fastapi') {
      errors.push(`${sourceLabel}: backend.framework must be "fastapi".`);
    }

    if (!isNonEmptyString(backend.serviceName)) {
      errors.push(`${sourceLabel}: backend.serviceName must be a non-empty string.`);
    }

    if (root.topology === 'polyrepo' && !isHttpUrl(backend.repository)) {
      errors.push(`${sourceLabel}: backend.repository must be a valid http(s) URL for polyrepo manifests.`);
    }
  }

  const contracts = asRecord(root.contracts);
  if (!contracts) {
    errors.push(`${sourceLabel}: contracts must be an object.`);
  } else {
    for (const [name, expectedValue] of Object.entries(REQUIRED_CONTRACTS)) {
      if (contracts[name] !== expectedValue) {
        errors.push(`${sourceLabel}: contracts.${name} must be "${expectedValue}".`);
      }
    }

    if (root.topology === 'polyrepo' && !isNonEmptyString(contracts.openapi)) {
      errors.push(`${sourceLabel}: contracts.openapi must be set for polyrepo manifests.`);
    }
  }

  if (!Array.isArray(root.environments) || root.environments.length === 0) {
    errors.push(`${sourceLabel}: environments must be a non-empty array.`);
  } else {
    const names = new Set();
    for (const environment of root.environments) {
      if (!isNonEmptyString(environment)) {
        errors.push(`${sourceLabel}: environments entries must be non-empty strings.`);
        continue;
      }
      names.add(environment);
    }

    if (!names.has('preview') || !names.has('production')) {
      errors.push(`${sourceLabel}: environments must include "preview" and "production".`);
    }
  }

  const owners = asRecord(root.owners);
  if (owners) {
    if (!isNonEmptyString(owners.team)) {
      warnings.push(`${sourceLabel}: owners.team is recommended for ownership routing.`);
    }
    if (!isNonEmptyString(owners.contact)) {
      warnings.push(`${sourceLabel}: owners.contact is recommended for escalation routing.`);
    }
  } else {
    warnings.push(`${sourceLabel}: owners metadata is recommended in manifest v2.`);
  }

  return { errors, warnings };
};
