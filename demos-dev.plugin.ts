import {existsSync} from 'node:fs';
import {join} from 'node:path';
import type {Plugin} from 'vite';

/** In the dev server, a folder address like `/demos/landing/` answers with that deck's `index.html`. */
export function demosDevPlugin(): Plugin {
  return {
    name: 'slide-ng-docs-demos-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = (req.url ?? '').split('?')[0];
        if (
          /^\/demos\/[^/]+\/$/.test(path) &&
          existsSync(join(server.config.publicDir, path, 'index.html'))
        ) {
          req.url = `${path}index.html`;
        }
        next();
      });
    },
  };
}
