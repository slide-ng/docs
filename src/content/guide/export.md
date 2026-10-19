---
title: Export
description: Make a PDF, PNG, PPTX or Markdown file from a deck, and a PDF of the notes.
---

# Export

```sh
slide-ng export                      # writes slides-export.pdf
slide-ng export --format png
slide-ng export --format pptx
slide-ng export --format md
slide-ng export-notes                # a PDF of the speaker notes
```

Export opens the deck in Chromium. slide.ng never downloads a browser, so set `CHROME_PATH` or pass `--executable-path`. As root or in a container, Chromium needs `--no-sandbox` (or `SLIDE_NG_NO_SANDBOX=1`). Use it for decks you trust.

| Format | Result |
| --- | --- |
| `pdf` | One page per slide, with real text, and an outline with `--with-toc`. The pages are tagged for screen readers. Titles in the outline are plain text. |
| `png` | One picture per slide. |
| `pptx` | Pictures of the slides, with the notes. One slide per click step. Editable PowerPoint shapes are not made. |
| `md` | A Markdown file with the slides' pictures and notes. |

## Clicks

In a PDF, a slide that has clicks shows its last state. `--with-clicks` makes a page for every click step. A `@defer` block that waits (`on timer`, `on viewport`) may still show its placeholder when the page is captured: give `export` a `--wait`. `<slide-ng-render-when context="print">` shows content only on paper, see [Components](../built-in/components.md).

## Links in a PDF

A link to a slide, written in markdown (`[x](5)`) or as `<slide-ng-link>`, points at the first page of that slide in the PDF, so a click jumps there instead of opening the local server's address. It works only when the target slide is in the same file: with `--per-slide`, or with a `--range` that leaves the slide out, a link to another slide is no link. Links to web pages stay links.

## Choosing slides and looks

```sh
slide-ng export --range 1,4-5       # only these slides; a range that picks none fails at once
slide-ng export --dark              # dark mode
slide-ng export --scale 3           # pixel density of pictures, 2 by default
slide-ng export --output talk       # writes talk.pdf
```

## Settings in the deck

The headmatter can hold defaults. The command line wins over it.

```md
---
exportFilename: my-talk
export:
  format: pdf
  withClicks: true
  dark: false
---
```

`export:` takes `format`, `range`, `withClicks`, `dark`, `timeout`, `wait`, `waitUntil`, `withToc`, `perSlide` and `scale`, plus `omitBackground`. It cannot name an output folder or a browser program. A deck may come from someone else, so those come only from the command line or the environment. `exportFilename` is a plain file name without the extension.

## An existing build or a running server

```sh
slide-ng export --dist dist          # export a build you already made
slide-ng export --url http://localhost:4230/   # export a running server
```

Without `--dist` or `--url`, export builds the deck first, in its own working copy, so it does not disturb a dev server that is running. If the page never goes idle, the export says so: try `--wait-until load`.

## Notes

Without `--output` or `exportFilename`, the file is named after the deck: `slides.md` gives `slides-export.pdf`. `slide-ng export-notes` writes `slides-notes.pdf`. The full list of flags is in the [CLI reference](../built-in/cli.md).
