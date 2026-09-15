#!/usr/bin/env node

// Fails the job when the Vercel deployment secrets for a matrix app are absent.
//
// This exists because the previous inline guard only emitted `::warning::`,
// which does not fail a step. Every Monorepo Deploy run since the workflow was
// introduced reported success while silently skipping the deploy, leaving
// designsystem.nikolayvalev.com serving DEPLOYMENT_NOT_FOUND.

const args = process.argv.slice(2);

const readFlag = name => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return undefined;
  }
  return args[index + 1];
};

const appId = readFlag('app');
const vercelProject = readFlag('vercel-project');
const projectIdSecret = readFlag('project-id-secret');

const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

if (!isNonEmptyString(appId) || !isNonEmptyString(projectIdSecret)) {
  console.error('::error::Usage: validate-deploy-secrets.mjs --app <id> --project-id-secret <NAME> [--vercel-project <name>]');
  process.exit(1);
}

// The workflow passes the resolved secret values through the environment so the
// secret names stay out of the process argument list.
const required = [
  ['VERCEL_TOKEN', process.env.VERCEL_TOKEN],
  ['VERCEL_ORG_ID', process.env.VERCEL_ORG_ID],
  [projectIdSecret, process.env.VERCEL_PROJECT_ID],
];

const missing = required.filter(([, value]) => !isNonEmptyString(value)).map(([name]) => name);

// A value pasted into the GitHub secrets UI with a stray leading or trailing
// space is accepted verbatim. Actions masks only the registered secret text, so
// the padding survives into the environment and the Vercel CLI fails much later
// with a misleading `Project not found ({"VERCEL_ORG_ID":" ***"})` -- note the
// space inside the quotes. Catch it here, where the message can be specific.
const padded = required
  .filter(([, value]) => typeof value === 'string' && value.trim().length > 0 && value !== value.trim())
  .map(([name]) => name);

const target = isNonEmptyString(vercelProject)
  ? `${appId} (Vercel project "${vercelProject}")`
  : appId;

if (missing.length > 0) {
  console.error(
    `::error::Cannot deploy ${target}: missing repository secrets: ${missing.join(', ')}.`,
  );
  console.error(
    '::error::Add them under Settings -> Secrets and variables -> Actions. See docs/PUBLIC_PORTAL.md for the expected values.',
  );
  process.exit(1);
}

if (padded.length > 0) {
  console.error(
    `::error::Cannot deploy ${target}: these secrets have leading or trailing whitespace: ${padded.join(', ')}.`,
  );
  console.error(
    '::error::Re-enter each one with no surrounding spaces or newline. The value is used verbatim, so the padding reaches the Vercel CLI.',
  );
  process.exit(1);
}

console.log(`Validated Vercel deployment secrets for ${target}`);
