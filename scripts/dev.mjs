import { spawn } from "node:child_process";
import { resolve } from "node:path";

const nodeMajor = Number(process.versions.node.split(".")[0]);

if (![22, 24].includes(nodeMajor)) {
  console.error(
    `\nThis project requires Node.js 22 or 24. Current version: ${process.version}\n` +
      "Run `nvm use` or place Homebrew node@22 first in PATH, then retry.\n",
  );
  process.exit(1);
}

const root = process.cwd();
const tinaBin = resolve(root, "node_modules/@tinacms/cli/bin/tinacms");
const astroBin = resolve(root, "node_modules/astro/bin/astro.mjs");
const host = "127.0.0.1";
const port = "4323";

const tina = spawn(process.execPath, [tinaBin, "dev"], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

const astro = spawn(
  process.execPath,
  [astroBin, "dev", "--host", host, "--port", port],
  {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  },
);

console.log("\nWIMA CARE local development");
console.log(`Site:  http://${host}:${port}/`);
console.log(`Admin: http://${host}:${port}/admin/index.html\n`);

let stopping = false;

const stop = (signal = "SIGTERM") => {
  if (stopping) return;
  stopping = true;
  tina.kill(signal);
  astro.kill(signal);
};

process.once("SIGINT", () => stop("SIGINT"));
process.once("SIGTERM", () => stop("SIGTERM"));

tina.once("exit", (code, signal) => {
  if (!stopping) {
    console.error(`TinaCMS stopped unexpectedly (${signal || code || 1}).`);
    stop();
    process.exitCode = code || 1;
  }
});

astro.once("exit", (code, signal) => {
  if (!stopping && code) {
    console.error(`Astro stopped unexpectedly (${signal || code}).`);
    stop();
    process.exitCode = code;
  }
});
