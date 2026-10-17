import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
// @ts-expect-error plain JavaScript, shared with the build script
import {SWITCHER_FILES, themeDemos} from './scripts/theme-switcher.mjs';

const here = import.meta.dirname;
const themes = join(process.env['SLIDE_NG_THEMES_DIR'] ?? join(here, '..', 'slide.ng-themes'));
const demos: string[] = themeDemos(here);
const text = (file: string) => readFileSync(file, 'utf8');

describe('the theme switcher of the theme demos', () => {
  it('is in the five theme demos', () => {
    expect(demos.map((d) => d.split('/').pop()).sort()).toEqual([
      'theme-adev',
      'theme-apple-basic',
      'theme-bricks',
      'theme-seriph',
      'theme-shibainu',
    ]);
  });

  for (const file of SWITCHER_FILES as string[]) {
    it(`has the same ${file} in every demo`, () => {
      const [first, ...rest] = demos.map((d) => text(join(d, file)));
      for (const other of rest) expect(other).toBe(first);
    });

    const source = join(themes, 'examples', file);
    (existsSync(source) ? it : it.skip)(`${file} is the one in slide.ng-themes`, () => {
      expect(text(join(demos[0], file))).toBe(text(source));
    });
  }
});
