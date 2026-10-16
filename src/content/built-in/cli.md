---
title: CLI reference
description: Every command and flag of slide-ng.
---

# CLI reference

```sh
slide-ng [command] [slides.md] [flags]
```

The entry file is `slides.md` unless you name another one. A first argument that starts with `-` or ends in `.md` means `dev`. An unknown flag is an error, so a typo is never silently ignored. Flags take `--flag value` or `--flag=value`, and a boolean flag has a `--no-flag` form.

## dev

Starts the dev server. This is the default command.

| Flag | Meaning |
| --- | --- |
| `--port`, `-p` | Port. Default 4230. |
| `--open`, `-o` | Open the deck in a browser. |
| `--remote[=password]` | Listen on every address so other devices can open the deck and follow the presenter. The password is optional. See [Remote access](../features/remote-access.md). |
| `--bind <address>` | The address to listen on with `--remote`. Default `0.0.0.0`. |
| `--log error\|warn\|info\|silent` | How much of the child programs' output to show. Default `info`. `error` and `silent` hide it. |
| `--force`, `-f` | Clear the build cache. |
| `--theme`, `-t` | A theme name or path, instead of the headmatter's. |

`--tunnel` and `--base` are refused with a message. The dev server always runs at `/`.

## build

Makes a static site. See [Hosting](../guide/hosting.md).

| Flag | Meaning |
| --- | --- |
| `--out`, `-o` | Output folder. Default `dist`. |
| `--base /talk/` | The path the site is served under. `/talk`, `talk/` and `/talk/` all mean `/talk/`. |
| `--offline` | A folder that opens from disk. Cannot be combined with `--base`. See [Presenting offline](../guide/offline.md). |
| `--download` | Also make the PDF and add the download button. |
| `--without-notes` | Leave the speaker notes out. |
| `--executable-path` | The Chromium to use for the PDF, the install icons and the Open Graph picture. |
| `--timeout` | Timeout in milliseconds for the PDF. |
| `--theme`, `-t` | A theme name or path. |

## export

Makes a PDF, PNG, PPTX or Markdown file. See [Export](../guide/export.md).

| Flag | Meaning |
| --- | --- |
| `--format` | `pdf` (default), `png`, `pptx` or `md`. |
| `--output`, `-o` | Output name or path. |
| `--range 1,4-5` | Which slides. |
| `--with-clicks`, `-c` | One page per click step. On by default for `pptx`. |
| `--dark` | Dark mode. |
| `--timeout` | Milliseconds, 1000 to 600000. Default 30000. |
| `--wait` | Extra wait in milliseconds, 0 to 120000. Default 0. |
| `--wait-until` | `networkidle` (default), `load`, `domcontentloaded` or `none`. |
| `--executable-path` | The Chromium to use. Or set `CHROME_PATH`. |
| `--per-slide` | Make each slide separately and join them. |
| `--scale` | Device scale factor, 0.25 to 8. Default 2. |
| `--omit-background` | A transparent background. |
| `--with-toc` | Put an outline made from slide titles into the PDF. |
| `--dist <folder>` | Export an existing build instead of building first. |
| `--url <address>` | Export a running server, for example the dev server. |
| `--base` | The base path the deck is served under, for `--dist`. |
| `--theme`, `-t` | A theme name or path. |

`export` takes one entry file per run.

## export-notes

Takes the same flags as `export` and writes a PDF of the speaker notes.

## format

```sh
slide-ng format [slides.md ...]
```

Tidies the files given, `slides.md` by default. No flags. See [Formatting](../features/format.md).

## theme eject

```sh
slide-ng theme eject [slides.md] [--dir theme] [--theme name]
```

Copies the theme in use into the deck's folder, and sets `theme: ./theme` in the headmatter. `--dir` is a plain folder name. It refuses a folder that is not empty. See [Themes and addons](../customize/themes.md).

## mcp

```sh
slide-ng mcp [slides.md]
```

Starts the MCP server on stdio. See [MCP server](../features/mcp.md).

## create

```sh
slide-ng create <folder> [--force]
```

Makes a new deck folder. `--force`, `-f` adds the files that are missing to a folder that already has files. See [Your first deck](../getting-started/first-deck.md).

## Environment

| Variable | Meaning |
| --- | --- |
| `CHROME_PATH` | The Chromium that export, `--download`, `pwa` icons and `ogImage: auto` use. |
| `SLIDE_NG_THEME` | A theme name or path that overrides the headmatter. `--theme` sets it. |
| `SLIDES_FILE` | The entry file, when no argument names one. |
