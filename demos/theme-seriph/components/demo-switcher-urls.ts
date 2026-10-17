// Where the sibling theme demos are, worked out from the address of the page. No Angular here, so a plain test can import it.
export const THEMES = ['adev', 'seriph', 'shibainu', 'bricks', 'apple-basic'];

export interface DemoSite {
  /** The theme this page shows. */
  theme: string;
  /** The address of another theme's demo, on the same site. */
  url: (name: string) => string;
}

/**
 * GitHub Pages: `/<repo>/<name>/`, the siblings are `../<name>/`.
 * slide-ng.dev: `/demos/theme-<name>/`, the siblings are `/demos/theme-<name>/`.
 * Anything else (a dev server, a fork) is not a place the switcher knows: null.
 */
export function detectSite(pathname: string): DemoSite | null {
  const docs = /\/demos\/theme-([a-z-]+)\//.exec(pathname);
  if (docs && THEMES.includes(docs[1])) {
    return { theme: docs[1], url: (name) => `/demos/theme-${name}/` };
  }
  const parts = pathname
    .replace(/index\.html$/, '')
    .split('/')
    .filter(Boolean);
  const last = parts[parts.length - 1];
  if (parts.length > 1 && last !== undefined && THEMES.includes(last)) {
    return { theme: last, url: (name) => `../${name}/` };
  }
  return null;
}

/** The address to open for `name`, keeping the slide number (`#/N`, the hash router of both sites). */
export function demoUrl(site: DemoSite, name: string, slide: number): string {
  const no = Number.isInteger(slide) && slide > 1 ? slide : 1;
  return `${site.url(name)}#/${no}`;
}
