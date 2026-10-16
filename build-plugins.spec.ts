import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import type {Plugin} from 'vite';
import {resolveDocLinks} from './md-links.plugin';
import {releaseAfterLastBuild} from './angular-release.plugin';
import {rewriteDemoBase} from './demos-base.plugin';
import {demosDevPlugin} from './demos-dev.plugin';
import {prerenderRoutes} from './plugin-utils';
import {siteHtmlPlugin} from './site-html.plugin';
import {sitemapPlugin} from './sitemap.plugin';

type Hook = (this: unknown, ...args: unknown[]) => unknown;

function call(plugin: Plugin, hook: keyof Plugin, ctx: unknown, ...args: unknown[]): unknown {
  return (plugin[hook] as Hook).call(ctx, ...args);
}

let root: string;

function write(files: Record<string, string>): void {
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), {recursive: true});
    writeFileSync(join(root, path), text);
  }
}

function sitemap(plugin: Plugin): string {
  let xml = '';
  call(plugin, 'configResolved', undefined, {root});
  call(plugin, 'generateBundle', {
    emitFile: (f: {fileName: string; source: string}) => {
      if (f.fileName === 'sitemap.xml') xml = f.source;
    },
  });
  return xml;
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'docs-plugins-'));
  write({
    'src/app/pages/index.page.ts': '',
    'src/app/pages/[...slug].page.ts': '',
    'src/app/pages/api/index.page.ts': '',
    'src/content/guide/index.md': '---\ntitle: Guide\n---\n## Setup\n',
  });
});

afterEach(() => rmSync(root, {recursive: true, force: true}));

describe('sitemapPlugin', () => {
  it('prerenders the empty /api page but leaves it out of the sitemap', () => {
    expect(prerenderRoutes(root)).toContain('/api');
    const xml = sitemap(sitemapPlugin({siteUrl: 'https://example.com'}));
    expect(xml).toContain('<loc>https://example.com/guide</loc>');
    expect(xml).not.toContain('/api');
  });

  it('adds the base to every URL', () => {
    const xml = sitemap(sitemapPlugin({siteUrl: 'https://user.github.io/', base: '/repo/'}));
    const locs = [...xml.matchAll(/<loc>(.*)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toContain('https://user.github.io/repo/guide');
    expect(locs.every((l) => l.startsWith('https://user.github.io/repo/'))).toBe(true);
  });

  it('does not repeat a base that siteUrl already ends with', () => {
    const xml = sitemap(sitemapPlugin({siteUrl: 'https://user.github.io/repo', base: '/repo/'}));
    expect(xml).toContain('<loc>https://user.github.io/repo/guide</loc>');
    expect(xml).not.toContain('/repo/repo');
  });
});

describe('siteHtmlPlugin', () => {
  const site = {name: 'Docs', description: 'd', url: 'https://user.github.io'};
  const html = '<base href="%SITE_BASE%" /><meta content="%SITE_URL%/og.png" />';

  it('sets <base href> and puts the base in the social URLs', () => {
    const plugin = siteHtmlPlugin({...site, base: '/repo/'});
    expect(call(plugin, 'transformIndexHtml', undefined, html)).toBe(
      '<base href="/repo/" /><meta content="https://user.github.io/repo/og.png" />',
    );
  });

  it('defaults to the root', () => {
    expect(call(siteHtmlPlugin(site), 'transformIndexHtml', undefined, html)).toBe(
      '<base href="/" /><meta content="https://user.github.io/og.png" />',
    );
  });
});

describe('resolveDocLinks', () => {
  it('puts the base in front of the route', () => {
    const html = '<a href="./syntax.md#a">a</a>';
    expect(resolveDocLinks(html, '/src/content/guide/code', '/repo/')).toBe(
      '<a href="/repo/guide/syntax#a">a</a>',
    );
  });
});

describe('rewriteDemoBase', () => {
  const html = '<head><base href="/demos/tour/"><script src="main.js"></script></head>';

  it('puts the site base in front of the deck base', () => {
    expect(rewriteDemoBase(html, '/repo/')).toContain('<base href="/repo/demos/tour/">');
  });

  it('leaves the decks alone at the root, and does not rewrite twice', () => {
    expect(rewriteDemoBase(html, '/')).toBe(html);
    const once = rewriteDemoBase(html, '/repo/');
    expect(rewriteDemoBase(once, '/repo/')).toBe(once);
  });
});

describe('releaseAfterLastBuild', () => {
  function fake() {
    const calls: string[] = [];
    const plugin = {
      name: '@analogjs/vite-plugin-angular',
      buildStart: () => void calls.push('start'),
      buildEnd: () => void calls.push('end'),
    } as unknown as Plugin;
    return {calls, plugin};
  }

  it('runs buildEnd once, after the last build that started', async () => {
    const {calls, plugin} = fake();
    const [wrapped] = releaseAfterLastBuild([plugin]) as Plugin[];
    call(wrapped, 'buildStart', {});
    call(wrapped, 'buildStart', {});
    call(wrapped, 'buildEnd', {});
    expect(calls).toEqual(['start', 'start']);
    call(wrapped, 'buildEnd', {});
    expect(calls).toEqual(['start', 'start', 'end']);
  });

  it('runs buildEnd at once for a single build, and finds a plugin behind a promise', async () => {
    const {calls, plugin} = fake();
    const [wrapped] = (await Promise.all(
      releaseAfterLastBuild([Promise.resolve(plugin)]),
    )) as Plugin[];
    call(wrapped, 'buildStart', {});
    call(wrapped, 'buildEnd', {});
    expect(calls).toEqual(['start', 'end']);
  });
});

describe('demosDevPlugin', () => {
  function serve(url: string): string {
    const plugin = demosDevPlugin();
    let handler: (req: {url: string}, res: unknown, next: () => void) => void = () => {};
    const server = {
      config: {publicDir: root},
      middlewares: {use: (fn: typeof handler) => (handler = fn)},
    };
    call(plugin, 'configureServer', null, server);
    const req = {url};
    handler(req, {}, () => {});
    return req.url;
  }

  test('a deck folder address answers with its index.html', () => {
    write({'demos/tour/index.html': '<html></html>'});
    expect(serve('/demos/tour/')).toBe('/demos/tour/index.html');
    expect(serve('/demos/tour/?x=1')).toBe('/demos/tour/index.html');
  });

  test('other addresses are left alone', () => {
    write({'demos/tour/index.html': '<html></html>'});
    expect(serve('/demos/missing/')).toBe('/demos/missing/');
    expect(serve('/guide/')).toBe('/guide/');
  });
});
