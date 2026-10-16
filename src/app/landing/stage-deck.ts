/**
 * Builds the deck the slide card shows from the typed markdown: one slide per stage, each the
 * slide of the text at that moment (see `choreography.ts`). Pure functions with no imports except
 * the choreography, and `.ts` import paths, so `scripts/build-demos.mjs` can load this file.
 */
import {STAGES, stageTexts} from './choreography.ts';

export interface SlideSource {
  /** The lines of the frontmatter block, or `null` when the slide has none. */
  frontmatter: string[] | null;
  /** The markdown of the slide, without the frontmatter, surrounding blank lines trimmed. */
  body: string;
}

/** The settings of the deck of stages. The card shows it in a frame the size of the canvas. */
export const HEADMATTER: readonly string[] = [
  'title: slide.ng, the landing demo',
  'routerMode: hash',
  'canvasWidth: 980',
  'aspectRatio: 16/9',
  'transition: none',
  'presenter: false',
  'contextMenu: false',
  'record: false',
];

const YAML_LINE = /^(?:[\w-]+:.*|\s*)$/;

/** The slides of a markdown file, split on `---` lines. A `---` pair around YAML is frontmatter. */
export function splitSlides(markdown: string): SlideSource[] {
  const lines = markdown.split('\n');
  const slides: SlideSource[] = [];
  let current: {frontmatter: string[] | null; body: string[]} = {frontmatter: null, body: []};
  const finish = () =>
    slides.push({
      frontmatter: current.frontmatter,
      body: current.body.join('\n').replace(/^\n+|\n+$/g, ''),
    });
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '---') {
      current.body.push(lines[i]);
      continue;
    }
    // A closing `---` after nothing but YAML lines makes this one the opening of a frontmatter block.
    let close = i + 1;
    while (close < lines.length && lines[close] !== '---' && YAML_LINE.test(lines[close])) close++;
    const isFrontmatter = close < lines.length && lines[close] === '---';
    if (i > 0) {
      finish();
      current = {frontmatter: null, body: []};
    }
    if (isFrontmatter) {
      current.frontmatter = lines.slice(i + 1, close).filter((line) => line.trim() !== '');
      i = close;
    }
  }
  finish();
  return slides;
}

/** The slide each stage shows: the first slide of the text for page 1, the second for page 2. */
export function stageSlides(): SlideSource[] {
  const page = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
  return stageTexts().map((text, stage) => {
    const slides = splitSlides(text);
    return slides[page[stage]] ?? {frontmatter: null, body: ''};
  });
}

/**
 * The markdown of the deck of stages: a headmatter block (the deck's settings, then the frontmatter
 * of the first stage) and one slide for each stage.
 */
export function stageDeck(headmatter: readonly string[]): string {
  const slides = stageSlides();
  if (slides.length !== STAGES.length) throw new Error('the script and the stage list disagree');
  let out = '';
  slides.forEach((slide, index) => {
    const fm = slide.frontmatter ?? [];
    if (index === 0) {
      out += ['---', ...headmatter, ...fm, '---'].join('\n') + '\n';
    } else {
      out += '\n---\n' + (fm.length ? fm.join('\n') + '\n---\n' : '');
    }
    // An empty slide gets an empty element: two `---` lines in a row would read as a frontmatter block.
    out += '\n' + (slide.body || '<div></div>') + '\n';
  });
  return out;
}
