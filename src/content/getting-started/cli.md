---
title: The command line
description: The commands of slide-ng and what each one does.
---

# The command line

`slide-ng` is the command of the package. Without a command it starts the dev server, so `slide-ng`, `slide-ng talk.md` and `slide-ng --port 4300` all mean `dev`. A deck is a markdown file, `slides.md` unless you name another.

```sh
slide-ng create my-deck            # a new deck folder
slide-ng [dev] [slides.md]         # dev server
slide-ng build [slides.md]         # a static site in ./dist
slide-ng build --offline           # a folder you open from disk
slide-ng export [slides.md]        # PDF, PNG, PPTX or Markdown
slide-ng export-notes [slides.md]  # a PDF of the speaker notes
slide-ng format [slides.md]        # tidy the markdown file
slide-ng theme eject               # copy the theme in use into ./theme
slide-ng mcp [slides.md]           # MCP server on stdio
```

In a checkout of the repository, run the same thing as `node bin/slide-ng.mjs <command>`. In a deck made by `create`, the scripts `npm run dev`, `build`, `export` and `format` call it for you.

## Where a deck is built

A deck inside the slide.ng repository is built in place. Any other deck gets a working copy of the app in `<deck>/.slide-ng/app`, made fresh each time, so the installed package is never written to. Add `.slide-ng/` to your `.gitignore`; the template already does.

## The ones you use most

| Command | What it does |
| --- | --- |
| `dev` | Starts the dev server at `http://localhost:4230`, with live reload, the side editor and the companion server that saves drawings and `slide-ng-drag` positions. |
| `build` | Makes a static site. `--base /talk/` for a sub-path, `--download` to also make the PDF. |
| `export` | Opens the deck in Chromium and writes a PDF. `--format png`, `pptx` or `md` for the others. |
| `format` | Rewrites `slides.md` with tidy spacing and clean YAML. |

Every flag is in the [CLI reference](../built-in/cli.md). The Guide pages [Export](../guide/export.md), [Hosting](../guide/hosting.md) and [Presenting offline](../guide/offline.md) show them in use.
