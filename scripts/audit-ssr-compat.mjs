import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "../WorkWay--FE/app");
const BLOCKERS = ["window.", "document.", "localStorage", "sessionStorage"];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return [full];
    }),
  );
  return files.flat();
}

function lineHits(content, token) {
  return content
    .split("\n")
    .map((line, i) => ({ line: i + 1, text: line }))
    .filter((row) => row.text.includes(token));
}

async function main() {
  const files = (await walk(ROOT)).filter((f) => /\.(ts|tsx|js|jsx)$/.test(f));
  let totalHits = 0;

  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    for (const token of BLOCKERS) {
      const hits = lineHits(content, token);
      for (const hit of hits) {
        totalHits += 1;
        console.log(`${file}:${hit.line} contains ${token}`);
      }
    }
  }

  if (totalHits === 0) {
    console.log("No obvious browser-only SSR blockers found.");
  } else {
    console.log(`Found ${totalHits} potential SSR blockers.`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

