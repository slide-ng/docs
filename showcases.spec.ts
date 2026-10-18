import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {
  dataFile,
  dataOf,
  entryOf,
  indexFile,
  indexWith,
  liveUrl,
  pageOf,
  pagesDir,
  sourceUrl,
  titleOf,
  // @ts-expect-error plain JavaScript, shared with the build script
} from './scripts/sync-showcases.mjs';
import {resolveDemoSrc} from './src/app/ui/demo';

const entries = JSON.parse(readFileSync(dataFile, 'utf8')) as ReturnType<typeof entryOf>[];

describe('sync-showcases', () => {
  it('turns a slug into a title', () => {
    expect(titleOf('angular-workshop')).toBe('Angular Workshop');
    expect(titleOf('pipes-and-i18n')).toBe('Pipes and i18n');
    expect(titleOf('forms-and-di')).toBe('Forms and DI');
    expect(titleOf('rtl-and-languages')).toBe('RTL and Languages');
  });

  it('keeps the theme, and says "all five" for a deck with variants', () => {
    const base = {slug: 'x', blurb: 'b', tags: ['t']};
    expect(entryOf({...base, theme: 'moss'}).theme).toBe('moss');
    expect(entryOf({...base, theme: 'default', variants: ['paper', 'moss']}).theme).toBe(
      'all five',
    );
  });

  it('has the data of 31 decks with unique slugs', () => {
    expect(entries).toHaveLength(31);
    expect(new Set(entries.map((e) => e.slug)).size).toBe(31);
    expect(readFileSync(dataFile, 'utf8')).toBe(dataOf(entries));
    for (const entry of entries) {
      expect(entry.blurb.length).toBeGreaterThan(0);
      expect(entry.tags.length).toBeGreaterThan(0);
    }
  });

  it('has a page for every deck, written as the generator writes it, and no other page', () => {
    const files = readdirSync(pagesDir).filter(
      (name) => name.endsWith('.md') && name !== 'index.md',
    );
    expect(files.sort()).toEqual(entries.map((e) => `${e.slug}.md`).sort());
    for (const entry of entries) {
      expect(readFileSync(join(pagesDir, `${entry.slug}.md`), 'utf8')).toBe(pageOf(entry));
    }
  });

  it('writes the title, blurb, theme, tags, source link and live frame into a page', () => {
    const entry = entries.find((e) => e.slug === 'ship-it')!;
    const page = pageOf(entry);
    expect(page).toContain(`title: ${JSON.stringify(entry.title)}`);
    expect(page).toContain(entry.blurb);
    expect(page).toContain(`**Theme:** ${entry.theme}`);
    expect(page).toContain(entry.tags.join(', '));
    expect(sourceUrl('ship-it')).toBe(
      'https://github.com/slide-ng/showcases/tree/main/decks/ship-it',
    );
    expect(page).toContain(`href="${sourceUrl('ship-it')}"`);
    expect(page).toContain(`<ngmd-demo src="${liveUrl('ship-it')}"`);
  });

  it('points every frame at an address the demo component accepts', () => {
    for (const entry of entries) {
      expect(liveUrl(entry.live)).toBe(`https://slide-ng.github.io/showcases/${entry.live}/`);
      expect(resolveDemoSrc(liveUrl(entry.live), '/')).toBe(liveUrl(entry.live));
    }
  });

  it('lists every deck between the markers of the index page', () => {
    const text = readFileSync(indexFile, 'utf8');
    expect(indexWith(text, entries)).toBe(text);
    for (const entry of entries) expect(text).toContain(`](/resources/showcases/${entry.slug})`);
  });
});
