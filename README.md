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
pnpm run check:landing # opens the built home page in Chromium and checks the live demo
pnpm test             # unit tests of the authoring components
pnpm run format:check
```

pnpm is what the lockfile and CI use. `npm install` works too: the `overrides` in `package.json` are literal version ranges.

## How the site is made

- Pages are markdown files under `src/content/`. The path is the URL.
- The sidebar, header links and the site's name and URL are in `src/ngmd.config.ts`.
- The home page is `src/app/pages/index.page.ts`. It has no sidebar. Its live demo (`src/app/landing/`) types out `demos/landing/slides.md` and shows the built slides next to it. See "The landing demo" below.
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

## The landing demo

The home page copies the hero demo of Slidev's own site: an editor window that types a deck, and a slide card over its bottom right corner that shows the real slides as they take shape. The card has two pages side by side, and turns from the first to the second while the bullets are typed.

- `src/app/landing/choreography.ts` is the script: a list of steps (type, move, delete, pause, exec) run by the small engine in `steps.ts`, with the timings of Slidev's demo. Its `exec` steps say when the slide changes.
- `demos/landing/slides.md` is the whole text the script types. `pnpm test` fails if the script types anything else, byte for byte. The text has no `v-` tags.
- The slides are real slide.ng output. `scripts/landing-stages.mjs` replays the script, takes the markdown at each moment and writes one deck with a slide for every moment (title, title and subtitle, `layout: center`, `cover`, with the background, page 2 empty, its title, one, two and three bullets). `demos/landing/public/` and `demos/landing/styles/` (the cover picture, an SVG made for this site, and the brand colours) go into it. The card shows slide N of that deck in a frame of the design size (980 wide), scaled to the card, so its text is as large relative to the card as in Slidev.
- With `prefers-reduced-motion` the whole text and the last state are shown at once.

After you change the script, `demos/landing/slides.md`, the cover or the styles, run:

```sh
SLIDE_NG_DIR=../slide.ng pnpm run demos landing --write-source
```

`--write-source` writes `slides.md` from the script first. The build goes to `public/demos/landing/` (one deck of about 500 KB, loaded twice by the page from the same address, so the browser fetches it once) with a fingerprint next to it; `pnpm test` fails if the fingerprint is out of date.

`pnpm run check:landing` opens the built site in Chromium (it needs `playwright-core` and a Chromium, see the top of `scripts/check-landing.mjs`), checks the demo, the keyboard access and the contrast of every text (WCAG AA), and writes screenshots to `tmp/landing-shots/`.

## Brand

The palette (orange, bright orange, deep orange, slide edge, ink, paper, cream, sand) is in `src/styles.css` as `--slideng-*` tokens, mapped to the site's variables in light and dark mode; the grey scale of the components is the warm paper and ink scale. Orange (#CC4209) reaches 4.56:1 on paper and is used for the logo, headings and icons; on dark the bright orange (#E5541A, 4.92:1 on ink) takes its place. Small text on sand and button backgrounds use the deep orange.

The logo files come from the official slide.ng logo kit: `public/brand/` (mark and lockups, light and dark), `public/favicon.ico`, `public/favicon.svg`, `public/icons/` (app icons and apple-touch-icon), `public/site.webmanifest` and `public/og.png` (the 1280x640 social preview). The wordmark is Space Grotesk Bold, outlined in the SVGs, so the site loads no font for it. The shield is original artwork. slide.ng is a community project, not affiliated with the Angular team.

## Hosting

The site is built for the root of a host (`https://docs.example.org/`) by default. To serve it from a sub-path, for example a GitHub Pages project site at `https://slide-ng.github.io/slide.ng-docs/`, set `site.base` in `src/ngmd.config.ts` or build with the environment variable, which wins over the config:

```sh
NGMD_BASE=/slide.ng-docs/ pnpm run build
NGMD_BASE=/slide.ng-docs/ pnpm run check:dist
```

The base is written into `<base href>`, the router, the links and images in the pages, the sitemap and the embedded decks (`demos-base.plugin.ts` puts the base in front of the deck addresses, so the committed decks need no rebuild). Set `site.url` to the origin, without the sub-path, so the sitemap and the social tags are right. The deploy workflow publishes to GitHub Pages.

### Cloudflare Pages (slide-ng.dev)

In the Cloudflare dashboard: Workers & Pages, Create, Pages, Connect to Git, pick this repository, then:

| Setting                | Value                |
| ---------------------- | -------------------- |
| Production branch      | `main`               |
| Build command          | `pnpm run build`     |
| Build output directory | `dist/analog/public` |
| Root directory         | (empty)              |

`.node-version` picks Node 22 and the lockfile picks pnpm. After the first deploy, add the custom domain `slide-ng.dev` in the project's Custom domains tab. `public/_headers` sets the cache and security headers, and the build writes a `404.html` that Pages serves for unknown addresses.

## Writing

`CONTRIBUTING.md` is the writing guide: voice, how a page is built, how samples are checked.

## Maintainers

<!-- prettier-ignore-start -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/erkamyaman"><img src="https://avatars.githubusercontent.com/u/88717125?v=4&s=100" width="100px;" alt="Erkam Yaman"/><br /><sub><b>Erkam Yaman</b></sub></a><br /><sub>Maintainer</sub></td>
    </tr>
  </tbody>
</table>
<!-- prettier-ignore-end -->

## Contributors

Thanks to everyone who has helped. This project follows the [all-contributors](https://allcontributors.org) specification. Contributions of any kind welcome!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/erkamyaman"><img src="https://avatars.githubusercontent.com/u/88717125?v=4?s=100" width="100px;" alt="Erkam Yaman"/><br /><sub><b>Erkam Yaman</b></sub></a><br /><a href="https://github.com/slide-ng/slide.ng-docs/commits?author=erkamyaman" title="Code">💻</a> <a href="https://github.com/slide-ng/slide.ng-docs/commits?author=erkamyaman" title="Documentation">📖</a> <a href="#infra-erkamyaman" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-erkamyaman" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Sponsors

The slide.ng documentation is free and open source. If it helps your work, please consider sponsoring it. Your support keeps development going.

<p>
  <a href="https://github.com/sponsors/erkamyaman"><img src="https://img.shields.io/badge/Sponsor-%E2%9D%A4-db61a2?logo=githubsponsors&logoColor=white" alt="Sponsor on GitHub" /></a>
</p>

## Licence

MIT, see `LICENSE`.
