---
title: Directory structure
description: Which folders next to slides.md slide.ng reads, and which of them a theme or addon can have too.
---

# Directory structure

A deck is a folder with a `slides.md` in it. These folders and files next to it are read when they exist:

```
my-deck/
  slides.md
  slide-ng.config.yaml  the deck's options, as in the headmatter
  layouts/              your own layouts
  components/           your own components, usable as tags in slides
  layers/               global-top, global-bottom, slide-top, slide-bottom, custom-nav-controls
  styles/index.css      CSS added after the app's styles
  public/               files served from the site root (/logo.png)
  setup/                setup hooks: shiki.ts, katex.ts, mermaid.ts, shortcuts.ts, ...
  locales/              translations of the interface: tr.json, de.json, ...
  uno.config.mjs        UnoCSS settings
  theme.json            inputs and slots of your own layouts
  index.html            extra tags for the page's head and body
  snippets/             anything you import with <<<
```

`snippets/` is only a convention, since a snippet path is written out in full. The deck's folder is searched only for the folders listed above. The rest of it, your markdown and `node_modules`, is never copied. `slide-ng.config.yaml` is the deck's only, a theme or addon has none: see [The config file](../built-in/headmatter.md#the-config-file-slide-ng-config-yaml).

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
| `locales/<lang>.json` | Translations of the interface, flat `"key": "text"` pairs. Merged key by key, the later root wins. See [Interface language](../features/interface-language.md). |
| `uno.config.mjs` | UnoCSS settings, default export. `presets`, `rules`, `safelist` and `variants` are added to the app's. `shortcuts` and `theme` are merged key by key. |
| `index.html` | Tags added to the page's `<head>` and `<body>`, such as analytics. See [Page head and SEO](../features/seo-meta.md#your-own-index-html). |
| `theme.json` | Name, default headmatter and layout inputs and slots. A deck's own folder can have one too, for its own layouts. See [Writing a theme](./writing-a-theme.md). |

## Importing from the app

Code in these folders is copied into the app before it is compiled, so it cannot use `../` to reach the app. Between a root's own folders `../` is fine, for example a layout that imports `../components/footer`, because they are copied side by side. An import from a folder that is not copied fails, and the error says which folders are. Use the path alias `slide-ng/`, where `slide-ng/<path>` means `src/app/<path>`:

```ts
import { ClicksContext } from 'slide-ng/lib/clicks';
import { SHORTCUTS_SETUP } from 'slide-ng/lib/shortcuts';
```

Angular and other packages are imported as usual. Symbolic links in these folders are never copied.

## Pictures next to the deck

A picture in `public/` is written with a leading slash, `/photo.png`. A relative address that `public/` does not have, but that names a file in the deck's folder, such as `![](./images/chart.png)` or `<img src="../shared/logo.svg">` from a slide in `pages/`, is copied into the build too and served from `/_local/`. That works in a slide's markup only. A file outside the deck's folder is not copied, and neither are pictures named in components, in CSS `url()` or in the frontmatter: put those in `public/`.

The generator warns about a picture with a leading `/` that `public/` does not have, about `/public/x.png` (write `/x.png`), and about a relative picture that is neither next to the markdown file nor in `public/`. `public/` must be a real folder: a symbolic link there is not followed, and the generator warns.
