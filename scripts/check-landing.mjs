// Opens the home page in Chromium and checks the live demo, then takes screenshots.
//
//   node scripts/check-landing.mjs [--url http://localhost:5173/] [--out tmp/landing-shots]
//
// Without --url it serves dist/analog/public (run "pnpm run build" first). It needs playwright-core and a
// Chromium: PLAYWRIGHT_BROWSERS_PATH (default /opt/pw-browsers) or CHROMIUM_PATH.
//
// What it checks: the page loads without console errors, the editor types, the frame goes to slide 2 and
// shows it, pause and replay work, a click on the frame takes over and stops the typing, and with
// prefers-reduced-motion the whole text is there at once. Screenshots at 1440, 820 and 390 px wide, in
// light and dark mode, go to --out.
import {createServer} from 'node:http';
import {existsSync, mkdirSync, readFileSync, statSync} from 'node:fs';
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

const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH});
const source = readFileSync(join(root, 'demos', 'landing', 'slides.md'), 'utf8');

async function open(options) {
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
  await page.goto(url, {waitUntil: 'load'});
  return {context, page, errors};
}

const frameHash = (page) =>
  page.evaluate(() => {
    try {
      return document.querySelector('app-demo-frame iframe').contentWindow.location.hash;
    } catch {
      return 'blocked';
    }
  });
// The text of the editor, line by line (a line is one <span> of the code element).
const editorText = (page) =>
  page
    .locator('app-demo-editor code')
    .evaluate((el) => [...el.children].map((line) => line.textContent).join('\n'));
const frameText = (page) =>
  page.evaluate(() => {
    try {
      return document.querySelector('app-demo-frame iframe').contentDocument.body.innerText;
    } catch {
      return '';
    }
  });

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

  check(
    await until(async () => (await editorText(page)).length > 20, 8000),
    'the editor starts typing',
  );
  const first = (await editorText(page)).length;
  await sleep(1000);
  const typed = (await editorText(page)).length - first;
  check(typed >= 12 && typed <= 28, `typing speed is about 40-50 ms a character (${typed} in 1 s)`);

  const reached = await until(async () => (await frameHash(page)).startsWith('#/2'), 45000);
  check(reached, 'the frame goes to slide 2 while the markdown is typed');
  check(
    await until(async () => (await frameText(page)).includes('Markdown in'), 5000),
    'the frame shows the text of slide 2',
  );
  check(
    await until(
      async () =>
        (await frameHash(page)).includes('/2?clicks=3') ||
        (await frameText(page)).includes('static site'),
      15000,
    ),
    'the bullets of slide 2 appear one click at a time',
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-slide2.png')});

  // Pause stops the text, resume goes on.
  await page.getByRole('button', {name: 'Pause typing'}).click();
  const paused = await editorText(page);
  await sleep(1500);
  check((await editorText(page)) === paused, 'pause stops the typing');
  await page.getByRole('button', {name: 'Resume typing'}).click();
  check(
    await until(async () => (await editorText(page)).length > paused.length, 4000),
    'resume goes on',
  );

  // Replay starts again from an empty file.
  await page.getByRole('button', {name: 'Replay'}).click();
  check((await editorText(page)).trim().length < 10, 'replay clears the editor');
  check(await until(async () => (await editorText(page)).length > 10, 5000), 'replay types again');

  // Clicking the frame takes over.
  await page.locator('app-demo-frame .landing-cover').click();
  const stopped = await editorText(page);
  await sleep(1500);
  check((await editorText(page)) === stopped, 'a click on the frame stops the typing');
  check(
    (await page.locator('app-demo-frame .landing-cover').count()) === 0,
    'the frame is interactive after the click',
  );
  check(
    (await page.getByText('They are yours now').count()) === 1,
    "the page says the slides are the visitor's now",
  );

  // Run the demo to the end and look at the whole thing in one screenshot.
  await page.getByRole('button', {name: 'Replay'}).click();
  const done = await until(
    async () => (await editorText(page)).trim() === source.trim(),
    90000,
    500,
  );
  check(done, 'the editor ends with the whole of slides.md');
  check(
    await until(async () => (await frameHash(page)).startsWith('#/5'), 8000),
    'the frame ends on the last slide',
  );
  await page.screenshot({path: join(outDir, 'desktop-1440-light-end.png'), fullPage: true});
  check(errors.length === 0, `no console errors (${errors.join('; ') || 'none'})`);
  await context.close();
}

// 2. Reduced motion: the whole text at once.
{
  const {context, page, errors} = await open({
    viewport: {width: 1440, height: 900},
    reducedMotion: 'reduce',
  });
  const full = await until(async () => (await editorText(page)).trim() === source.trim(), 5000);
  check(full, 'with reduced motion the whole text is there at once');
  check(
    errors.length === 0,
    `no console errors with reduced motion (${errors.join('; ') || 'none'})`,
  );
  await context.close();
}

// 3. Screenshots at three widths in both colour schemes, while the demo is on slide 3.
const sizes = [
  ['desktop-1440', {width: 1440, height: 900}],
  ['tablet-820', {width: 820, height: 1180}],
  ['mobile-390', {width: 390, height: 844}],
];
for (const [name, viewport] of sizes) {
  for (const colorScheme of ['light', 'dark']) {
    const {context, page, errors} = await open({
      viewport,
      colorScheme,
      hasTouch: viewport.width < 600,
    });
    await page.locator('app-landing-demo').scrollIntoViewIfNeeded();
    const reached3 = await until(async () => (await frameHash(page)).startsWith('#/3'), 60000);
    check(reached3, `${name} ${colorScheme}: the demo reaches slide 3`);
    await sleep(1800);
    await page.screenshot({path: join(outDir, `${name}-${colorScheme}-top.png`)});
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
