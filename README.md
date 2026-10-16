# slide.ng-docs

The documentation website for [slide.ng](https://github.com/slide-ng/slide.ng), a slide deck tool that turns one markdown file into an Angular app. The site is built with [NgMd](https://ngmd.netlify.app).

It covers getting started, a guide, a page for every feature, the built-in reference (layouts, components, directives, shortcuts, CLI, frontmatter keys), customizing (themes, addons, setup hooks), a comparison with Slidev, and live example decks.

## Develop

Node 22.22.3 or newer (see `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm run dev          # http://localhost:5173
pnpm run build        # static site in dist/analog/public, with the link guards
pnpm run check:dist   # checks every internal link, image and script of the built HTML
pnpm test             # unit tests of the authoring components
pnpm run format:check
```

pnpm is what the lockfile and CI use. `npm install` works too: the `overrides` in `package.json` are literal version ranges.

## How the site is made

- Pages are markdown files under `src/content/`. The path is the URL.
- The sidebar, header links and the site's name and URL are in `src/ngmd.config.ts`.
- The home page is `src/app/pages/index.page.ts`.
- `<ngmd-demo src="/demos/starter/" title="..."></ngmd-demo>` embeds a built deck in an iframe. The component is `src/app/ui/demo.ts`.
- NgMd's other authoring components (callouts, cards, tabs, ...) work inline in markdown. See `CONTRIBUTING.md`.

## The live decks

The decks in `demos/<name>/slides.md` are built with the slide.ng command line into `public/demos/<name>/`, and the built files are committed, so building the site needs neither slide.ng nor Chromium.

To rebuild them you need a checkout of slide.ng (with `npm install` done) and, for the theme decks, of slide.ng-themes:

```sh
SLIDE_NG_DIR=../slide.ng SLIDE_NG_THEMES_DIR=../slide.ng-themes pnpm run demos
pnpm run demos tour       # only one deck
```

Rebuild them when slide.ng changes in a way a deck shows.

## Hosting

The site is built for the root of a host (`https://docs.example.org/`) by default. To serve it from a sub-path, for example a GitHub Pages project site at `https://slide-ng.github.io/slide.ng-docs/`, set `site.base` in `src/ngmd.config.ts` or build with the environment variable, which wins over the config:

```sh
NGMD_BASE=/slide.ng-docs/ pnpm run build
NGMD_BASE=/slide.ng-docs/ pnpm run check:dist
```

The base is written into `<base href>`, the router, the links and images in the pages, the sitemap and the embedded decks (`demos-base.plugin.ts` puts the base in front of the deck addresses, so the committed decks need no rebuild). Set `site.url` to the origin, without the sub-path, so the sitemap and the social tags are right. The deploy workflow publishes to GitHub Pages.

## Writing

`CONTRIBUTING.md` is the writing guide: voice, how a page is built, how samples are checked.

## Licence

MIT, see `LICENSE`.
