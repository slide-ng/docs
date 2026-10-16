// Checks the built site: every internal link, image, script and iframe in the HTML must point at a file or a page.
//
//   node scripts/check-dist.mjs [dist/analog/public]
//
// The build already fails on a broken heading link in markdown (the link guard). This looks at the finished HTML,
// so it also covers the pages written in TypeScript, the embedded demos and the images. External links are not fetched.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(process.argv[2] ?? join(root, 'dist', 'analog', 'public'));
if (!existsSync(dist)) {
  console.error(`No build at ${dist}. Run "pnpm run build" first.`);
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      // The demos are separate apps with their own routes and are checked as files only.
      if (!path.includes(`${join(dist, 'demos')}`)) walk(path);
    } else if (name.endsWith('.html')) pages.push(path);
  }
})(dist);

const exists = (url) => {
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  const target = join(dist, clean);
  if (!target.startsWith(dist)) return false;
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, 'index.html')) || existsSync(`${target}.html`);
};

const problems = [];
let checked = 0;
for (const page of pages) {
  // Code samples print attributes as text, so look at tags outside of <pre> blocks only.
  const html = readFileSync(page, 'utf8').replace(/<pre[\s\S]*?<\/pre>/g, '');
  const where = page.slice(dist.length) || '/';
  for (const [, url] of html.matchAll(/\b(?:href|src)="(\/[^"/][^"]*|\/)"/g)) {
    checked++;
    if (!exists(url)) problems.push(`${where}: ${url}`);
  }
}

if (problems.length) {
  console.error(
    `${problems.length} broken internal link(s):\n${[...new Set(problems)].join('\n')}`,
  );
  process.exit(1);
}
console.log(`Checked ${checked} internal links in ${pages.length} pages: none broken.`);
