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

Make a new deck folder with the published package:

```sh
npx @slide-ng/core create my-deck
cd my-deck
npm install
npm run dev     # dev server at http://localhost:4230
```

Or add it to an existing folder:

```sh
npm install -D @slide-ng/core
npx slide-ng dev
```

The command is `slide-ng`, described in [The command line](./cli.md). [Your first deck](./first-deck.md) shows what to do next.

## From a checkout

To work on slide.ng itself, clone the repository and install its dependencies:

```sh
git clone https://github.com/slide-ng/slide.ng.git
cd slide.ng
npm install
npm start          # dev server at http://localhost:4230
```

The repository contains a deck of its own, `slides.md`. `npm start` and `npm run build` are the plain scripts of the repository.

## Optional: themes

The official themes are separate packages in the slide-ng/themes repository. See [Themes and addons](../customize/themes.md) for how a deck picks one up.
