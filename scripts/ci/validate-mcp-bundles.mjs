/*
 * Validates what the hosted MCP server actually hands an agent.
 *
 * Agents are the primary distribution channel for this system: they call
 * `get_component_bundle(["Card"])` and commit the source they get back. That
 * bundle is assembled by walking relative imports, and the deploy step mirrors
 * only a subset of `src/` into the serverless function. When those two disagree,
 * the bundle ships with an import that does not resolve — and the only signal is
 * a `warnings` array nobody reads, so the agent commits code that will not build.
 *
 * That is exactly what happened: `vde-core` was never mirrored, `AestheticOrnaments`
 * imports it, and `Card` and `Layout` import `AestheticOrnaments`.
 *
 * This builds a mirror with the same directory shape the deploy uses, asks for
 * every component, section and page, and fails on any warning.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const srcDir = path.join(repoRoot, "packages/design-system/src");

/**
 * Keep in lockstep with the "Bundle design-system sources into MCP server" step
 * in .github/workflows/monorepo-deploy.yml. If you add a directory there, add it
 * here; if a bundle needs a directory that is not here, this script fails.
 */
const MIRRORED_DIRS = [
  "vde-core",
  "vde-themes",
  "components",
  "sections",
  "pages",
];

const mirror = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-bundle-check-"));
try {
  for (const dir of MIRRORED_DIRS) {
    const from = path.join(srcDir, dir);
    if (!fs.existsSync(from)) {
      console.error(
        `x Mirror list names "${dir}", which does not exist in src/.`,
      );
      process.exit(1);
    }
    fs.cpSync(from, path.join(mirror, dir), { recursive: true });
  }

  process.env.DESIGN_SYSTEM_SRC_DIR = mirror;
  const tools = await import(
    url.pathToFileURL(
      path.join(repoRoot, "packages/mcp-server/src/tools/designSystemTools.ts"),
    ).href
  );

  const kinds = [
    {
      kind: "component",
      list: tools.getComponentList,
      bundle: tools.getComponentInstallBundle,
    },
    {
      kind: "section",
      list: tools.getSectionList,
      bundle: tools.getSectionInstallBundle,
    },
    {
      kind: "page",
      list: tools.getPageList,
      bundle: tools.getPageInstallBundle,
    },
  ];

  const failures = [];
  let checked = 0;

  for (const { kind, list, bundle } of kinds) {
    if (typeof list !== "function" || typeof bundle !== "function") {
      console.error(`x No list/bundle tool exported for "${kind}".`);
      process.exit(1);
    }
    const names = (await list()).map((entry) => entry.name);
    if (names.length === 0) {
      failures.push(`${kind}: the mirror exposes none at all`);
      continue;
    }

    // One at a time, so a failure names the artifact that caused it.
    for (const name of names) {
      const result = await bundle([name]);
      checked += 1;
      for (const warning of result.warnings ?? []) {
        failures.push(`${kind} "${name}": ${warning}`);
      }
      if ((result.files ?? []).length === 0) {
        failures.push(`${kind} "${name}": bundle is empty`);
      }
    }

    // And once together, which is how an agent usually asks.
    const combined = await bundle(names);
    for (const warning of combined.warnings ?? []) {
      failures.push(`${kind} (all ${names.length}): ${warning}`);
    }
  }

  if (failures.length > 0) {
    console.error(
      `\nMCP install bundles are not self-contained (${failures.length}):`,
    );
    for (const failure of failures) console.error(`  x ${failure}`);
    console.error(
      "\nEvery bundle must carry all of its own relative imports. Either add the missing\n" +
        "directory to MIRRORED_DIRS here AND to the deploy step in monorepo-deploy.yml, or\n" +
        "remove the import that reaches outside the mirror.",
    );
    process.exit(1);
  }

  console.log(
    `MCP install bundles OK — ${checked} artifacts, every relative import resolved.`,
  );
} finally {
  fs.rmSync(mirror, { recursive: true, force: true });
}
