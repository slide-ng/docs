# slide.ng docs

The documentation website for [slide.ng](https://github.com/slide-ng/slide.ng), a slide deck tool that turns one markdown file into an Angular app. It is live at [slide-ng.dev](https://slide-ng.dev) and built with [NgMd](https://ngmd.netlify.app).

It covers getting started, a guide, a page for every feature, the built-in reference (layouts, components, directives, shortcuts, CLI, frontmatter keys), customizing, a comparison with Slidev, and live example decks.

<p align="center">
  <img alt="Typing a slides.md file while the slides take shape next to it" src="https://raw.githubusercontent.com/slide-ng/slide.ng/main/docs/assets/how-it-works.gif" width="420">
  <br>
  <sub>Type markdown, get slides.</sub>
</p>

## Develop

Node 22.22.3 or newer (see `.nvmrc`) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm run dev          # http://localhost:5173
pnpm run build        # static site in dist/analog/public, with the link guards
pnpm run check:dist   # checks every internal link, image and script of the built HTML
pnpm run check:landing # opens the built home page in Chromium and checks the live demo
pnpm test             # unit tests
pnpm run format:check
```

## How the site is made

- Pages are markdown files under `src/content/`. The path is the URL.
- The sidebar, header links and the site's name and URL are in `src/ngmd.config.ts`.
- The home page is `src/app/pages/index.page.ts`; its live demo is in `src/app/landing/`.
- `<ngmd-demo src="/demos/starter/" title="..."></ngmd-demo>` embeds a built deck in an iframe. Besides paths of this site it embeds addresses on `slide-ng.github.io`, in a sandboxed frame.
- The Resources menu in the header and the Resources section of the sidebar lead to the showcases, the theme gallery, the starter and the live demos (`src/content/resources/`). The showcase pages are generated from `showcases.json` of the slide-ng/showcases repository and committed:

```sh
SLIDE_NG_SHOWCASES_DIR=../slide.ng-showcases pnpm run showcases
```

- The decks in `demos/<name>/slides.md` are built with the slide.ng CLI into `public/demos/<name>/` and the built files are committed, so building the site needs neither slide.ng nor Chromium. To rebuild them, check out slide.ng (and slide-ng/themes for the theme decks):

```sh
SLIDE_NG_DIR=../slide.ng SLIDE_NG_THEMES_DIR=../themes pnpm run demos
```

## Hosting

The site is built for the root of a host by default. For a sub-path, set `site.base` in `src/ngmd.config.ts` or build with `NGMD_BASE=/docs/ pnpm run build`. The production site (slide-ng.dev) is on Cloudflare with build command `pnpm run build` and deploy command `npx wrangler deploy`; `wrangler.jsonc` serves `dist/analog/public` and the 404 page. The deploy workflow publishes to GitHub Pages.

## Contributing

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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/erkamyaman"><img src="https://avatars.githubusercontent.com/u/88717125?v=4?s=100" width="100px;" alt="Erkam Yaman"/><br /><sub><b>Erkam Yaman</b></sub></a><br /><a href="https://github.com/slide-ng/docs/commits?author=erkamyaman" title="Code">💻</a> <a href="https://github.com/slide-ng/docs/commits?author=erkamyaman" title="Documentation">📖</a> <a href="#infra-erkamyaman" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-erkamyaman" title="Maintenance">🚧</a></td>
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
