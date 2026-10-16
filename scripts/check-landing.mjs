// Opens the home page in Chromium and checks the live demo, then takes screenshots.
//
//   node scripts/check-landing.mjs [--url http://localhost:5173/] [--out tmp/landing-shots]
//
// Without --url it serves dist/analog/public (run "pnpm run build" first). It needs playwright-core and a
// Chromium: PLAYWRIGHT_BROWSERS_PATH (default /opt/pw-browsers) or CHROMIUM_PATH.
//
// What it checks: the page loads without console errors; the composition of the demo (an editor window with
// three dots, a 16:9 slide card over its bottom right corner); the editor types at about 50 ms a character and
// ends on the whole of slides.md; the card's frames follow the typing (slide by slide, then the page turns); the
// replay button and the page buttons work and can be reached with the keyboard; with prefers-reduced-motion the
// final state is there at once; no horizontal scroll; the contrast of every text of the page and of the slides
// (WCAG AA). Screenshots at 1440, 1024, 820 and 390 px wide, in light and dark mode, at several moments of the
// typing, go to --out.
import {createServer} from 'node:http';
import {existsSync, mkdirSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
};
const outDir = resolve(arg('out') ?? join(root, 'tmp', 'landing-shots'));
mkdirSync(outDir, {recursive: true});
process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/opt/pw-browsers';

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
};

/** Serves a folder like a static host with a 404.html fallback. */
function serve(dir) {
  const server = createServer((req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0].split('#')[0]);
    let file = join(dir, path);
    if (!file.startsWith(dir)) file = join(dir, '404.html');
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    let status = 200;
    if (!existsSync(file)) {
      file = join(dir, '404.html');
      status = 404;
    }
    res.writeHead(status, {'content-type': types[extname(file)] ?? 'application/octet-stream'});
    res.end(readFileSync(file));
  });
  return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

let server;
let url = arg('url');
if (!url) {
  const dist = join(root, 'dist', 'analog', 'public');
  if (!existsSync(dist)) throw new Error('No build. Run "pnpm run build" first, or pass --url.');
  server = await serve(dist);
  url = `http://127.0.0.1:${server.address().port}/`;
}
const origin = new URL(url).origin;

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);
  if (!ok) failures.push(message);
};
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const until = async (fn, ms, step = 100) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (await fn()) return true;
    await sleep(step);
  }
  return false;
};

const executablePath =
  process.env.CHROMIUM_PATH ??
  (() => {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
    const dir = readdirSync(base).find((d) => d.startsWith('chromium-'));
    return join(base, dir, 'chrome-linux', 'chrome');
  })();
const browser = await chromium.launch({executablePath});
const source = readFileSync(join(root, 'demos', 'landing', 'slides.md'), 'utf8');

async function open(options, path = '') {
  const context = await browser.newContext(options);
  // Nothing outside this site is fetched (the web font, for one), so the check works offline.
  await context.route(
    (u) => u.origin !== origin,
    (route) => route.abort(),
  );
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    // Only this site: a web font from another host may not load where the check runs.
    if (m.type() === 'error' && (m.location().url ?? '').startsWith(origin)) {
      errors.push(`console: ${m.text()}`);
    }
  });
  await page.goto(url + path, {waitUntil: 'load'});
  return {context, page, errors};
}

/** The text of the editor, line by line. */
const editorText = (page) =>
  page
    .locator('app-landing-demo .text code')
    .evaluate((el) => [...el.querySelectorAll('.line')].map((line) => line.textContent).join('\n'));
/** The number of the slide of the deck that the first or the second page of the card shows (0 for none). */
const frameSlide = (page, n) =>
  page.evaluate((i) => {
    try {
      const frame = document.querySelectorAll('app-landing-demo iframe')[i];
      const hash = /^#\/(\d+)/.exec(frame.contentWindow.location.hash);
      return hash && frame.classList.contains('shown') ? Number(hash[1]) : 0;
    } catch {
      return -1;
    }
  }, n);
const frameText = (page, n) =>
  page.evaluate((i) => {
    try {
      return document.querySelectorAll('app-landing-demo iframe')[i].contentDocument.body.innerText;
    } catch {
      return '';
    }
  }, n);
const trackX = (page) =>
  page.evaluate(() => {
    const t = getComputedStyle(document.querySelector('app-landing-demo .track')).transform;
    return t === 'none' ? 0 : new DOMMatrix(t).m41;
  });
const box = (page, selector) => page.locator(selector).first().boundingBox();

/** Contrast of every text on the page and inside the frames, as [ratio, needed, text, colours]. */
async function contrastFailures(page, withFrames) {
  return page.evaluate(async (withFrames) => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([^)]+)\)/) ?? c.match(/color\(srgb ([^)]+)\)/);
      if (!m) return null;
      const n = m[1]
        .split(/[ ,/]+/)
        .filter(Boolean)
        .map(Number);
      const scale = c.startsWith('color(') ? 255 : 1;
      return [n[0] * scale, n[1] * scale, n[2] * scale, n[3] ?? 1];
    };
    const lum = ([r, g, b]) => {
      const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const mix = (top, under) => {
      const a = top[3];
      return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1);
    };
    const check = (doc, label, pageBg) => {
      const win = doc.defaultView;
      const out = [];
      const walker = doc.createTreeWalker(
        doc.querySelector('.canvas') ?? doc.body,
        NodeFilter.SHOW_TEXT,
      );
      const seen = new Set();
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent.trim()) continue;
        const el = node.parentElement;
        if (!el || seen.has(el)) continue;
        seen.add(el);
        const style = win.getComputedStyle(el);
        if (!el.checkVisibility({checkOpacity: true, checkVisibilityCSS: true})) continue;
        let opacity = 1;
        let hiddenByOpacity = false;
        const layers = [];
        for (let e = el; e; e = e.parentElement) {
          const cs = win.getComputedStyle(e);
          opacity *= Number(cs.opacity);
          if (Number(cs.opacity) === 0) hiddenByOpacity = true;
          const bg = parse(cs.backgroundColor);
          if (bg && bg[3] > 0) layers.push(bg);
          if (cs.backgroundImage !== 'none' && !cs.backgroundImage.includes('gradient('))
            layers.push('image');
          if (bg && bg[3] === 1) break;
        }
        if (hiddenByOpacity) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (layers.includes('image')) continue;
        let under = pageBg;
        for (const layer of layers.reverse()) under = mix(layer, under);
        const fg = parse(style.color);
        if (!fg) continue;
        const text = mix([fg[0], fg[1], fg[2], fg[3] * opacity], under);
        const [l1, l2] = [lum(text), lum(under)].sort((a, b) => b - a);
        const ratio = (l1 + 0.05) / (l2 + 0.05);
        const size = parseFloat(style.fontSize);
        const bold = Number(style.fontWeight) >= 700;
        const large = size >= 24 || (bold && size >= 18.66);
        const needed = large ? 3 : 4.5;
        if (ratio < needed) {
          out.push([
            ratio.toFixed(2),
            needed,
            `${label}: ${node.textContent.trim().slice(0, 40)}`,
            style.color,
          ]);
        }
      }
      return out;
    };
    const dark = document.documentElement.classList.contains('dark');
    const pageBg = dark ? [22, 19, 26, 1] : [251, 248, 243, 1];
    let failures = check(document, 'page', pageBg);
    for (const [i, frame] of withFrames
      ? [...document.querySelectorAll('app-landing-demo iframe')].entries()
      : []) {
      try {
        // Show every slide of the deck in turn: the contrast of each one counts.
        for (let n = 1; n <= 10; n++) {
          frame.contentWindow.location.hash = `#/${n}`;
          await new Promise((done) => setTimeout(done, 350));
          const canvasBg = dark ? [22, 19, 26, 1] : [251, 248, 243, 1];
          failures = failures.concat(
            check(frame.contentDocument, `frame ${i + 1} slide ${n}`, canvasBg),
          );
        }
      } catch {
        failures.push(['0', 0, `frame ${i + 1} is not reachable`, '']);
      }
    }
    return failures;
  }, withFrames);
}

// 1. The demo, at desktop width in light mode.
{
  const {context, page, errors} = await open({
    viewport: {width: 1440, height: 900},
    colorScheme: 'light',
  });
  check((await page.locator('h1').innerText()) === 'slide.ng', 'the page has the slide.ng heading');
  check(
    (await page.getByText('Presentation slides for Angular developers').count()) > 0,
    'the tagline is there',
  );
  for (const name of ['Get Started', 'Why']) {
    check(
      (await page.getByRole('link', {name, exact: true}).count()) === 1,
      `the "${name}" button is there`,
    );
  }
  check(
    (await page.locator('.mx-auto aside, app-sidebar').count()) === 0,
    'the home page has no docs sidebar',
  );

  // The composition: a window of at least 450 px, the card in 16:9 over its bottom right corner.
  const editor = await box(page, 'app-landing-demo .demo-editor');
  const card = await box(page, 'app-landing-demo .slide-card');
  check(editor.height >= 449, `the editor window is at least 450 px high (${editor.height})`);
  check(Math.abs(card.width / card.height - 16 / 9) < 0.02, 'the slide card is 16:9');
  check(
    Math.abs(card.x + card.width - (editor.x + editor.width) - 80) < 2,
    'the card sticks out 5rem to the right',
  );
  check(
    card.y < editor.y + editor.height && card.y > editor.y + editor.height / 2,
    'the card overlaps the editor bottom',
  );
  const dots = await page.evaluate(() => {
    const s = getComputedStyle(document.querySelector('app-landing-demo .demo-editor'), '::after');
    return {
      content: s.content,
      radius: getComputedStyle(document.querySelector('app-landing-demo .demo-editor'))
        .borderRadius,
    };
  });
  check(
    dots.content === '""' && dots.radius === '7px',
    'the window has its three dots and 7 px corners',
  );
  const cols = await page.evaluate(() => {
    const el = document.querySelector('app-home > div');
    return getComputedStyle(el).gridTemplateColumns.split(' ').map(parseFloat);
  });
  check(
    cols.length === 2 && Math.abs(cols[0] / cols[1] - 3 / 4) < 0.02,
    `the grid is 3fr 4fr (${cols.join(' ')})`,
  );

  check(
    await until(async () => (await editorText(page)).length > 20, 8000),
    'the editor starts typing',
  );
  const first = (await editorText(page)).length;
  await sleep(1000);
  const typed = (await editorText(page)).length - first;
  check(typed >= 12 && typed <= 28, `typing speed is about 50 ms a character (${typed} in 1 s)`);

  // The first page follows the typing: slide 1 (title), 2 (subtitle), 3 center, 4 cover, 5 background.
  await page.evaluate(() => {
    window.__seen = [new Set(), new Set()];
    setInterval(() => {
      document.querySelectorAll('app-landing-demo iframe').forEach((frame, i) => {
        const hash = /^#\/(\d+)/.exec(frame.contentWindow.location.hash);
        if (hash && frame.classList.contains('shown')) window.__seen[i].add(Number(hash[1]));
      });
    }, 25);
  });
  check(
    await until(async () => (await frameSlide(page, 0)) === 5, 30000),
    'page 1 of the card reaches the cover with its background',
  );
  check(
    await until(async () => (await frameText(page, 0)).includes('Welcome to slide.ng!'), 3000),
    'the card shows the typed title',
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-cover.png')});
  check(
    await until(async () => (await trackX(page)) < -300, 15000),
    'the card turns to page 2 while the bullets are typed',
  );
  check(
    await until(async () => (await frameSlide(page, 1)) === 10, 20000),
    'page 2 reaches the third bullet',
  );
  check(
    (await frameText(page, 1)).includes('Read the docs to learn more!'),
    'page 2 shows the three bullets',
  );
  check(
    await until(async () => (await editorText(page)).trim() === source.trim(), 20000, 250),
    'the editor ends with the whole of slides.md',
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-page2.png')});
  check(
    await until(async () => (await trackX(page)) > -5, 15000),
    'the card turns back to the cover at the end',
  );
  const seen = await page.evaluate(() => window.__seen.map((set) => [...set]));
  for (const n of [1, 2, 3, 4, 5])
    check(seen[0].includes(n), `page 1 showed slide ${n} of the deck`);
  for (const n of [6, 7, 8, 9, 10])
    check(seen[1].includes(n), `page 2 showed slide ${n} of the deck`);
  check(
    await until(
      async () => (await page.getByRole('button', {name: 'Replay the demo'}).count()) === 1,
      3000,
    ),
    'the replay icon is there once the typing is done',
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-end.png')});

  // The page buttons: reachable by keyboard, named, and they turn the card.
  const next = page.getByRole('button', {name: 'Next page'});
  const prev = page.getByRole('button', {name: 'Previous page'});
  check(
    (await prev.isDisabled()) && !(await next.isDisabled()),
    'previous is disabled on page 1, next is not',
  );
  await next.focus();
  check(
    await next.evaluate((el) => el === document.activeElement),
    'the page buttons take the keyboard focus',
  );
  check(
    await until(
      async () =>
        Number(
          await page
            .locator('app-landing-demo .chevrons')
            .evaluate((el) => getComputedStyle(el).opacity),
        ) === 1,
      1500,
    ),
    'the buttons show while focused',
  );
  await page.keyboard.press('Enter');
  check(await until(async () => (await trackX(page)) < -300, 3000), 'next turns to page 2');
  await prev.click();
  check(await until(async () => (await trackX(page)) > -5, 3000), 'previous turns back');

  // Replay starts again from an empty file.
  await page.getByRole('button', {name: 'Replay the demo'}).click();
  check((await editorText(page)).trim().length < 10, 'replay clears the editor');
  check(await until(async () => (await editorText(page)).length > 10, 5000), 'replay types again');
  check(errors.length === 0, `no console errors (${errors.join('; ') || 'none'})`);
  await context.close();
}

// 2. Reduced motion: the final state at once.
{
  const {context, page, errors} = await open({
    viewport: {width: 1440, height: 900},
    reducedMotion: 'reduce',
  });
  const full = await until(async () => (await editorText(page)).trim() === source.trim(), 5000);
  check(full, 'with reduced motion the whole text is there at once');
  check(
    await until(async () => (await frameSlide(page, 0)) === 5, 5000),
    'the card shows the cover with its background',
  );
  check(
    await until(async () => (await frameSlide(page, 1)) === 10, 5000),
    'page 2 has its three bullets',
  );
  check((await trackX(page)) === 0, 'the card is on page 1');
  check(
    (await page.getByRole('button', {name: 'Replay the demo'}).count()) === 1,
    'the replay icon is there',
  );
  const motion = await page.evaluate(() => ({
    track: getComputedStyle(document.querySelector('app-landing-demo .track')).transitionDuration,
    caret: getComputedStyle(document.querySelector('app-landing-demo .caret')).animationName,
  }));
  check(
    motion.track === '0s' && motion.caret === 'none',
    `no motion is left (${JSON.stringify(motion)})`,
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-reduced-motion.png')});
  check(
    errors.length === 0,
    `no console errors with reduced motion (${errors.join('; ') || 'none'})`,
  );
  await context.close();
}

// 3. Contrast, in both colour schemes, on the home page and on a docs page.
for (const colorScheme of ['light', 'dark']) {
  for (const path of ['', 'getting-started/install', 'built-in/layouts']) {
    const {context, page} = await open(
      {viewport: {width: 1440, height: 900}, colorScheme, reducedMotion: 'reduce'},
      path,
    );
    await sleep(800);
    const failed = await contrastFailures(page, path === '');
    check(
      failed.length === 0,
      `contrast of /${path} in ${colorScheme} mode (${
        failed
          .slice(0, 6)
          .map((f) => f.join(' '))
          .join(' | ') || 'all pass'
      })`,
    );
    await context.close();
  }
}

// 4. Screenshots at four widths in both colour schemes, at several moments of the typing.
const sizes = [
  ['1440', {width: 1440, height: 900}],
  ['1024', {width: 1024, height: 900}],
  ['820', {width: 820, height: 1180}],
  ['390', {width: 390, height: 844}],
];
const moments = [
  ['early', 'Presentation slides'],
  ['page1-center', 'layout: center'],
  ['cover', 'background: /demo-cover.svg'],
  ['page2-typing', '- 🌈 Themes, code'],
];
for (const [name, viewport] of sizes) {
  for (const colorScheme of ['light', 'dark']) {
    const {context, page, errors} = await open({
      viewport,
      colorScheme,
      hasTouch: viewport.width < 600,
    });
    await page.locator('app-landing-demo').scrollIntoViewIfNeeded();
    if (viewport.width < 1280)
      await page.evaluate(() =>
        document.querySelector('app-landing-demo').scrollIntoView({block: 'start'}),
      );
    for (const [moment, marker] of moments) {
      const reached = await until(async () => (await editorText(page)).includes(marker), 40000, 50);
      check(reached, `${name} ${colorScheme}: the typing reaches "${marker}"`);
      await sleep(moment === 'cover' ? 1400 : 700);
      await page.screenshot({path: join(outDir, `${name}-${colorScheme}-${moment}.png`)});
    }
    await until(
      async () => (await page.getByRole('button', {name: 'Replay the demo'}).count()) === 1,
      20000,
    );
    await sleep(800);
    await page.screenshot({path: join(outDir, `${name}-${colorScheme}-finished.png`)});
    await page.screenshot({path: join(outDir, `${name}-${colorScheme}-full.png`), fullPage: true});
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    check(overflow <= 0, `${name} ${colorScheme}: no horizontal scroll (${overflow}px)`);
    check(
      errors.length === 0,
      `${name} ${colorScheme}: no console errors (${errors.join('; ') || 'none'})`,
    );
    await context.close();
  }
}

await browser.close();
server?.close();
console.log(`\nScreenshots in ${outDir}`);
if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log('\nAll checks passed.');
