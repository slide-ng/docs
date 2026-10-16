import {createHash} from 'node:crypto';
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fenceStates, highlightLine} from './src/app/landing/highlight';
import {DECK_CLICKS, DECK_MARKDOWN, slideEnds} from './src/app/landing/deck';
import {Typer} from './src/app/landing/typer';

const source = readFileSync(join(import.meta.dirname, 'demos/landing/slides.md'), 'utf8');

function typer(): Typer {
  return new Typer({text: DECK_MARKDOWN, ends: slideEnds(DECK_MARKDOWN), clicks: DECK_CLICKS});
}

describe('the landing deck', () => {
  it('is demos/landing/slides.md, byte for byte', () => {
    expect(DECK_MARKDOWN).toBe(source);
  });

  it('is typed out to exactly that file', () => {
    vi.useFakeTimers();
    try {
      const t = typer();
      t.start();
      vi.runAllTimers();
      expect(t.state()).toBe('done');
      expect(t.text()).toBe(source);
      expect(Buffer.from(t.text()).equals(Buffer.from(source))).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows the built deck of this source', () => {
    const file = join(import.meta.dirname, 'public/demos/landing/source.sha256');
    expect(existsSync(file), 'run: pnpm run demos landing').toBe(true);
    const sha = createHash('sha256')
      .update(readFileSync(join(import.meta.dirname, 'demos/landing/slides.md')))
      .digest('hex');
    expect(readFileSync(file, 'utf8').trim(), 'slides.md changed: run pnpm run demos landing').toBe(
      sha,
    );
  });

  it('has a click count for every slide', () => {
    const ends = slideEnds(DECK_MARKDOWN);
    expect(ends).toHaveLength(DECK_CLICKS.length);
    expect(ends.at(-1)).toBe(DECK_MARKDOWN.length);
    expect([...ends]).toEqual([...ends].sort((a, b) => a - b));
    // The bullets of the second slide are its clicks.
    const second = DECK_MARKDOWN.slice(ends[0], ends[1]);
    expect(second.match(/^- /gm)).toHaveLength(DECK_CLICKS[1]);
  });

  it('ends each slide before the separator of the next one', () => {
    const ends = slideEnds(DECK_MARKDOWN);
    for (const end of ends.slice(0, -1)) {
      expect(DECK_MARKDOWN.slice(end, end + 4)).toBe('---\n');
    }
  });
});

describe('Typer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('types a character every 40 to 50 ms', () => {
    const t = typer();
    t.start();
    vi.advanceTimersByTime(900); // the start delay
    const before = t.text().length;
    vi.advanceTimersByTime(1000);
    const typed = t.text().length - before;
    expect(typed).toBeGreaterThanOrEqual(1000 / 60);
    expect(typed).toBeLessThanOrEqual(1000 / 40);
  });

  it('moves to the second slide when its markdown is complete, and not before', () => {
    const t = typer();
    const ends = slideEnds(DECK_MARKDOWN);
    t.start();
    while (t.text().length < ends[0] - 1) vi.advanceTimersByTime(10);
    expect(t.position().slide).toBe(-1);
    while (t.position().slide < 0) vi.advanceTimersByTime(10);
    expect(t.position().slide).toBe(0);
    while (t.position().slide < 1) vi.advanceTimersByTime(10);
    expect(t.text().length).toBeGreaterThanOrEqual(ends[1]);
  });

  it('steps the clicks of a slide', () => {
    const t = typer();
    t.start();
    while (t.position().slide < 1) vi.advanceTimersByTime(50);
    vi.runAllTimers();
    // Last slide reached, clicks of the last slide: none.
    expect(t.position()).toEqual({slide: DECK_CLICKS.length - 1, clicks: 0});
  });

  it('pauses, resumes and stops', () => {
    const t = typer();
    t.start();
    vi.advanceTimersByTime(3000);
    t.pause();
    const paused = t.text();
    vi.advanceTimersByTime(5000);
    expect(t.text()).toBe(paused);
    expect(t.state()).toBe('paused');
    t.resume();
    vi.advanceTimersByTime(1000);
    expect(t.text().length).toBeGreaterThan(paused.length);
    t.stop();
    const stopped = t.text();
    vi.runAllTimers();
    expect(t.text()).toBe(stopped);
    expect(t.state()).toBe('stopped');
  });

  it('replays from the empty text', () => {
    const t = typer();
    t.start();
    vi.runAllTimers();
    t.start();
    expect(t.text()).toBe('');
    expect(t.position().slide).toBe(-1);
  });

  it('shows everything at once', () => {
    const t = typer();
    t.showAll();
    expect(t.text()).toBe(source);
    expect(t.state()).toBe('done');
    expect(t.position().slide).toBe(0);
  });
});

describe('highlightLine', () => {
  it('colours the shapes of the deck and keeps every character', () => {
    const lines = source.split('\n');
    const fences = fenceStates(lines);
    lines.forEach((line, i) => {
      const text = highlightLine(line, fences[i])
        .map((t) => t.text)
        .join('');
      expect(text).toBe(line);
    });
    expect(highlightLine('# slide.ng', false)[0].kind).toBe('heading');
    expect(highlightLine('layout: end', false)[0].kind).toBe('key');
    expect(highlightLine('const a = 1;', true)[0].kind).toBe('code');
  });
});
