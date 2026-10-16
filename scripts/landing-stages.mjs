// The deck the landing page shows next to its editor, made from what the editor types.
//
// `demos/landing/slides.md` is the whole text the demo types. `src/app/landing/choreography.ts` is the
// script that types it, and the stage of the slide card changes at marked moments of it. This file replays the
// script, takes the markdown at each moment and writes it as one deck with a slide for every moment, into a
// working folder together with the deck's own `public/` and `styles/`. `build-demos.mjs` builds that folder.
import {createHash} from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {join} from 'node:path';
import {FINAL_TEXT} from '../src/app/landing/choreography.ts';
import {HEADMATTER, stageDeck} from '../src/app/landing/stage-deck.ts';

/** The markdown of the deck of stages. */
export function stageMarkdown() {
  return stageDeck(HEADMATTER);
}

/** The files of the deck that are not markdown, relative to `demos/landing/`. */
function extraFiles(root) {
  const base = join(root, 'demos', 'landing');
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(base, dir), {withFileTypes: true})) {
      const rel = join(dir, entry.name);
      if (entry.isDirectory()) walk(rel);
      else found.push(rel);
    }
  };
  for (const dir of ['public', 'styles']) if (existsSync(join(base, dir))) walk(dir);
  return found.sort();
}

/** A fingerprint of everything the built landing deck is made from. */
export function stageFingerprint(root) {
  const hash = createHash('sha256');
  hash.update(stageMarkdown());
  for (const file of extraFiles(root)) {
    hash.update(`\0${file}\0`);
    hash.update(readFileSync(join(root, 'demos', 'landing', file)));
  }
  return hash.digest('hex');
}

/** Writes the working folder and returns the path of its slides.md. */
export function writeStageDeck(root, dir = join(root, 'tmp', 'landing-stages')) {
  const typed = readFileSync(join(root, 'demos', 'landing', 'slides.md'), 'utf8');
  if (typed !== FINAL_TEXT) {
    throw new Error(
      'demos/landing/slides.md is not what the script types. Run: pnpm run demos landing --write-source',
    );
  }
  rmSync(dir, {recursive: true, force: true});
  mkdirSync(dir, {recursive: true});
  for (const file of extraFiles(root)) {
    cpSync(join(root, 'demos', 'landing', file), join(dir, file));
  }
  writeFileSync(join(dir, 'slides.md'), stageMarkdown());
  return join(dir, 'slides.md');
}

/** Writes `demos/landing/slides.md` from the script. */
export function writeSource(root) {
  writeFileSync(join(root, 'demos', 'landing', 'slides.md'), FINAL_TEXT);
}
