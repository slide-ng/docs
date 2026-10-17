// The theme switcher of the demo decks is written once, in slide.ng-themes/examples (layers/ and components/).
// Every demos/theme-<name>/ gets a copy, which the deck picks up as its own layer and component.
import {copyFileSync, existsSync, mkdirSync, readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';

export const SWITCHER_FILES = [
  'layers/slide-top.ts',
  'components/demo-switcher.ts',
  'components/demo-switcher-urls.ts',
];

/** The demos/theme-<name> folders. */
export function themeDemos(root) {
  return readdirSync(join(root, 'demos'), {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('theme-'))
    .map((entry) => join(root, 'demos', entry.name));
}

/** Copies the switcher from a slide.ng-themes checkout into the given demo folders. */
export function copySwitcher(themesDir, folders) {
  for (const folder of folders) {
    for (const file of SWITCHER_FILES) {
      const target = join(folder, file);
      mkdirSync(dirname(target), {recursive: true});
      copyFileSync(join(themesDir, 'examples', file), target);
    }
  }
}

export const hasSwitcher = (themesDir) =>
  SWITCHER_FILES.every((file) => existsSync(join(themesDir, 'examples', file)));
