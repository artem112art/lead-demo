import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", ".codebase-memory", "node_modules", "output"]);
const checkedExtensions = new Set([".html", ".css", ".md"]);
const expectedPages = [
  "index.html",
  "demos/auto-service/index.html",
  "demos/dental-clinic/index.html",
  "demos/sema-novorossiysk/index.html",
  "demos/n8n-lead-automation/index.html",
];
const hosts = [
  new URL("https://lead-demo.pages.dev/"),
  new URL("https://artem112art.github.io/lead-demo/"),
];

const errors = [];
let sourceCount = 0;
let referenceCount = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }

  return files;
}

function referencesFor(source, extension) {
  const references = [];
  const patterns = extension === ".html"
    ? [/(?:href|src)\s*=\s*(["'])(.*?)\1/gi]
    : extension === ".css"
      ? [/url\(\s*(?:(["'])(.*?)\1|([^)'"\s][^)]*))\s*\)/gi]
      : [/\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      references.push(extension === ".css" ? (match[2] ?? match[3]) : (match[2] ?? match[1]));
    }
  }

  return references;
}

function pageUrlFor(relativePath, host) {
  const posixPath = relativePath.split(path.sep).join("/");
  const route = posixPath.endsWith("/index.html")
    ? posixPath.slice(0, -"index.html".length)
    : posixPath === "index.html" ? "" : posixPath;
  return new URL(route, host);
}

async function targetExists(target) {
  try {
    const info = await stat(target);
    if (info.isDirectory()) return stat(path.join(target, "index.html")).then(() => true, () => false);
    return info.isFile();
  } catch {
    return false;
  }
}

for (const expectedPage of expectedPages) {
  if (!await targetExists(path.join(root, expectedPage))) {
    errors.push(`Missing expected page: ${expectedPage}`);
  }
}

for (const absoluteSource of await walk(root)) {
  const extension = path.extname(absoluteSource).toLowerCase();
  if (!checkedExtensions.has(extension)) continue;

  sourceCount += 1;
  const relativeSource = path.relative(root, absoluteSource);
  const source = await readFile(absoluteSource, "utf8");
  const references = referencesFor(source, extension);

  for (const rawReference of references) {
    const reference = rawReference.trim();
    if (!reference) continue;

    if (reference.startsWith("#")) {
      if (extension === ".html" && reference.length > 1) {
        const id = decodeURIComponent(reference.slice(1)).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (!new RegExp(`\\bid=["']${id}["']`).test(source)) {
          errors.push(`${relativeSource}: missing local anchor ${reference}`);
        }
      }
      continue;
    }

    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
    referenceCount += 1;

    if (reference.startsWith("/")) {
      errors.push(`${relativeSource}: root-absolute path is not subpath-safe: ${reference}`);
      continue;
    }

    const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    const absoluteTarget = path.resolve(path.dirname(absoluteSource), cleanReference || ".");
    const relativeTarget = path.relative(root, absoluteTarget);

    if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
      errors.push(`${relativeSource}: path escapes repository root: ${reference}`);
      continue;
    }

    if (!await targetExists(absoluteTarget)) {
      errors.push(`${relativeSource}: missing target: ${reference}`);
    }

    for (const host of hosts) {
      const sourceUrl = pageUrlFor(relativeSource, host);
      const resolvedUrl = new URL(reference, sourceUrl);
      if (host.pathname !== "/" && !resolvedUrl.pathname.startsWith(host.pathname)) {
        errors.push(`${relativeSource}: ${reference} escapes ${host.pathname} on ${host.host}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`Static path validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Static path validation passed: ${sourceCount} source files, ${referenceCount} local references, ${expectedPages.length} expected pages.`);
  console.log("Validated for https://lead-demo.pages.dev/ and https://artem112art.github.io/lead-demo/.");
}
