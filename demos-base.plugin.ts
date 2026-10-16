import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import type {Plugin} from 'vite';
import {normalizeBase} from './src/base.ts';

/**
 * The decks in `public/demos/<name>/` are built once, with `<base href="/demos/<name>/">`.
 * When the site is served from a sub-path, that base points outside the site, so the plugin
 * puts the site base in front of it in the copied HTML files. Without a base it does nothing.
 */
export function rewriteDemoBase(html: string, base: string): string {
  if (base === '/') return html;
  return html.replace(/(<base href=")\/(demos\/[^"]*")/g, `$1${base}$2`);
}

export function demosBasePlugin(opts: {base?: string} = {}): Plugin {
  const base = normalizeBase(opts.base);
  let root = process.cwd();
  return {
    name: 'slide-ng-docs-demos-base',
    apply: 'build',
    configResolved(config) {
      root = config.root;
    },
    closeBundle: {
      order: 'post',
      handler() {
        if (base === '/') return;
        // Each environment (client, server) writes its own output folder.
        const outDir = resolve(root, this.environment.config.build.outDir);
        for (const dir of [outDir, join(outDir, 'public')]) {
          const demos = join(dir, 'demos');
          if (!existsSync(demos)) continue;
          for (const file of htmlFiles(demos)) {
            const html = readFileSync(file, 'utf8');
            const out = rewriteDemoBase(html, base);
            if (out !== html) writeFileSync(file, out);
          }
        }
      },
    },
  };
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}
