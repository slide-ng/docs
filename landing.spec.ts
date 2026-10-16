import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {
  CHOREOGRAPHY,
  FINAL_TEXT,
  LAST_STAGE,
  STAGES,
  TYPING,
  stageTexts,
} from './src/app/landing/choreography';
import {editorLines, lineParts} from './src/app/landing/highlight';
import {Player, del, exec, flatten, move, pause, replay, type} from './src/app/landing/steps';
import {HEADMATTER, splitSlides, stageDeck} from './src/app/landing/stage-deck';
// @ts-expect-error plain JavaScript, shared with the build script
import {stageFingerprint, stageMarkdown} from './scripts/landing-stages.mjs';

const here = import.meta.dirname;
const source = readFileSync(join(here, 'demos/landing/slides.md'), 'utf8');

function player(options: ConstructorParameters<typeof Player>[1] = {}) {
  return new Player(CHOREOGRAPHY, {...TYPING, ...options});
}

describe('the landing deck', () => {
  it('is typed out to exactly demos/landing/slides.md, byte for byte', () => {
    expect(FINAL_TEXT).toBe(source);
    expect(Buffer.from(FINAL_TEXT).equals(Buffer.from(source))).toBe(true);
  });

  it('is the story of Slidev: title, subtitle, frontmatter in front, center to cover, background, page 2', () => {
    const texts = stageTexts();
    expect(texts[0]).toBe('# Welcome to slide.ng!\n\n');
    expect(texts[1]).toBe('# Welcome to slide.ng!\n\nPresentation slides for Angular developers');
    expect(texts[2].startsWith('---\nlayout: center\n---\n\n# Welcome')).toBe(true);
    expect(texts[3].startsWith('---\nlayout: cover\n---\n\n# Welcome')).toBe(true);
    expect(
      texts[4].startsWith('---\nlayout: cover\nbackground: /demo-cover.svg\n---\n\n# Welcome'),
    ).toBe(true);
    expect(texts[5].endsWith('\n\n---\n\n')).toBe(true);
    expect(texts[6].endsWith('# Page 2\n\n')).toBe(true);
    expect(texts[7].endsWith('- 📄 Write slides in a single Markdown file\n')).toBe(true);
    expect(texts[8].endsWith('- 🌈 Themes, code blocks, Angular components\n')).toBe(true);
    expect(texts[9]).toBe(source);
  });

  it('has no v- tags, typed or rendered', () => {
    const vue = /<\/?v-|\bv-(click|clicks|after|mark|motion|drag|switch|if|for|show)\b/;
    expect(vue.test(source)).toBe(false);
    expect(vue.test(stageMarkdown())).toBe(false);
    expect(vue.test(JSON.stringify(CHOREOGRAPHY))).toBe(false);
  });

  it('lists a stage for every moment the script marks, in order', () => {
    const labels: string[] = [];
    replay(CHOREOGRAPHY, (label) => labels.push(label));
    expect(labels.filter((l) => l.startsWith('stage:'))).toEqual(
      STAGES.map((_, i) => `stage:${i}`),
    );
    expect(labels.at(-1)).toBe('page:0');
    expect(LAST_STAGE).toEqual([4, 9]);
    expect(STAGES.filter((s) => s.page === 0)).toHaveLength(LAST_STAGE[0] + 1);
  });
});

describe('the deck of stages', () => {
  it('has one slide for each stage, made from the text at that moment', () => {
    const md = stageDeck(HEADMATTER);
    const slides = splitSlides(md);
    expect(slides).toHaveLength(STAGES.length);
    expect(slides[0].frontmatter).toEqual(expect.arrayContaining(['routerMode: hash']));
    const texts = stageTexts();
    // Every typed line of the slide of a stage is in the text typed until that stage.
    slides.forEach((slide, i) => {
      for (const line of slide.body.split('\n').filter((l) => l.trim() && l !== '<div></div>')) {
        expect(texts[i], `stage ${i}: ${line}`).toContain(line);
      }
    });
    expect(slides[1].body).toBe(
      '# Welcome to slide.ng!\n\nPresentation slides for Angular developers',
    );
    expect(slides[2].frontmatter).toContain('layout: center');
    expect(slides[3].frontmatter).toContain('layout: cover');
    expect(slides[4].frontmatter).toContain('background: /demo-cover.svg');
    expect(slides[9].body).toBe(
      '# Page 2\n\n- 📄 Write slides in a single Markdown file\n- 🌈 Themes, code blocks, Angular components\n- 😎 Read the docs to learn more!',
    );
  });

  it('keeps an empty page from reading as a frontmatter block', () => {
    const md = stageDeck(HEADMATTER);
    expect(md).not.toMatch(/---\n\n---/);
    expect(md).toContain('<div></div>');
  });

  it('is what the built deck was made from', () => {
    const file = join(here, 'public/demos/landing/source.sha256');
    expect(existsSync(file), 'run: pnpm run demos landing').toBe(true);
    expect(
      readFileSync(file, 'utf8').trim(),
      'the script, the cover or the styles changed: run pnpm run demos landing',
    ).toBe(stageFingerprint(here));
  });

  it('ships its cover picture, an SVG, inside the deck', () => {
    expect(existsSync(join(here, 'public/demos/landing/demo-cover.svg'))).toBe(true);
    const svg = readFileSync(join(here, 'demos/landing/public/demo-cover.svg'), 'utf8');
    expect(svg).not.toMatch(/<image|href="http/);
    expect(svg.length).toBeLessThan(4000);
  });
});

describe('the step engine', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('types, moves, deletes and calls back', () => {
    const marks: string[] = [];
    const out = replay(
      [
        type('abc'),
        move(-1),
        type('X'),
        move('start'),
        type('>'),
        move('end'),
        del(2),
        exec('here'),
        type('😎!'),
        move(-1),
        del(1),
      ],
      (label, editor) => marks.push(`${label}:${editor.text}`),
    );
    expect(marks).toEqual(['here:>ab']);
    expect(out.text).toBe('>ab!');
    expect(out.caret).toBe(3);
  });

  it('counts an emoji as one character', () => {
    expect(replay([type('a😎'), del(1)]).text).toBe('a');
    expect(replay([type('😎b'), move('start'), move(1), type('-')]).text).toBe('😎-b');
  });

  it('adds the delays and pauses before the next operation', () => {
    const ops = flatten([type('a', {delay: 400}), pause(1000), type('b', {speed: 10})], {
      speed: 50,
      startDelay: 900,
    });
    expect(ops).toHaveLength(2);
    expect(ops[0].wait).toBeGreaterThanOrEqual(900 + 400 + 37);
    expect(ops[0].wait).toBeLessThanOrEqual(900 + 400 + 63);
    expect(ops[1].wait).toBeGreaterThanOrEqual(1000 + 8);
    expect(ops[1].wait).toBeLessThanOrEqual(1000 + 13);
  });

  it('types a character in 50 ms, give or take a quarter, after the first 900 ms', () => {
    const p = player();
    p.start();
    vi.advanceTimersByTime(900 + 400);
    expect(p.editor.text).toBe('');
    const before = p.editor.text.length;
    vi.advanceTimersByTime(1000);
    const typed = p.editor.text.length - before;
    expect(typed).toBeGreaterThanOrEqual(1000 / 63);
    expect(typed).toBeLessThanOrEqual(1000 / 37);
  });

  it('ends on the whole file, is done after 300 ms, and gives the same times every run', () => {
    const run = () => {
      const log: [number, string][] = [];
      let state = '';
      const p = player({
        onExec: (label) => log.push([Date.now(), label]),
        onState: (s) => (state = s),
      });
      const t0 = Date.now();
      p.start();
      vi.runAllTimers();
      return {text: p.editor.text, log: log.map(([at, label]) => `${at - t0}:${label}`), state};
    };
    const a = run();
    const b = run();
    expect(a.text).toBe(source);
    expect(a.state).toBe('done');
    expect(a.log).toEqual(b.log);
    expect(a.log.at(-1)).toMatch(/:page:0$/);
  });

  it('reports every stage in order while it types', () => {
    const labels: string[] = [];
    const p = player({onExec: (label) => labels.push(label)});
    p.start();
    vi.runAllTimers();
    expect(labels).toEqual([
      'stage:0',
      'stage:1',
      'stage:2',
      'stage:3',
      'stage:4',
      'page:1',
      'stage:5',
      'stage:6',
      'stage:7',
      'stage:8',
      'stage:9',
      'page:0',
    ]);
  });

  it('pauses where it is and resumes from there', () => {
    const p = player();
    p.start();
    vi.advanceTimersByTime(4000);
    p.pause();
    expect(p.state).toBe('paused');
    const text = p.editor.text;
    expect(text.length).toBeGreaterThan(0);
    vi.advanceTimersByTime(10_000);
    expect(p.editor.text).toBe(text);
    p.resume();
    expect(p.state).toBe('playing');
    vi.advanceTimersByTime(1000);
    expect(p.editor.text.length).toBeGreaterThan(text.length);
    vi.runAllTimers();
    expect(p.editor.text).toBe(source);
  });

  it('replays from an empty editor', () => {
    const p = player();
    p.start();
    vi.runAllTimers();
    expect(p.state).toBe('done');
    p.start();
    expect(p.editor.text).toBe('');
    expect(p.state).toBe('playing');
    vi.runAllTimers();
    expect(p.editor.text).toBe(source);
  });

  it('stops where it is', () => {
    const p = player();
    p.start();
    vi.advanceTimersByTime(3000);
    p.stop();
    const text = p.editor.text;
    vi.advanceTimersByTime(60_000);
    expect(p.editor.text).toBe(text);
    expect(p.state).toBe('idle');
  });

  it('shows the final state at once, with no timer, for reduced motion', () => {
    const labels: string[] = [];
    const p = player({onExec: (label) => labels.push(label)});
    p.showAll();
    expect(vi.getTimerCount()).toBe(0);
    expect(p.editor.text).toBe(source);
    expect(p.state).toBe('done');
    expect(labels.at(-1)).toBe('page:0');
    expect(labels).toContain('stage:9');
  });
});

describe('the editor colours', () => {
  it('colours rules, keys and headings', () => {
    expect(lineParts('---')).toEqual([{text: '---', kind: 'rule'}]);
    expect(lineParts('layout: cover')).toEqual([
      {text: 'layout:', kind: 'key'},
      {text: ' cover', kind: 'plain'},
    ]);
    expect(lineParts('# Page 2')).toEqual([
      {text: '#', kind: 'mark'},
      {text: ' Page 2', kind: 'heading'},
    ]);
    expect(lineParts('- 📄 a: b')).toEqual([{text: '- 📄 a: b', kind: 'plain'}]);
    expect(lineParts('')).toEqual([]);
  });

  it('puts the caret in the line and the part it belongs to, and loses no text', () => {
    const text = '---\nlayout: cover\n\n# Hi';
    for (let caret = 0; caret <= text.length; caret++) {
      const lines = editorLines(text, caret);
      expect(lines.flat().filter((s) => s.kind === 'caret')).toHaveLength(1);
      expect(lines.map((l) => l.map((s) => s.text).join('')).join('\n')).toBe(text);
    }
    expect(
      editorLines('a', null)
        .flat()
        .some((s) => s.kind === 'caret'),
    ).toBe(false);
  });
});
