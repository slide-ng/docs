---
title: Directory structure
description: Which folders next to slides.md slide.ng reads, and which of them a theme or addon can have too.
---

# Directory structure

A deck is a folder with a `slides.md` in it. These folders and files next to it are read when they exist:

```
my-deck/
  slides.md
  layouts/            your own layouts
  components/         your own components, usable as tags in slides
  layers/             global-top, global-bottom, slide-top, slide-bottom
  styles/index.css    CSS added after the app's styles
  public/             files served from the site root (/logo.png)
  setup/              setup hooks: shiki.ts, katex.ts, mermaid.ts, shortcuts.ts, ...
  uno.config.mjs      UnoCSS settings
  snippets/           anything you import with <<<
```

`snippets/` is only a convention, since a snippet path is written out in full. The deck's folder is searched only for the folders listed above. The rest of it, your markdown and `node_modules`, is never copied.

## Roots

The deck's folder, a theme and every addon are called roots. They all follow the same layout, and later roots win over earlier ones, file by file and name by name:

1. the built-in theme
2. `theme:`
3. each of `addons:`, in order
4. the deck's own folder

So a deck can put a `layouts/cover.ts` next to `slides.md` and it beats the theme's cover.

| Folder or file | What it does |
| --- | --- |
| `layouts/<name>.ts` | A layout. `<name>` is what a slide writes in `layout:`. The same name replaces a built-in layout. |
| `components/*.ts` | Components that slides can use as tags. They are found by their `selector`. |
| `layers/<name>.ts` | A layer component, default export. |
| `styles/index.css` | CSS, added after the app's styles. |
| `public/` | Files served from the site root. The later root wins on the same name. |
| `setup/*.ts` | [Setup hooks](./setup-hooks.md). |
| `uno.config.mjs` | UnoCSS settings, default export. `presets`, `rules`, `safelist` and `variants` are added to the app's. `shortcuts` and `theme` are merged key by key. |
| `theme.json` | Name, default headmatter and layout inputs, for themes. See [Writing a theme](./writing-a-theme.md). |

## Importing from the app

Code in these folders is copied into the app before it is compiled, so it cannot use `../` to reach the app. Use the path alias `slide-ng/`, where `slide-ng/<path>` means `src/app/<path>`:

```ts
import { ClicksContext } from 'slide-ng/lib/clicks';
import { SHORTCUTS_SETUP } from 'slide-ng/lib/shortcuts';
```

Angular and other packages are imported as usual. Symbolic links in these folders are never copied.
