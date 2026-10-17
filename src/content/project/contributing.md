---
title: Contributing
description: How to work on slide.ng, its themes and these docs.
---

# Contributing

slide.ng is MIT licensed and has three repositories: the tool itself, the official themes and these docs. Small changes with a test are the easiest to review.

## slide.ng

```sh
git clone https://github.com/slide-ng/slide.ng.git
cd slide.ng
npm install
```

Node 22.22.3 or newer. The tests use Chromium through `playwright-core`. Set `CHROME_PATH` if it is not at the default location.

```sh
npm test             # unit tests: the generator, code and math handling, the click engine, shortcuts, transitions
npm run test:e2e     # builds the starter deck and the feature decks and checks them in a real browser
npm run test:dev     # starts the dev server: live updates, slide-ng-drag write-back, drawings, side editor
npm run test:export  # the command line: export, build, themes, create, the MCP server, offline
```

Run the suites one after the other. The unit tests and a build share `src/slides/generated`, so running them at the same time breaks both.

Three documents in the repository explain it: `docs/ARCHITECTURE.md` for how it works, `docs/DECISIONS.md` for why things are the way they are, and `docs/PARITY.md` for the comparison with Slidev row by row.

## Themes

Each official theme is a package in the slide-ng/themes repository. A new theme needs a package folder with `theme.json`, layouts and CSS, a README that credits the original author, an example deck with a slide for every layout, and a test. Do not copy images or fonts that are not MIT or compatible, such as CC BY-NC-SA assets. Draw it in CSS or leave it out. See [Writing a theme](../customize/writing-a-theme.md).

## These docs

The docs are an [NgMd](https://ngmd.netlify.app) site. Pages are markdown files under `src/content/`, and the sidebar is the `nav` list in `src/ngmd.config.ts`.

```sh
pnpm install
pnpm run build       # also checks every internal link and heading anchor
pnpm run dev
```

The repository's `CONTRIBUTING.md` has the writing guide: voice, how a page is structured, how code samples are checked, and how the live decks are rebuilt. The short version:

- Say what the code does. No marketing words.
- Every claim and every code sample is checked against the source.
- Say plainly what is missing.

## Reporting problems

Open an issue in the repository that has the problem. For a security problem, see [Security](./security.md).
