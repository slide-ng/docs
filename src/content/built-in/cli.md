---
title: CLI reference
description: Every command and flag of slide-ng.
---

# CLI reference

```sh
slide-ng [command] [slides.md] [flags]
```

The entry file is `slides.md` unless you name another one. A first argument that starts with `-` or ends in `.md` means `dev`. An unknown flag is an error, so a typo is never silently ignored. Flags take `--flag value` or `--flag=value`, and a boolean flag has a `--no-flag` form. A value flag does not take a following flag as its value: `--out --base /x/` is an error. Write a value that starts with `--` as `--flag=--value`.

`slide-ng --version` prints the version, `slide-ng --help` lists the commands, and `slide-ng <command> --help` lists that command's flags.

A mistyped command or flag gets the nearest real one: `Unknown command "biuld". Did you mean "build"?`, also for `--verison`, `-P` (for `-p`), `theme ejcet` and `skills instal`. A flag of another command names that command (`build --with-clicks` is a flag of `export`), and `present` says to open `/presenter` of `dev` or of a build.

## dev

Starts the dev server. This is the default command.

| Flag | Meaning |
| --- | --- |
| `--port`, `-p` | Port. Default 4230. |
| `--open`, `-o` | Open the deck in a browser. |
| `--remote[=password]` | Listen on every address so other devices can open the deck and follow the presenter. Always with a password: the one given, `SLIDE_NG_PASSWORD`, a prompt on a terminal, or a random one that is printed. See [Remote access](../features/remote-access.md). |
| `--bind <address>` | The address to listen on with `--remote`. Default `0.0.0.0`. |
| `--log error\|warn\|info\|silent` | How much of the child programs' output to show. Default `info`. `error` and `silent` hide it. |
| `--force`, `-f` | Clear the build cache. |
| `--theme`, `-t` | A theme name or path, instead of the headmatter's. |
| `--lang <tag>` | Use this language (`tr`, `pt-BR`) instead of the headmatter's `lang`: the interface, the locale of dates and numbers, and `<html lang>`. See [Interface language](../features/interface-language.md). |

`--tunnel` and `--base` are refused with a message. The dev server always runs at `/`.

In a terminal the dev server reads keys, as Slidev's does, and prints a line that lists them:

| Key | What it does |
| --- | --- |
| `r` | Restart the generator, the companion server and the Angular dev server. A running presenter timer is kept, and `--open` opens no new tab. |
| `o` | Open `http://localhost:<port>/` in the default browser. |
| `e` | Open the entry file in `$VISUAL`, `$EDITOR` (flags allowed, such as `code -w`) or else `code`. Under `npm run` and `npx`, npm's own `EDITOR=vi` counts as unset, so `code` is used when it is installed. |
| `q` | Quit. Ctrl+C works too. |
| `c` | With `--remote`, print a QR code of the private address for each network address. Without it, say how to start with it. |

- One deck runs one dev server. A second `slide-ng dev` on the same deck stops before it changes anything, whatever its `--port`, and names the running one. A port in use stops it too. Run two decks side by side from their own folders, each with its own `--port`.
- When the first Angular build fails, the port shows a page with the error until the build works, and an open tab then loads the slides by itself.
- The dev server keeps watching after an editor saves by renaming a new file over the old one (vim, JetBrains, `git checkout`).
- It also serves MCP over HTTP at `/__mcp`, see [MCP server](../features/mcp.md#over-http-from-the-dev-server).

## build

Makes a static site. See [Hosting](../guide/hosting.md).

```sh
slide-ng build a.md b.md --base /talks/   # dist/a/ at /talks/a/, dist/b/ at /talks/b/
```

With several entries each deck is built in turn into `<out>/<name>/` and served under `<base><name>/`, where `<name>` is the file name without `.md`, as in Slidev. Two entries with the same file name, or a missing one, are refused before the first deck is built. `--out` then belongs to the build as a whole: anything else an earlier build left there is removed.

| Flag | Meaning |
| --- | --- |
| `--out`, `-o` | Output folder. Default `dist`. |
| `--base /talk/` | The path the site is served under. `/talk`, `talk/` and `/talk/` all mean `/talk/`. |
| `--offline` | A folder that opens from disk. Cannot be combined with `--base`. See [Presenting offline](../guide/offline.md). |
| `--download` | Also make the PDF and add the download button. Fails when the PDF cannot be made, where `download: true` alone only warns. |
| `--without-notes` | Leave the speaker notes out. |
| `--router-mode` | `history`, `hash` or `memory`. Replaces the headmatter's `routerMode` for this build, and the build records it for `export --dist`. With `--offline` only `hash`. See [Slide addresses](../features/routing.md). |
| `--executable-path` | The Chromium to use for the PDF, the install icons and the Open Graph picture. |
| `--no-sandbox` | Run that Chromium without its sandbox. Needed as root or in a container. Use it for trusted decks only. |
| `--allow-local` | Let the page Chromium renders reach loopback and private addresses. They are blocked otherwise. |
| `--timeout` | Timeout in milliseconds for each page Chromium renders. |
| `--theme`, `-t` | A theme name or path. |
| `--lang <tag>` | Use this language instead of the headmatter's `lang`, for one deck in several languages: `slide-ng build slides.tr.md --out dist/tr`. |

## export

Makes a PDF, PNG, PPTX or Markdown file. See [Export](../guide/export.md).

With several entries (`slide-ng export a.md b.md`) each deck is built and exported in turn, to its own file. `--output`, `--dist` and `--url` name one place, so they are refused then, and so are two decks that would get the same file name. To export one deck of a build of several, name its folder: `slide-ng export a.md --dist dist/a`.

| Flag | Meaning |
| --- | --- |
| `--format` | `pdf` (default), `png`, `pptx` or `md`. |
| `--output`, `-o` | Output name or path. |
| `--range 1,4-5` | Which slides. Text that is not a range, such as `2-x`, is refused. |
| `--with-clicks`, `-c` | One page per click step. On by default for `pptx`. |
| `--dark` | Dark mode. |
| `--timeout` | Milliseconds, 1000 to 600000. Default 30000. |
| `--wait` | Extra wait in milliseconds, 0 to 120000. Default 0. |
| `--wait-until` | `networkidle` (default), `load`, `domcontentloaded` or `none`. |
| `--executable-path` | The Chromium to use. Or set `CHROME_PATH`. |
| `--no-sandbox` | Run Chromium without its sandbox, as root or in a container. Or set `SLIDE_NG_NO_SANDBOX=1`. |
| `--allow-local` | Let the exported page reach loopback and private addresses. |
| `--per-slide` | Make each slide separately and join them. Links between slides and the tags for screen readers are lost, and the command says so. Use it only for a deck too big to print in one go. |
| `--scale` | Device scale factor, 0.25 to 8. Default 2. |
| `--omit-background` | A transparent background. |
| `--with-toc` | Put an outline made from slide titles into the PDF. |
| `--dist <folder>` | Export an existing build instead of building first, with the router mode it was built with. |
| `--url <address>` | Export a running server, for example the dev server. |
| `--base` | The base path the build at `--dist` was made with. Read from its `index.html` when left out. |
| `--theme`, `-t` | A theme name or path. |
| `--lang <tag>` | Use this language instead of the headmatter's `lang`. Refused with `--dist` and `--url`, whose language was fixed when they were built. |

A `--range` that picks no slide fails before the deck is built.

## export-notes

Writes a PDF of the speaker notes. Takes `--output`, `--range` and the Chromium flags of `export`, and several entries as `export` does. The date on it is written in the deck's language.

## format

```sh
slide-ng format [slides.md ...]
```

Tidies the files given, `slides.md` by default. No flags. Frontmatter that is not valid YAML stops it with the file, line and slide and what is wrong, and the file is left as it is. See [Formatting](../features/format.md).

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

## skills install

```sh
slide-ng skills install [--dir <folder>] [--force]
```

Copies the agent skill into `<dir>/slide-ng`. `--dir` defaults to `.agents/skills`. `--force` replaces an earlier copy. It never writes outside the current folder. See [Agents and the skill](../guide/agents.md).

## create

```sh
slide-ng create <folder> [--force]
```

Makes a new deck folder: `slides.md`, `package.json` with the scripts `dev`, `build`, `export` and `format`, a README and `.gitignore`. It refuses a folder with files. `--force`, `-f` adds only the files that are missing, fills in the name only in the files it adds, and keeps an existing `.gitignore`. The `.gitignore` leaves out what `export` and `export-notes` write by default. See [Your first deck](../getting-started/first-deck.md).

## Environment

| Variable | Meaning |
| --- | --- |
| `CHROME_PATH` | The Chromium that export, `--download`, `pwa` icons and `ogImage: auto` use. |
| `SLIDE_NG_THEME` | A theme name or path that overrides the headmatter. `--theme` sets it. |
| `SLIDE_NG_LANG` | The same as `--lang`. |
| `SLIDE_NG_NO_SANDBOX` | `1` is the same as `--no-sandbox`. |
| `SLIDE_NG_PASSWORD` | The password for `dev --remote`. It keeps the password out of the shell history. |
| `SLIDES_FILE` | The entry file, when no argument names one. |
