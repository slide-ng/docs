/**
 * The deck the landing page types out: `demos/landing/slides.md`. `pnpm run demos landing`
 * builds it into `public/demos/landing/`, which the frame on the page shows, and copies its text
 * into `deck-source.ts`. `landing.spec.ts` fails when that copy is not the file, byte for byte.
 */
import {DECK_SOURCE} from './deck-source';

export const DECK_MARKDOWN: string = DECK_SOURCE;

/** Where the built deck is served, relative to the site root. */
export const DECK_URL = '/demos/landing/';

/**
 * Clicks of each slide, in order: the bullets of the second slide and the two steps of the code
 * of the third. The landing spec checks that this list has one entry for every slide.
 */
export const DECK_CLICKS: readonly number[] = [0, 3, 2, 0, 0];

/**
 * The offset in `markdown` at which each slide is complete: just before the `---` line that
 * starts the next slide, and the end of the text for the last one. A `---` pair right after a
 * separator is the next slide's frontmatter, not another slide. The headmatter at the top
 * belongs to the first slide.
 */
export function slideEnds(markdown: string): number[] {
  const lines = markdown.split('\n');
  const starts: number[] = [];
  let at = 0;
  for (const line of lines) {
    starts.push(at);
    at += line.length + 1;
  }
  const ends: number[] = [];
  /** Index of the line after a frontmatter block that begins at `from`, or `from` when there is none. */
  const afterFrontmatter = (from: number): number => {
    if (lines[from] !== '---') return from;
    let close = from + 1;
    while (close < lines.length && lines[close] !== '---') {
      if (!/^[\w-]+:/.test(lines[close]) && lines[close] !== '' && !/^\s/.test(lines[close])) {
        return from; // prose, so the first --- was a plain separator
      }
      close++;
    }
    return close < lines.length ? close + 1 : from;
  };
  // Headmatter of the first slide, then its content.
  let i = afterFrontmatter(0);
  for (; i < lines.length; i++) {
    if (lines[i] !== '---') continue;
    ends.push(starts[i]);
    // A separator may open the next slide's frontmatter; step over it so its closing --- is not a split.
    const next = afterFrontmatter(i);
    if (next !== i) i = next - 1;
  }
  ends.push(markdown.length);
  return ends;
}
