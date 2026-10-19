/**
 * What the landing demo types, and when the slide next to it changes. The story and the timings
 * are those of Slidev's demo: type a title and a subtitle, put a frontmatter block in front of
 * them, change its layout from `center` to `cover`, add a background, then type a second slide
 * with three bullets while the slide card turns to page 2.
 *
 * The `exec` labels are the moments the slide changes: `stage:N` shows stage N (see `STAGES`)
 * and `page:N` turns the card to page N. `scripts/landing-stages.mjs` replays this script, takes
 * the text at each `stage:N` and builds the deck the card shows from it, so the typed text and
 * the rendered slides cannot drift apart.
 *
 * No imports except the step engine, and `.ts` import paths, so Node can load this file.
 */
import {del, exec, move, pause, replay, type, type Step} from './steps.ts';

/** Where the cover image of the deck is (`demos/landing/public/ngpoland-conf.jpg`). */
export const COVER_URL = '/ngpoland-conf.jpg';

/** Time per character, and the wait before the first one, as in Slidev's demo. */
export const TYPING = {speed: 50, startDelay: 900} as const;

export const CHOREOGRAPHY: readonly Step[] = [
  type('# Welcome to slide.ng!\n\n', {delay: 400}),
  exec('stage:0'),
  type('Presentation slides for Angular developers', {delay: 400}),
  exec('stage:1'),
  // The caret goes to the start of the file, and a frontmatter block goes in before the title.
  move('start', {speed: 0}),
  type('---\n\n---\n\n'),
  move(-6),
  type('layout: center'),
  exec('stage:2'),
  pause(1000),
  del(6, {delay: 100}),
  type('cover'),
  exec('stage:3'),
  pause(1000),
  type('\n'),
  type('background: ', {delay: 200}),
  type(COVER_URL, {speed: 0}),
  exec('stage:4'),
  pause(1000),
  move('end', {speed: 0}),
  type('\n\n---\n\n', {delay: 400}),
  exec('page:1'),
  exec('stage:5'),
  type('# Why slide.ng\n\n', {delay: 400}),
  exec('stage:6'),
  type('- 📄 Write your slides in one Markdown file\n', {delay: 800}),
  exec('stage:7'),
  type('- 🌈 Themes, code blocks, Angular components\n', {delay: 800}),
  exec('stage:8'),
  type('- 😎 Read the docs to learn more!\n', {delay: 800}),
  exec('stage:9'),
  // Slidev turns the card back to the cover as soon as the last bullet is typed. A beat later here,
  // so the finished list can be read.
  pause(2200),
  exec('page:0'),
];

/**
 * The slides the card can show, by stage. A stage is a slide of the built deck (`stage + 1`),
 * on the page `page`: page 1 shows stages 0 to 4 (title, subtitle, `center`, `cover`, the
 * background), page 2 shows stages 5 to 9 (empty, title, one, two, three bullets).
 */
export const STAGES = [
  {page: 0},
  {page: 0},
  {page: 0},
  {page: 0},
  {page: 0},
  {page: 1},
  {page: 1},
  {page: 1},
  {page: 1},
  {page: 1},
] as const;

/** The last stage shown on each page. The card ends on page 1, in its last stage. */
export const LAST_STAGE = [4, 9] as const;

/** The whole text the script types: `demos/landing/slides.md`. */
export const FINAL_TEXT: string = replay(CHOREOGRAPHY).text;

/** The text of the editor at the moment each stage is shown. */
export function stageTexts(): string[] {
  const texts: string[] = [];
  replay(CHOREOGRAPHY, (label, editor) => {
    const match = /^stage:(\d+)$/.exec(label);
    if (match) texts[Number(match[1])] = editor.text;
  });
  return texts;
}
