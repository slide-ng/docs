import type {Plugin} from 'vite';

/**
 * Keeps the client and the server build from clearing each other's Angular output.
 *
 * `@analogjs/vite-plugin-angular` keeps the compiled components of a build in one shared map
 * and empties it in `buildEnd`. The client and the server build run side by side, so when one
 * is done while the other is still transforming files, the other finds no compiled output for
 * the files it has not reached yet. Those components are then bundled uncompiled, and the
 * browser stops with "JIT compiler unavailable". The files that come last are the lazy page
 * chunks, so the home page was the one that broke, and only some of the time.
 *
 * This makes `buildEnd` run once, when the last of the builds that have started is done.
 */
export function releaseAfterLastBuild<T>(plugins: T): T {
  if (Array.isArray(plugins)) return plugins.map((p) => releaseAfterLastBuild(p)) as T;
  // Vite accepts a promise of a plugin anywhere in the list.
  if (plugins && typeof (plugins as {then?: unknown}).then === 'function') {
    return (plugins as unknown as Promise<unknown>).then((p) => releaseAfterLastBuild(p)) as T;
  }
  const plugin = plugins as Plugin | null;
  if (plugin?.name !== '@analogjs/vite-plugin-angular') return plugins;
  const start = plugin.buildStart;
  const end = plugin.buildEnd;
  if (typeof start !== 'function' || typeof end !== 'function') return plugins;
  let started = 0;
  let ended = 0;
  plugin.buildStart = function (this: unknown, ...args: unknown[]) {
    started++;
    return (start as (...a: unknown[]) => unknown).apply(this, args);
  } as Plugin['buildStart'];
  plugin.buildEnd = function (this: unknown, ...args: unknown[]) {
    ended++;
    if (ended < started) return;
    return (end as (...a: unknown[]) => unknown).apply(this, args);
  } as Plugin['buildEnd'];
  return plugins;
}
