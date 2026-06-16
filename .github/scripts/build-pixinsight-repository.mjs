import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const distDir = join(root, "dist");
const packageRoot = join(root, ".pixinsight-package");
const scriptSource = join(root, "NoctuaMark.js");
const scriptTargetDir = join(packageRoot, "src", "scripts", "NoctuaMark");
const scriptTarget = join(scriptTargetDir, "NoctuaMark.js");

const repositoryDescription =
  "NoctuaMark PixInsight script updates by Tarun Pulikanti.";
const pixInsightVersionRange =
  process.env.PIXINSIGHT_VERSION_RANGE || "1.8.0:1.9.9";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        LC_ALL: "C",
        LC_CTYPE: "C",
        LANG: "C",
      },
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

function resolveVersion() {
  const explicitVersion = process.env.VERSION || process.argv[2];
  const refName = process.env.GITHUB_REF_NAME;
  const raw = explicitVersion || refName;

  if (!raw) {
    fail("No version supplied. Set VERSION or run from a semver tag.");
  }

  const version = raw.replace(/^v/, "");
  if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) {
    fail(`Version '${raw}' is not a valid semver release.`);
  }

  return version;
}

function releaseDate() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate()),
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds()),
  ].join("");
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function sha1(filePath) {
  const contents = await readFile(filePath);
  return createHash("sha1").update(contents).digest("hex");
}

function renderXri({ fileName, digest, date, version }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xri version="1.0">
  <description>
    <p>${xmlEscape(repositoryDescription)}</p>
  </description>
  <platform os="all" arch="noarch" version="${pixInsightVersionRange}">
    <package fileName="${xmlEscape(fileName)}"
             sha1="${digest}"
             type="script"
             releaseDate="${date}">
      <title>NoctuaMark ${xmlEscape(version)}</title>
      <description>
        <p>NoctuaMark ${xmlEscape(version)} installs the NoctuaMark PixInsight script under src/scripts/NoctuaMark.</p>
      </description>
    </package>
  </platform>
</xri>
`;
}

async function main() {
  if (!existsSync(scriptSource)) {
    fail(`Missing script source: ${scriptSource}`);
  }

  const version = resolveVersion();
  const archiveName = `NoctuaMark-${version}.tar.gz`;
  const archivePath = join(distDir, archiveName);

  await rm(distDir, { recursive: true, force: true });
  await rm(packageRoot, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
  await mkdir(scriptTargetDir, { recursive: true });

  const source = await readFile(scriptSource);
  await writeFile(scriptTarget, source);

  await run("tar", ["-czf", archivePath, "-C", packageRoot, "src"]);

  const digest = await sha1(archivePath);
  const xri = renderXri({
    fileName: basename(archivePath),
    digest,
    date: releaseDate(),
    version,
  });

  await writeFile(join(distDir, "updates.xri"), xri);
  await writeFile(
    join(distDir, "SHA1SUMS"),
    `${digest}  ${basename(archivePath)}\n`,
  );

  console.log(`Built ${archiveName}`);
  console.log(`SHA1 ${digest}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
