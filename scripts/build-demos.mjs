// Builds the example decks in demos/ into public/demos/<name>/ with the slide.ng command line.
//
//   node scripts/build-demos.mjs [name ...]
//
// It needs a checkout of slide.ng (with its dependencies installed) and, for the theme decks, a checkout of
// slide.ng-themes. Point to them with SLIDE_NG_DIR and SLIDE_NG_THEMES_DIR (defaults: ../slide.ng and
// ../slide.ng-themes). The built decks are committed, so the site build itself needs neither.
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {stageFingerprint, writeSource, writeStageDeck} from './landing-stages.mjs';
import {copySwitcher, hasSwitcher} from './theme-switcher.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slideNg = resolve(process.env.SLIDE_NG_DIR ?? join(root, '..', 'slide.ng'));
const themes = resolve(process.env.SLIDE_NG_THEMES_DIR ?? join(root, '..', 'slide.ng-themes'));
const cli = join(slideNg, 'bin', 'slide-ng.mjs');
if (!existsSync(cli)) throw new Error(`No slide.ng checkout at ${slideNg}. Set SLIDE_NG_DIR.`);

const all = readdirSync(join(root, 'demos'), {withFileTypes: true})
  .filter(
    (entry) => entry.isDirectory() && existsSync(join(root, 'demos', entry.name, 'slides.md')),
  )
  .map((entry) => entry.name);
const argv = process.argv.slice(2);
// `--write-source` rewrites demos/landing/slides.md from the script of the landing demo.
if (argv.includes('--write-source')) writeSource(root);
const wanted = argv.filter((a) => !a.startsWith('--')).length
  ? argv.filter((a) => !a.startsWith('--'))
  : all;

for (const name of wanted) {
  if (!all.includes(name)) throw new Error(`Unknown demo "${name}". Known: ${all.join(', ')}`);
  // The landing deck is made from the text the landing page types: one slide for each moment (landing-stages.mjs).
  const source = name === 'landing' ? writeStageDeck(root) : join(root, 'demos', name, 'slides.md');
  const args = [
    cli,
    'build',
    source,
    '--base',
    `/demos/${name}/`,
    '--out',
    join('public', 'demos', name),
  ];
  // demos/theme-<name> use the theme package of the slide.ng-themes checkout instead of one from node_modules.
  const theme = name.startsWith('theme-') ? join(themes, 'packages', name) : null;
  if (theme) {
    if (!existsSync(theme))
      throw new Error(`No theme package at ${theme}. Set SLIDE_NG_THEMES_DIR.`);
    args.push('--theme', theme);
    if (hasSwitcher(themes)) copySwitcher(themes, [join(root, 'demos', name)]);
  }
  console.log(`\n== ${name}`);
  const result = spawnSync(process.execPath, args, {cwd: root, stdio: 'inherit'});
  if (result.status !== 0) throw new Error(`Building the demo "${name}" failed`);
  rmSync(join(root, 'public', 'demos', name, '_redirects'), {force: true});
  // A fingerprint of the source, so a test can tell when it changed and the deck was not rebuilt.
  const fingerprint =
    name === 'landing'
      ? stageFingerprint(root)
      : createHash('sha256')
          .update(readFileSync(join(root, 'demos', name, 'slides.md')))
          .digest('hex');
  writeFileSync(join(root, 'public', 'demos', name, 'source.sha256'), fingerprint + '\n');
}
