---
title: Starter
description: The slide.ng starter repository, a template with a short tutorial deck, and the commands to start a deck from it.
---

# Starter

The [slide.ng starter](https://github.com/slide-ng/starter) is a GitHub template repository. It holds a deck whose slides are a short tutorial, the folders a deck grows into, and the workflows that publish it. Read the deck, then replace it with your own talk.

<ngmd-pill-row>
  <ngmd-pill href="https://github.com/slide-ng/starter/generate" title="Use this template"></ngmd-pill>
  <ngmd-pill href="https://github.com/slide-ng/starter" title="Starter repository"></ngmd-pill>
</ngmd-pill-row>

## The deck

Press the right arrow or space to step through it, and `o` for the overview.

<ngmd-demo src="/demos/starter/" title="The starter deck" source="https://github.com/slide-ng/starter"></ngmd-demo>

## Start a deck

You need Node 22.22.3 or newer.

```sh
npx degit slide-ng/starter my-talk
cd my-talk && npm install
npm run dev
```

`npm run dev` serves the deck at `http://localhost:4230` and reloads when you save `slides.md`. The other scripts are `build` (a static site in `dist/`), `export` (a PDF, which needs Chromium) and `format`.

To get a repository of your own on GitHub instead, press **Use this template** above. To get a smaller deck without the tutorial, run `npx @slide-ng/core create my-talk`, see [Your first deck](../getting-started/first-deck.md).

## What is in the folder

| Path          | What it is                                                                   |
| ------------- | ---------------------------------------------------------------------------- |
| `slides.md`   | The deck: headmatter, then one slide per `---`.                              |
| `components/` | Your own Angular components, usable as tags in slides.                       |
| `snippets/`   | Code files shown with `<<< @/snippets/greeter.ts#greeter`.                   |
| `pages/`      | Slides in other markdown files, pulled in with `src: ./pages/more-slides.md`. |
| `public/`     | Pictures and other files.                                                    |
| `.github/`    | Workflows that publish the deck to GitHub Pages and export a PDF.            |

Hosting is covered in [Hosting](../guide/hosting.md), export in [Export](../guide/export.md).
