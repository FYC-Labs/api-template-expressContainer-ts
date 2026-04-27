#!/usr/bin/env node
/**
 * Reads a Google/Firebase service account JSON file and prints a single-line
 * base64 encoding suitable for secrets and environment variables.
 *
 * Usage: node scripts/encode-service-account.js <path-to-service-account.json>
 */

const fs = require("fs");
const path = require("path");

const fileArg = process.argv[2];
if (!fileArg) {
  console.error("Usage: node scripts/encode-service-account.js <path-to-service-account.json>");
  process.exit(1);
}

const abs = path.resolve(process.cwd(), fileArg);
if (!fs.existsSync(abs)) {
  console.error(`File not found: ${abs}`);
  process.exit(1);
}

const raw = fs.readFileSync(abs, "utf8");
try {
  JSON.parse(raw);
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("Invalid JSON:", msg);
  process.exit(1);
}

process.stdout.write(`${Buffer.from(raw, "utf8").toString("base64")}\n`);
