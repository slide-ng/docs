---
title: Headmatter and frontmatter
description: Every key slide.ng reads in the headmatter and in a slide's frontmatter.
---

# Headmatter and frontmatter

The first block of YAML in `slides.md` is the headmatter. It describes the deck. The keys of the deck can also go in a file of their own, see [The config file](#the-config-file-slide-ng-config-yaml). The block at the top of any slide is that slide's frontmatter. Any other key is kept in the slide's metadata and ignored.

## Frontmatter, per slide

| Key | What it does |
| --- | --- |
| `layout` | One of the [layouts](./layouts.md). |
| `class` | Extra UnoCSS classes on the layout, or on the content for layouts with a `class` prop. |
| `title` | The slide title. Otherwise the first `#` heading. Used in the browser tab, the table of contents and the go-to box. |
| `level` | Depth in the table of contents. Otherwise the number of `#` in the first heading. |
| `hideInToc` | Leave this slide out of `<slide-ng-toc>`. |
| `routeAlias` | An extra address: `routeAlias: intro` makes `/intro` open the slide. Names of the app's pages, numbers and names with `/`, `.`, `?`, `#` or `\` are refused, see [Slide addresses](../features/routing.md#aliases). |
| `hide`, `disabled` | The slide is left out of the deck completely. |
| `clicks` | Fixes the number of clicks, whatever the elements ask for. A value that is not a number, or a negative one, is ignored with a warning. |
| `clicksStart` | The first click number. Default 0. A negative one counts as 0. |
| `clickAnimation` | The click animation preset of the slide's click elements, such as `up` or `fade right`. See [Click animations](../features/click-animations.md). |
| `transition` | The transition to the next slide. |
| `src` | Take the slides from another file, optionally with a `#range`. |
| `zoom` | Scale this slide. Wins over the headmatter. |
| `preload` | `false` leaves the slide's pictures out of [loading ahead](../features/preload-images.md). |
| `dragPos` | Named positions for `slide-ng-drag`. It is read per slide, so in the headmatter it covers slide 1 only. |
| `image`, `url`, `scale`, `backgroundSize`, `background`, `layoutClass` | Props of some layouts. |

## Headmatter, for the deck

### The deck and its look

| Key | What it does |
| --- | --- |
| `title` | The deck title, for the browser tab and the info dialog. |
| `info` | Markdown for the info dialog. With the markup taken out and cut at 300 characters, it is also the page description and the PDF's subject. |
| `theme`, `addons` | A folder, a package name or `default`. See [Themes and addons](../customize/themes.md). |
| `defaults` | Frontmatter every slide starts from. |
| `transition` | The transition of every slide that sets none. |
| `colorSchema` | `auto` (default), `light` or `dark`. Fixed values hide the toggle. A theme that sets `light` or `dark` in its `theme.json` keeps that mode: the deck's own value is not used, and the generator says so. |
| `canvasWidth`, `aspectRatio` | The canvas. Defaults 980 and `16/9`. |
| `zoom` | Scale every slide. |
| `routerMode` | `history` (default), `hash` or `memory`. See [Slide addresses](../features/routing.md). |
| `clickAnimation` | The click animation preset of every slide. |
| `navPosition` | Where the navigation bar sits on the slide page: `bottom-left` (default), `bottom-center`, `bottom-right`, `top-left`, `top-center` or `top-right`. Left and right follow the writing direction, so a right-to-left deck mirrors them. At the top, the bar's menus open below it. A viewer can choose another place in the [settings menu](./shortcuts.md#mouse). The presenter page keeps its bar. Another value is warned about and keeps the bottom left. Not in Slidev. |
| `progressBar` | A progress bar on every slide: `true`, `top`, `bottom` or an object. See [Progress bar](../features/progress-bar.md). |
| `preloadImages` | `true` (default), `{ ahead: n }` or `false`. See [Loading pictures ahead](../features/preload-images.md). |
| `unocss` | `{ attributify: false }` turns attributify off. See [UnoCSS](../features/unocss.md). |
| `fonts` | Web fonts. See [Fonts](../features/fonts.md). |
| `themeConfig` | Settings for the theme, such as `themeConfig: { primary: '#5d8392' }`. Each text or number key becomes the CSS variable `--slidev-theme-<key>`. See [Themes and addons](../customize/themes.md#theme-settings). |
| `customElements` | Web component tags the slides may use, such as `[model-viewer, sl-*]`. A name ending in `*` is a prefix, and `true` allows any tag with a dash. See [Layouts and components](../customize/layouts-components.md#web-components). |

### Code and diagrams

| Key | What it does |
| --- | --- |
| `lineNumbers` | Line numbers on every code block. |
| `codeCopy` | `false` removes the copy button. |
| `codeAliases` | Extra language names, `{ mylang: ts }`. |
| `shiki` | Shiki options such as `themes: { light, dark }`. |
| `magicMoveDuration`, `magicMoveCopy` | Duration in milliseconds, and the copy button of Magic Move. `shiki.magicMove` takes the other animation options, see [Magic Move](../features/magic-move.md). |
| `monaco`, `twoslash` | `true` (default), `false`, `dev` or `build`. Off, `{monaco}` blocks are plain highlighted code and Twoslash does not run. |
| `monacoRunUseStrict` | `false` runs `{monaco-run}` code without `"use strict"`. |
| `plantUmlServer` | The PlantUML server. |

### Presenting

| Key | What it does |
| --- | --- |
| `duration`, `timer` | The presenter timer: `30min`, and `stopwatch` or `countdown`. |
| `drawings` | `enabled`, `persist`, `presenterOnly`, `syncAll`. See [Drawing](../features/drawing.md). |
| `record` | The recorder: `true`, `false`, `dev` (default) or `build`. |
| `presenter` | `false`, or `dev` or `build`, to limit the presenter page. |
| `editor` | `false` hides the side editor button. |
| `contextMenu` | `true`, `false`, `dev` or `build`. |
| `wakeLock` | `true` (default), `false`, `dev` or `build`. Keeps the screen awake. A choice stored in the browser wins, and the viewer can change it in the settings menu. |
| `notesAutoRuby` | `{ word: reading }` shows a reading above each listed word in the notes. See [Speaker notes](../features/speaker-notes.md#readings-above-words). |
| `mcp` | `false` turns off the dev server's MCP endpoint. See [MCP server](../features/mcp.md). |

### The page, export and build

| Key | What it does |
| --- | --- |
| `titleTemplate`, `author`, `keywords`, `favicon`, `htmlAttrs`, `seoMeta` | The page's `<head>`. See [Page head and SEO](../features/seo-meta.md). |
| `lang`, `uiLang` | `lang` is `<html lang>`, the interface language and the locale of the `date`, `number` and `currency` pipes. `ar`, `he`, `fa` and `ur` mirror the page. `uiLang` changes the interface language only. See [Interface language](../features/interface-language.md). |
| `languages` | One file per language, such as `{ en: slides.md, tr: slides.tr.md }`, in the entry file or the config file. The bar gets a language menu. See [One deck in several languages](../features/interface-language.md#one-deck-in-several-languages). |
| `download` | A PDF button: `true`, a file name or an address. With `true`, `slide-ng build` makes the PDF. Without a working Chromium it warns and the button stays disabled. |
| `exportFilename` | The name of exported files, without the extension. |
| `export` | Defaults for `slide-ng export`. See [Export](../guide/export.md). |
| `remoteAssets` | Download remote pictures at build time. |
| `pwa` | Offline support in a build. |
| `themeColor` | The colour of the browser's bar for the installed app, such as `'#0f2c4c'`. A theme can set it. |

## The config file: `slide-ng.config.yaml`

The deck's options can also live in a file next to `slides.md`: `slide-ng.config.yaml`, or `slide-ng.config.yml`, or `slide-ng.config.json`. It holds the keys of the headmatter, and each key does what it does there. Not in Slidev, whose options are in the headmatter only.

```yaml
# slide-ng.config.yaml
title: My talk
theme: ./my-theme
fonts:
  sans: Inter
themeConfig:
  primary: '#5d8392'
languages:
  en: slides.md
  tr: slides.tr.md
```

- The headmatter wins, key by key. `fonts`, `themeConfig`, `htmlAttrs`, `drawings` and `defaults` are merged one level deep, as a theme's `theme.json` is: `fonts: { sans: Inter, mono: Fira Code }` in the file and `fonts: { mono: JetBrains Mono }` in the headmatter give `sans: Inter` and `mono: JetBrains Mono`. Any other value, a list or an object such as `seoMeta` or `languages`, is replaced whole.
- Keys of the first slide stay in `slides.md`. `layout`, `class`, `src`, `hide`, `routeAlias`, `clicks`, `dragPos` and the layout props in the headmatter are about slide 1, so the config file does not set them and warns. Put them in the first slide, or under `defaults` for every slide. `title` in the file is the deck's title.
- Only the entry file's folder is looked in, and the file must really be there: a symbolic link that leads out of the folder stops the build. It can set what the headmatter can, `allowOutsideRoot` too, and no more. When more than one of the three names is there, the first in the order above is read and the others are warned about.
- With `languages`, the file is for the whole deck: each language file reads it under its own headmatter, so `title`, `info` and `titleTemplate` can still be translated per file.
- Warnings and errors name the file and the line of the key, such as `slide-ng.config.yaml:3: ...`. A file that is not valid YAML or JSON stops the build.
- `dev` watches it like `slides.md`: saving, adding or removing it rebuilds the deck.
- Only YAML and JSON are read. A `slide-ng.config.mjs` or `.ts` with code is not supported.

## Not read

These Slidev keys are accepted in the file but have no effect: `selectable`, `overviewSnapshots`, `browserExporter`, `monacoTypesSource`, and `colorSchema: all`. `mdc: true` and `comark: true` have no effect, and the generator warns that MDC syntax stays text. `highlighter: prism` warns too, because code is always highlighted with Shiki. A key a theme brings through `theme.json` is merged under the deck's headmatter, except a fixed `colorSchema`, see [Themes and addons](../customize/themes.md).
