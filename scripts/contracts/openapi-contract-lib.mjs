import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const stableStringify = value => {
  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item)).join(',')}]`;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`).join(',')}}`;
  }

  return JSON.stringify(value);
};

export const normalizeOpenApiDocument = (raw, sourceLabel) => {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON from ${sourceLabel}: ${message}`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`OpenAPI source ${sourceLabel} must be a JSON object.`);
  }

  if (typeof parsed.openapi !== 'string' || parsed.openapi.length === 0) {
    throw new Error(`OpenAPI source ${sourceLabel} is missing required "openapi" field.`);
  }

  if (typeof parsed.info !== 'object' || parsed.info === null) {
    throw new Error(`OpenAPI source ${sourceLabel} is missing required "info" object.`);
  }

  if (typeof parsed.paths !== 'object' || parsed.paths === null) {
    throw new Error(`OpenAPI source ${sourceLabel} is missing required "paths" object.`);
  }

  return `${stableStringify(parsed)}\n`;
};

const parseHeaderValues = values => {
  const headers = {};

  for (const rawHeader of values) {
    const separator = rawHeader.indexOf(':');
    if (separator <= 0) {
      throw new Error(`Invalid header value "${rawHeader}". Expected "Key: Value".`);
    }

    const name = rawHeader.slice(0, separator).trim();
    const value = rawHeader.slice(separator + 1).trim();
    if (name.length === 0 || value.length === 0) {
      throw new Error(`Invalid header value "${rawHeader}". Expected "Key: Value".`);
    }
    headers[name] = value;
  }

  return headers;
};

const resolvePath = input => (path.isAbsolute(input) ? input : path.resolve(process.cwd(), input));

const readSource = async ({ sourceUrl, sourcePath, headerValues }) => {
  if (sourceUrl) {
    const headers = parseHeaderValues(headerValues ?? []);
    const response = await fetch(sourceUrl, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${sourceUrl}: HTTP ${response.status}`);
    }

    return {
      sourceLabel: sourceUrl,
      raw: await response.text(),
    };
  }

  const absoluteSourcePath = resolvePath(sourcePath);
  if (!existsSync(absoluteSourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }

  return {
    sourceLabel: absoluteSourcePath,
    raw: readFileSync(absoluteSourcePath, 'utf8'),
  };
};

export const syncOpenApiContract = async ({
  sourceUrl,
  sourcePath,
  outPath,
  checkOnly = false,
  headerValues = [],
}) => {
  if (!outPath || (!sourceUrl && !sourcePath) || (sourceUrl && sourcePath)) {
    throw new Error('Must provide exactly one source (`sourceUrl` or `sourcePath`) and an output path.');
  }

  const absoluteOutPath = resolvePath(outPath);
  const source = await readSource({ sourceUrl, sourcePath, headerValues });
  const normalizedSource = normalizeOpenApiDocument(source.raw, source.sourceLabel);

  if (checkOnly) {
    if (!existsSync(absoluteOutPath)) {
      return { status: 'missing', outPath: absoluteOutPath };
    }

    const normalizedCurrent = normalizeOpenApiDocument(readFileSync(absoluteOutPath, 'utf8'), absoluteOutPath);
    if (normalizedCurrent !== normalizedSource) {
      return { status: 'drift', outPath: absoluteOutPath };
    }

    return { status: 'in_sync', outPath: absoluteOutPath };
  }

  mkdirSync(path.dirname(absoluteOutPath), { recursive: true });
  writeFileSync(absoluteOutPath, normalizedSource, 'utf8');
  return { status: 'updated', outPath: absoluteOutPath };
};
