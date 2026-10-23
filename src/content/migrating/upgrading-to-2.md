---
title: Upgrading from 1.x to 2.0
description: How to move a deck from slide.ng 1.x to 2.0, and the changes that can alter a deck that 1.x showed correctly.
---

# Upgrading from 1.x to 2.0

slide.ng 2.0 needs the same Node (22.22.3 or newer) and the same Angular (22.2) as 1.x. Update the package in the deck's folder:

```sh
npm install -D @slide-ng/core@^2.0.0
npx slide-ng dev
```

Then read the warnings in the terminal and step through the deck once. Most decks need no change. The list below is what can alter a deck that 1.x showed correctly, and how to keep the old behaviour.

## Changes that can alter a deck

### Addresses and links

- `routeAlias: overview`, `entry` or `notes-edit` stops `build` and `dev`: they are pages of the app now. Rename the alias. A markdown link `[x](/overview)` opens the app's [overview page](../features/overview-pages.md) instead of that slide, with a full page load.
- A `routeAlias` that is a number, that is empty, that has `/`, `.`, `?`, `#` or `\`, or that is on two slides stops the build, naming the slides.
- Markdown links to `http` and `https` addresses open in a new tab. To keep one in the same tab, write it as HTML: `<a href="https://example.com">x</a>` is left as written.
- An `<a href="/3">` written as HTML with attributes other than `class`, `id` or `style`, such as `target`, is left as written, with a warning. In a `routerMode: hash` deck it loads `/3` from the server. Write a markdown link, `[x](3)`, or `<slide-ng-link to="3">`. A plain `<a href="/3">` goes to the slide, as in 1.x.
- The address leaves out `?clicks=0`: slide 2 at its first click is `/2`. An address with `?clicks=0` still opens.

See [Links](../guide/syntax.md#links) and [Slide addresses](../features/routing.md).

### Language

- `lang` now also sets the locale of the `date`, `number` and `currency` pipes: `lang: en-GB` writes "30 September 2026", and `pt_br` writes `1.234.567,891`. Give a pipe its own locale argument to keep the old format, such as `{{ day | date: 'mediumDate' : '' : 'en-US' }}`.
- `<html lang>` is written in the usual spelling: `lang: pt_br` gives `pt-BR`.
- `lang` picks the language of the interface too. See [Interface language](../features/interface-language.md).

### Styling

- Attributify reads plain HTML attributes as utilities: `<table border="1">` gets a border, `<span font="bold">` is bold, `<div m="4">` gets a margin. `unocss: { attributify: false }` in the headmatter turns it off. See [UnoCSS](../features/unocss.md).
- `themeConfig` is applied as CSS variables, `--slidev-theme-<key>`, so a `themeConfig.primary` recolours `text-primary`, the progress bar and the controls. See [Theme settings](../customize/themes.md#theme-settings).
- The speaker notes get the typography preset's `prose` styles: body colour and spacing.

### Files next to the deck

- An `index.html` next to `slides.md` is merged into the page: its `<title>`, `<meta>` and scripts now count, and what its `<body>` holds is added to the page after the slides, out of sight but read by screen readers. Rename it if it was not meant for the deck. See [Your own index.html](../features/seo-meta.md#your-own-index-html).

### Clicks and code

- `slide-ng-click.hide` and `slide-ng-after.hide` hide the element at its click instead of being ignored. That click counts, so the slide has one more click, and `export --with-clicks` one more page.
- `slide-ng-click-hide="3"` hides at click 3 instead of at the next click, and `slide-ng-click="2" slide-ng-click-hide="3"` shows at click 2 and hides at click 3.
- A click range written as text, `slide-ng-click="[2, 4]"`, is a range. In 1.x it was ignored and the element was always visible.
- `{monaco-run}` code runs in strict mode: assigning a name that was never declared stops with a `ReferenceError`. Declare it, or set `monacoRunUseStrict: false`.

See [Clicks and transitions](../guide/animations.md) and [Running code](../features/monaco-run.md).

### Loading and the screen

- Pictures of the next slides are loaded ahead. `preloadImages: false` turns it off. See [Loading pictures ahead](../features/preload-images.md).
- The screen wake lock is on by default. `wakeLock: false` turns it off; a choice already stored in the browser is kept, so a viewer who used 1.x may have to turn it on once in the settings menu.

### Builds and the browser

- Several decks on one origin, such as the project sites of one GitHub Pages user, no longer share their slides, drawings and stored settings: they belong to the deck's base path. A deck at `/` keeps its old keys, but settings that a deck under a sub-path stored with 1.x are not read.
- A static build no longer contains the side editor, the dev server's sync and drag saving, or the `/notes-edit` page. They only ever worked with the dev server.
- In a PDF made by `export` or `build --download`, links to other addresses of the deck's own site, such as `/file.pdf`, are text without a link.

## What is new

The full list is in the [release notes](https://github.com/slide-ng/slide.ng/blob/main/CHANGELOG.md). The new pages of this site:

- [Interface language](../features/interface-language.md), with right-to-left decks and one deck in several languages
- [Click animations](../features/click-animations.md) and transitions of your own, see [Clicks and transitions](../guide/animations.md#your-own-transition)
- [Progress bar](../features/progress-bar.md)
- [Overview and notes pages](../features/overview-pages.md), the sync mode menu and the click preview, see [Presenter mode](../guide/presenter-mode.md)
- [UnoCSS](../features/unocss.md): attributify, variant groups, `prose` and directives
- [Loading pictures ahead](../features/preload-images.md)
- [Accessibility](../guide/accessibility.md)
- Memory routing and `build --router-mode`, see [Slide addresses](../features/routing.md#memory-mode)
- Several decks in one `build` or `export`, see [Hosting](../guide/hosting.md#several-decks)
- Slide hooks and the global context, see [Layouts and components](../customize/layouts-components.md#slide-hooks) and [Angular in markdown](../guide/angular-templates.md#the-global-context)
- `setup/routes.ts` and `setup/mermaid-renderer.ts`, see [Setup hooks](../customize/setup-hooks.md)
- MCP over HTTP from the dev server, see [MCP server](../features/mcp.md#over-http-from-the-dev-server)
