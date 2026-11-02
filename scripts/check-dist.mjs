// Checks the built site: every internal link, image, script and iframe in the HTML must point at a file or a page,
// and every page has the tags a crawler reads.
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

// The site base, when the site is built for a sub-path: NGMD_BASE=/repo/ node scripts/check-dist.mjs
const rawBase = (process.env.NGMD_BASE ?? '').trim().replace(/^\/+|\/+$/g, '');
const base = rawBase ? `/${rawBase}/` : '/';

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

const exists = (url, plainPath = false) => {
  // Under a base every internal URL has to start with it; the files sit at the top of dist.
  if (base !== '/' && !plainPath) {
    if (!url.startsWith(base) && url !== base.slice(0, -1)) return false;
    url = '/' + url.slice(base.length);
  }
  const clean = decodeURIComponent(url.split('#')[0].split('?')[0]);
  const target = join(dist, clean);
  if (!target.startsWith(dist)) return false;
  if (existsSync(target) && statSync(target).isFile()) return true;
  return existsSync(join(target, 'index.html')) || existsSync(`${target}.html`);
};

const problems = [];
let checked = 0;
// What a crawler needs from each page: one H1, alt text, its own title and description, and a
// canonical URL that the sitemap lists.
const seoProblems = [];
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const locs = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const seen = new Map();
const once = (kind, value, where) => {
  const key = `${kind}: ${value}`;
  if (seen.has(key)) seoProblems.push(`${where}: same ${kind} as ${seen.get(key)}`);
  seen.set(key, where);
};
for (const page of pages) {
  // Code samples print attributes as text, so look at tags outside of <pre> blocks only.
  const html = readFileSync(page, 'utf8').replace(/<pre[\s\S]*?<\/pre>/g, '');
  const where = page.slice(dist.length) || '/';
  const h1s = html.match(/<h1\b/g)?.length ?? 0;
  if (h1s !== 1) seoProblems.push(`${where}: ${h1s} h1 elements`);
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(img)) seoProblems.push(`${where}: image without alt: ${img}`);
  }
  if (where !== '/404.html') {
    once('title', html.match(/<title[^>]*>([^<]*)/)?.[1], where);
    once('description', html.match(/<meta name="description" content="([^"]*)/)?.[1], where);
    const canonical = html.match(/<link rel="canonical" href="([^"]*)/)?.[1];
    if (!locs.has(canonical)) seoProblems.push(`${where}: canonical ${canonical} not in sitemap`);
  }
  for (const [, tag, attrs] of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
    for (const [, name, url] of attrs.matchAll(/([\w-]*\b(?:href|src))="(\/[^"/][^"]*|\/)"/g)) {
      checked++;
      // <ngmd-*> elements and data-* attributes hold a plain site path; the script that reads
      // them adds the base when the page runs.
      const plain = tag.startsWith('ngmd-') || name.startsWith('data-');
      if (!exists(url, plain)) problems.push(`${where}: ${url}`);
    }
  }
}

if (problems.length) {
  console.error(
    `${problems.length} broken internal link(s):\n${[...new Set(problems)].join('\n')}`,
  );
  process.exit(1);
}
if (seoProblems.length) {
  console.error(`${seoProblems.length} SEO problem(s):\n${seoProblems.join('\n')}`);
  process.exit(1);
}
console.log(`Checked ${checked} internal links in ${pages.length} pages: none broken.`);
console.log(`Checked the title, description, canonical, h1 and alt text of ${pages.length} pages.`);
