---
title: Headmatter and frontmatter
description: Every key slide.ng reads in the headmatter and in a slide's frontmatter.
---

# Headmatter and frontmatter

The first block of YAML in `slides.md` is the headmatter. It describes the deck. The block at the top of any slide is that slide's frontmatter. Any other key is kept in the slide's metadata and ignored.

## Frontmatter, per slide

| Key | What it does |
| --- | --- |
| `layout` | One of the [layouts](./layouts.md). |
| `class` | Extra UnoCSS classes on the layout, or on the content for layouts with a `class` prop. |
| `title` | The slide title. Otherwise the first `#` heading. Used in the browser tab, the table of contents and the go-to box. |
| `level` | Depth in the table of contents. Otherwise the number of `#` in the first heading. |
| `hideInToc` | Leave this slide out of `<slide-ng-toc>`. |
| `routeAlias` | An extra address: `routeAlias: intro` makes `/intro` open the slide. |
| `hide`, `disabled` | The slide is left out of the deck completely. |
| `clicks` | Fixes the number of clicks, whatever the elements ask for. |
| `clicksStart` | The first click number. Default 0. |
| `transition` | The transition to the next slide. |
| `src` | Take the slides from another file, optionally with a `#range`. |
| `zoom` | Scale this slide. Wins over the headmatter. |
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
| `routerMode` | `history` (default) or `hash`. |
| `fonts` | Web fonts. See [Fonts](../features/fonts.md). |
| `customElements` | Web component tags the slides may use, such as `[model-viewer, sl-*]`. A name ending in `*` is a prefix, and `true` allows any tag with a dash. See [Layouts and components](../customize/layouts-components.md#web-components). |

### Code and diagrams

| Key | What it does |
| --- | --- |
| `lineNumbers` | Line numbers on every code block. |
| `codeCopy` | `false` removes the copy button. |
| `codeAliases` | Extra language names, `{ mylang: ts }`. |
| `shiki` | Shiki options such as `themes: { light, dark }`. |
| `magicMoveDuration`, `magicMoveCopy` | Duration in milliseconds, and the copy button of Magic Move. |
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
| `wakeLock` | `true` starts with the screen kept awake. The viewer can change it in the settings menu. |

### The page, export and build

| Key | What it does |
| --- | --- |
| `titleTemplate`, `author`, `keywords`, `favicon`, `lang`, `htmlAttrs`, `seoMeta` | The page's `<head>`. See [Page head and SEO](../features/seo-meta.md). |
| `download` | A PDF button: `true`, a file name or an address. With `true`, `slide-ng build` makes the PDF. Without a working Chromium it warns and the button stays disabled. |
| `exportFilename` | The name of exported files, without the extension. |
| `export` | Defaults for `slide-ng export`. See [Export](../guide/export.md). |
| `remoteAssets` | Download remote pictures at build time. |
| `pwa` | Offline support in a build. |
| `themeColor` | The colour of the browser's bar for the installed app, such as `'#0f2c4c'`. A theme can set it. |

## Not read

These Slidev keys are accepted in the file but have no effect: `selectable`, `themeConfig`, `preload`, `clickAnimation`, `overviewSnapshots`, `browserExporter`, `notesAutoRuby`, `monacoTypesSource`, and `colorSchema: all`. `mdc: true` and `comark: true` have no effect, and the generator warns that MDC syntax stays text. `highlighter: prism` warns too, because code is always highlighted with Shiki. The `monaco` and `twoslash` switches of Slidev are not read either: a `{monaco}` or `twoslash` code fence is what turns them on. A key a theme brings through `theme.json` is merged under the deck's headmatter, except a fixed `colorSchema`, see [Themes and addons](../customize/themes.md).
