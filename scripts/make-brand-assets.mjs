// Renders the raster brand files in public/ from the SVGs there, with Chromium (playwright-core):
//
//   node scripts/make-brand-assets.mjs
//
// favicon-32.png, favicon-192.png, favicon-512.png, apple-touch-icon.png, favicon.ico and og.png.
// The OG image's tagline is set in Inter when the machine has it. Run it again after the logo changes.
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright-core';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const svg = (name) => readFileSync(join(pub, name), 'utf8');
const dataUri = (name) => `data:image/svg+xml;base64,${Buffer.from(svg(name)).toString('base64')}`;

const browsers = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
const dir = readdirSync(browsers).find((d) => d.startsWith('chromium-'));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? join(browsers, dir, 'chrome-linux', 'chrome'),
});

async function render(html, width, height, file, transparent = false) {
  const page = await browser.newPage({viewport: {width, height}});
  await page.setContent(html);
  const buffer = await page.screenshot({omitBackground: transparent});
  writeFileSync(join(pub, file), buffer);
  await page.close();
  return buffer;
}

const mark = dataUri('logo-mark.svg');
const icon = (size, pad = 0, bg = 'transparent') =>
  `<body style="margin:0;background:${bg};width:${size}px;height:${size}px;display:grid;place-items:center">` +
  `<img src="${mark}" style="width:${size - pad * 2}px;height:${size - pad * 2}px"></body>`;

const small = await render(icon(32), 32, 32, 'favicon-32.png', true);
await render(icon(192), 192, 192, 'favicon-192.png', true);
await render(icon(512), 512, 512, 'favicon-512.png', true);
await render(icon(180, 22, '#FBF8F3'), 180, 180, 'apple-touch-icon.png');
const ico48 = await render(icon(48), 48, 48, 'favicon-48.png', true);

// favicon.ico: two PNG images (32 and 48), the format every current browser reads.
const images = [
  [32, small],
  [48, ico48],
];
const head = Buffer.alloc(6 + 16 * images.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(images.length, 4);
let offset = head.length;
images.forEach(([size, png], i) => {
  const at = 6 + 16 * i;
  head.writeUInt8(size, at);
  head.writeUInt8(size, at + 1);
  head.writeUInt16LE(1, at + 4);
  head.writeUInt16LE(32, at + 6);
  head.writeUInt32LE(png.length, at + 8);
  head.writeUInt32LE(offset, at + 12);
  offset += png.length;
});
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([head, ...images.map(([, png]) => png)]));
import {rmSync} from 'node:fs';
rmSync(join(pub, 'favicon-48.png'));

await render(
  `<body style="margin:0;width:1200px;height:630px;background:#16131A;position:relative;overflow:hidden;font-family:Inter,system-ui,sans-serif">
     <div style="position:absolute;right:-120px;top:-160px;width:620px;height:620px;border-radius:50%;background:#211D27"></div>
     <div style="position:absolute;left:84px;top:150px;display:flex;align-items:center;gap:56px">
       <img src="${mark}" style="width:260px;height:260px">
       <div>
         <img src="${dataUri('logo-title-dark.svg')}" style="width:560px;display:block">
         <div style="margin-top:34px;font-size:38px;line-height:1.3;color:#C9C4CF;font-weight:500">Presentation slides<br>for Angular developers</div>
       </div>
     </div>
     <div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:#D9480F"></div>
   </body>`,
  1200,
  630,
  'og.png',
);
await browser.close();
console.log('brand files written to public/');
