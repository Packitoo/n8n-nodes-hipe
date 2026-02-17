// Extract per-tag OpenAPI subsets.
// - Input: OpenAPI 3.x JSON or YAML file
// - Args:
//     --in <path-to-openapi.{json|yaml|yml}>
//     --tags <tag1,tag2,...>
//     --out <output-dir> (default: openapi-extract)
// - Output: one JSON file per tag in the output directory.
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

// ---------------- CLI args ----------------
function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}

function usageAndExit(msg?: string): never {
  if (msg) console.error(`Error: ${msg}`);
  console.error(`\nUsage: npm run openapi:extract-tags -- --in <openapi-file> --tags <tag1,tag2> [--out <dir>]\n`);
  process.exit(1);
}

// ---------------- IO helpers ----------------
async function loadOpenApi(input: string): Promise<any> {
  const isUrl = /^https?:\/\//i.test(input);

  if (isUrl) {
    const res = await fetch(input);
    if (!res.ok) usageAndExit(`Failed to fetch URL: ${input} (status ${res.status})`);
    const raw = await res.text();
    // Try JSON first, then YAML
    try {
      return JSON.parse(raw);
    } catch {
      return YAML.parse(raw);
    }
  }

  if (!fs.existsSync(input)) usageAndExit(`Input file not found: ${input}`);
  const raw = fs.readFileSync(input, 'utf8');
  const ext = path.extname(input).toLowerCase();
  if (ext === '.json') return JSON.parse(raw);
  if (ext === '.yaml' || ext === '.yml') return YAML.parse(raw);
  // Try JSON first, then YAML
  try {
    return JSON.parse(raw);
  } catch {
    return YAML.parse(raw);
  }
}

function writeJson(filePath: string, data: any) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 100);
}

// ---------------- JSON Pointer helpers ----------------
function decodePointerSegment(seg: string): string {
  return seg.replace(/~1/g, '/').replace(/~0/g, '~');
}

function getByJsonPointer(obj: any, pointer: string): any {
  if (!pointer || pointer === '#') return obj;
  if (!pointer.startsWith('#/')) return undefined;
  const parts = pointer.slice(2).split('/').map(decodePointerSegment);
  let cur: any = obj;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
      cur = cur[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

// ---------------- Ref collection ----------------
function collectRefsDeep(node: any, out: Set<string>, seen = new Set<any>()) {
  if (!node || typeof node !== 'object') return;
  if (seen.has(node)) return;
  seen.add(node);

  if (typeof node.$ref === 'string') {
    out.add(node.$ref);
  }
  if (Array.isArray(node)) {
    for (const item of node) collectRefsDeep(item, out, seen);
    return;
  }
  for (const key of Object.keys(node)) {
    const val = (node as any)[key];
    if (val && typeof val === 'object') collectRefsDeep(val, out, seen);
  }
}

function isHttpMethod(key: string): boolean {
  return ['get','put','post','delete','patch','head','options','trace'].includes(key);
}

// Given full spec and a set of ref pointers, crawl recursively to include nested refs
function expandRefs(spec: any, initialRefs: Set<string>): Set<string> {
  const queue = [...initialRefs];
  const all = new Set<string>(initialRefs);

  while (queue.length) {
    const ref = queue.shift()!;
    const target = getByJsonPointer(spec, ref);
    if (!target) continue;
    const nested = new Set<string>();
    collectRefsDeep(target, nested);
    for (const n of nested) {
      if (!all.has(n)) {
        all.add(n);
        queue.push(n);
      }
    }
  }
  return all;
}

// Build components with only referenced items
function buildPrunedComponents(spec: any, allRefs: Set<string>) {
  const compRoot = spec.components || {};
  const result: any = {};
  const allowedSections = [
    'schemas', 'responses', 'parameters', 'examples', 'requestBodies',
    'headers', 'securitySchemes', 'links', 'callbacks', 'pathItems',
  ];

  for (const section of allowedSections) {
    if (!compRoot[section]) continue;
    for (const name of Object.keys(compRoot[section])) {
      const pointer = `#/components/${section}/${name}`;
      if (allRefs.has(pointer)) {
        if (!result[section]) result[section] = {};
        result[section][name] = compRoot[section][name];
      }
    }
  }
  return Object.keys(result).length ? result : undefined;
}

// Filter paths to only operations having the given tag; collect refs
function collectSecuritySchemeNames(security: any): Set<string> {
  const names = new Set<string>();
  const arr: any[] = Array.isArray(security) ? security : [];
  for (const obj of arr) {
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const key of Object.keys(obj)) names.add(key);
    }
  }
  return names;
}

// Filter paths to only operations having the given tag; collect refs and used security schemes
function filterPathsByTag(spec: any, tag: string, outRefs: Set<string>, outSecuritySchemes: Set<string>) {
  const prunedPaths: any = {};
  const paths = spec.paths || {};

  for (const route of Object.keys(paths)) {
    const pathItem = paths[route];
    const pathLevelParams = Array.isArray(pathItem?.parameters) ? pathItem.parameters : [];

    // Collect refs in path-level parameters that are relevant (we may include them if any op is included)
    const pathParamRefs = new Set<string>();
    collectRefsDeep(pathLevelParams, pathParamRefs);

    let includedAny = false;
    const newPathItem: any = {};

    for (const key of Object.keys(pathItem)) {
      if (!isHttpMethod(key)) continue;
      const op = pathItem[key];
      const tags: string[] = Array.isArray(op?.tags) ? op.tags : [];
      if (!tags.map(String).includes(tag)) continue;

      // Include operation
      newPathItem[key] = op;
      includedAny = true;

      // Collect refs from operation
      collectRefsDeep(op, outRefs);

      // Collect security scheme names from the operation
      for (const name of collectSecuritySchemeNames(op?.security)) {
        outSecuritySchemes.add(name);
      }
    }

    if (includedAny) {
      // If any operation is included, also include path-level parameters
      if (pathLevelParams.length) {
        newPathItem.parameters = pathLevelParams;
        for (const r of pathParamRefs) outRefs.add(r);
      }
      prunedPaths[route] = newPathItem;
    }
  }

  return prunedPaths;
}

function buildInfoForTag(originalInfo: any, tag: string) {
  const info = { ...originalInfo };
  if (typeof info?.title === 'string') {
    info.title = `${info.title} — ${tag}`;
  }
  return info;
}

function buildTagObject(spec: any, tag: string) {
  const allTags: any[] = Array.isArray(spec.tags) ? spec.tags : [];
  const found = allTags.find((t) => t?.name === tag);
  return found ? [found] : [{ name: tag }];
}

function isOpenApi3(spec: any): boolean {
  return typeof spec?.openapi === 'string' && spec.openapi.startsWith('3.');
}

async function main() {
  const args = parseArgs(process.argv);
  const inPath = String(args['in'] || '');
  const tagsArg = String(args['tags'] || '');
  const outDir = String(args['out'] || 'openapi-extract');

  if (!inPath) usageAndExit('Missing --in');
  if (!tagsArg) usageAndExit('Missing --tags');

  const tags = tagsArg.split(',').map((s) => s.trim()).filter(Boolean);
  if (!tags.length) usageAndExit('No tags provided');

  const spec = await loadOpenApi(inPath);
  if (!isOpenApi3(spec)) {
    console.warn('Warning: This tool primarily targets OpenAPI 3.x. Results with Swagger 2.0 may be incomplete.');
  }

  for (const tag of tags) {
    const opRefs = new Set<string>();
    const usedSchemes = collectSecuritySchemeNames(spec?.security);
    const prunedPaths = filterPathsByTag(spec, tag, opRefs, usedSchemes);

    // Expand refs recursively through components
    const allRefs = expandRefs(spec, opRefs);
    // Ensure used security schemes are included in components
    for (const scheme of usedSchemes) {
      allRefs.add(`#/components/securitySchemes/${scheme}`);
    }
    const components = buildPrunedComponents(spec, allRefs);

    const outSpec: any = {};
    if (spec.openapi) outSpec.openapi = spec.openapi;
    if (spec.swagger) outSpec.swagger = spec.swagger; // best-effort
    outSpec.info = buildInfoForTag(spec.info || { title: 'API', version: '1.0.0' }, tag);
    if (spec.servers) outSpec.servers = spec.servers;
    if (spec.externalDocs) outSpec.externalDocs = spec.externalDocs;
    outSpec.tags = buildTagObject(spec, tag);
    outSpec.paths = prunedPaths;
    if (spec.security) outSpec.security = spec.security;
    if (components) outSpec.components = components;

    const filename = `${slugify(tag) || 'tag'}.json`;
    const outPath = path.resolve(outDir, filename);
    writeJson(outPath, outSpec);
    console.log(`Wrote: ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
