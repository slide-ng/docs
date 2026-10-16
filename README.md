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

`npm install` does not work with the scaffold's `overrides` (npm 10 stops with `Unable to resolve reference $vitest`), so the repository uses pnpm.

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

The site must be served from the root of a host (`https://docs.example.org/`, not `https://example.org/slide.ng-docs/`). NgMd writes absolute paths and has no base path option. The deploy workflow publishes to GitHub Pages: use a custom domain, or an organisation site named `<org>.github.io`. Set `site.url` in `src/ngmd.config.ts` to the real address so the sitemap and the social tags are right.

## Writing

`CONTRIBUTING.md` is the writing guide: voice, how a page is built, how samples are checked.

## Licence

MIT, see `LICENSE`.
