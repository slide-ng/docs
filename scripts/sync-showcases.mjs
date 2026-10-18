// Writes the showcase pages from showcases.json of the slide-ng/showcases repository.
//
//   node scripts/sync-showcases.mjs
//
// The catalog is read from SLIDE_NG_SHOWCASES_DIR (default ../slide.ng-showcases, then ../showcases).
// It writes src/app/data/showcases.json (the card grid), one page per deck in
// src/content/resources/showcases/ and the link list between the markers of
// src/content/resources/showcases/index.md. The generated files are committed, so building the site
// does not need the other repository.
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const dataFile = join(root, 'src', 'app', 'data', 'showcases.json');
export const pagesDir = join(root, 'src', 'content', 'resources', 'showcases');
export const indexFile = join(root, 'src', 'content', 'resources', 'showcases', 'index.md');

export const REPO_URL = 'https://github.com/slide-ng/showcases';
export const LIVE_URL = 'https://slide-ng.github.io/showcases';
export const MARKERS = ['<!-- showcases:start -->', '<!-- showcases:end -->'];

const LOWER = new Set(['a', 'an', 'and', 'by', 'for', 'in', 'of', 'on', 'the', 'to']);
const SPECIAL = {di: 'DI', i18n: 'i18n', rtl: 'RTL', pdf: 'PDF', pwa: 'PWA'};

/** `pipes-and-i18n` becomes `Pipes and i18n`. */
export function titleOf(slug) {
  return slug
    .split('-')
    .map((word, i) => {
      if (SPECIAL[word]) return SPECIAL[word];
      if (i > 0 && LOWER.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/** The entry of the grid for one deck of showcases.json. */
export function entryOf(deck) {
  return {
    slug: deck.slug,
    live: deck.variants ? `${deck.slug}/${deck.theme}` : deck.slug,
    title: titleOf(deck.slug),
    theme: deck.variants ? 'all five' : deck.theme,
    blurb: deck.blurb,
    tags: deck.tags ?? [],
  };
}

export function sourceUrl(slug) {
  return `${REPO_URL}/tree/main/decks/${slug}`;
}

export function liveUrl(slug) {
  return `${LIVE_URL}/${slug}/`;
}

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** The markdown of the page of one deck. */
export function pageOf(entry) {
  return `---
title: ${JSON.stringify(entry.title)}
description: ${JSON.stringify(entry.blurb)}
---

# ${entry.title}

${entry.blurb}

**Theme:** ${entry.theme}. **Tags:** ${entry.tags.join(', ')}.

<ngmd-pill-row>
  <ngmd-pill href="${sourceUrl(entry.slug)}" title="Source on GitHub"></ngmd-pill>
  <ngmd-pill href="/resources/showcases" title="All showcases"></ngmd-pill>
</ngmd-pill-row>

<ngmd-demo src="${liveUrl(entry.live ?? entry.slug)}" title="${attr(entry.title)}" source="${sourceUrl(entry.slug)}"></ngmd-demo>
`;
}

/** The plain list of links between the markers of the index page, for readers without scripts. */
export function listOf(entries) {
  return entries.map((e) => `- [${e.title}](/resources/showcases/${e.slug})`).join('\n');
}

export function indexWith(text, entries) {
  const [start, end] = MARKERS;
  const from = text.indexOf(start);
  const to = text.indexOf(end);
  if (from < 0 || to < from) throw new Error(`${indexFile} needs ${start} and ${end}.`);
  return `${text.slice(0, from + start.length)}\n\n${listOf(entries)}\n\n${text.slice(to)}`;
}

export function dataOf(entries) {
  return JSON.stringify(entries, null, 2) + '\n';
}

function readCatalog() {
  const candidates = process.env.SLIDE_NG_SHOWCASES_DIR
    ? [resolve(process.env.SLIDE_NG_SHOWCASES_DIR)]
    : [join(root, '..', 'slide.ng-showcases'), join(root, '..', 'showcases')];
  const dir = candidates.find((d) => existsSync(join(d, 'showcases.json')));
  if (!dir) {
    throw new Error(`No showcases.json in ${candidates.join(' or ')}. Set SLIDE_NG_SHOWCASES_DIR.`);
  }
  return JSON.parse(readFileSync(join(dir, 'showcases.json'), 'utf8'));
}

function main() {
  const entries = readCatalog().map(entryOf);
  const slugs = entries.map((e) => e.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('showcases.json repeats a slug.');
  for (const slug of slugs) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`Unusable slug: ${slug}`);
  }

  mkdirSync(pagesDir, {recursive: true});
  mkdirSync(dirname(dataFile), {recursive: true});
  for (const name of readdirSync(pagesDir)) {
    if (name.endsWith('.md') && name !== 'index.md' && !slugs.includes(name.slice(0, -3)))
      rmSync(join(pagesDir, name));
  }
  for (const entry of entries) writeFileSync(join(pagesDir, `${entry.slug}.md`), pageOf(entry));
  writeFileSync(dataFile, dataOf(entries));
  writeFileSync(indexFile, indexWith(readFileSync(indexFile, 'utf8'), entries));
  console.log(`Wrote ${entries.length} showcase pages.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
