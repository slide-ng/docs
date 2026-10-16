---
title: Install
description: Requirements and how to get slide.ng running today.
---

# Install

## Requirements

- Node 22.22.3 or newer. The `engines` field of the package says `>=22.22.3`.
- npm. The repository ships an npm lock file.
- A Chromium, only for `export`, the PDF download button, and the Open Graph picture. slide.ng never downloads a browser: set `CHROME_PATH` or pass `--executable-path`.

## Get slide.ng

<ngmd-callout type="warning" title="Not on npm yet">
  The package is marked private and is not published to a registry. For now you use it from a checkout of the repository. The notes below change when it is published.
</ngmd-callout>

Clone the repository and install its dependencies:

```sh
git clone https://github.com/slide-ng/slide.ng.git
cd slide.ng
npm install
```

The repository contains a deck of its own, `slides.md`, so you can run it straight away:

```sh
npm start          # dev server at http://localhost:4230
npm run build      # production build of that deck in dist/slide-ng/browser
```

`npm start` and `npm run build` are the plain scripts of the repository. The command meant for your own decks is `slide-ng`, described in [The command line](./cli.md).

## Start a deck of your own

From the checkout, make a new deck folder next to it:

```sh
node bin/slide-ng.mjs create ../my-deck
```

[Your first deck](./first-deck.md) shows what to do next.

## Optional: themes

The official themes are separate packages in the slide.ng-themes repository. See [Themes and addons](../customize/themes.md) for how a deck picks one up.
