#!/usr/bin/env node
// Post-build cleanup for Next.js 16 + Turbopack output.
// Renames files whose names contain "~" or ".." (which break some zip-based
// deployers that treat ".." as path traversal) and rewrites references to
// them in HTML/JS/CSS/JSON/TXT files.

import { readdirSync, statSync, renameSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const OUT = "out";
const PATTERNS = [
  { from: "..", to: "_." }, // zip extractors reject path-traversal-looking names
  { from: "~", to: "_" },   // some hosts choke on tildes
];
const TEXT_EXTS = new Set([".html", ".js", ".css", ".json", ".txt", ".webmanifest", ".map", ".xml", ".svg"]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function transformName(n) {
  let out = n;
  for (const { from, to } of PATTERNS) {
    out = out.split(from).join(to);
  }
  return out;
}

function rewriteName(n) {
  return transformName(n);
}

let mapping = new Map();
for (const p of walk(OUT)) {
  const b = basename(p);
  const nb = rewriteName(b);
  if (nb !== b) {
    mapping.set(b, nb);
    renameSync(p, join(dirname(p), nb));
  }
}
console.log(`postbuild: renamed ${mapping.size} files`);

if (mapping.size > 0) {
  let count = 0;
  for (const p of walk(OUT)) {
    const ext = p.slice(p.lastIndexOf("."));
    if (!TEXT_EXTS.has(ext)) continue;
    let content;
    try {
      content = readFileSync(p, "utf8");
    } catch {
      continue;
    }
    let changed = false;
    for (const [oldName, newName] of mapping) {
      if (content.includes(oldName)) {
        content = content.split(oldName).join(newName);
        changed = true;
      }
    }
    if (changed) {
      writeFileSync(p, content);
      count++;
    }
  }
  console.log(`postbuild: rewrote refs in ${count} files`);
}
