---
title: Themes and addons
description: Use a theme or an addon, how names are looked up, and eject a theme to edit it.
---

# Themes and addons

A theme or an addon is a folder, or an npm package, that adds to the built-in look. A theme is the look of the deck. An addon adds to it, for example a set of components. Both have the same contents, see [Directory structure](./directory-structure.md).

## Use one

```md
---
theme: ./my-theme
addons:
  - ./my-addon
  - slide-ng-addon-charts
---
```

- `theme: default`, `none`, or no `theme:` at all is the built-in theme.
- A path (`./my-theme`, an absolute path, `@/themes/mine` relative to the deck's folder) is used as a folder.
- Any other name is looked up in `node_modules`, from the deck's folder upwards: `@slide-ng/theme-<name>`, then `slide-ng-theme-<name>`, then `<name>`. A scoped name (`@scope/theme-x`) is used as written. Addons use `@slide-ng/addon-<name>`, `slide-ng-addon-<name>`, then `<name>`.
- A path that is not a folder is an error, and so is a package that is not installed. The build stops with `The theme "x" was not found. Install it with: npm install -D slide-ng-theme-x`. In a terminal, `dev` and `build` ask first whether to install it now.
- `--theme <name|path>` on the command line, or `SLIDE_NG_THEME`, overrides the headmatter for one run.

## The official themes

`seriph`, `shibainu`, `bricks` and `apple-basic` are rebuilt from the official Slidev themes, `adev` is inspired by angular.dev, and all are published from a separate repository, slide.ng-themes, one package each. `default` is the built-in look. See the [Theme gallery](./theme-gallery.md).

```sh
npm i -D @slide-ng/theme-seriph
```

```md
---
theme: seriph
---
```

Slidev themes are written for Vue and are not compatible. Only the folder names are alike. A Slidev theme name such as `theme: seriph` is looked up as `@slide-ng/theme-seriph`, so install that package, or the build stops.

The slide.ng repository also has example themes to copy into a deck as folders: `examples/theme-minimal`, `theme-paper` (light, editorial: serif headlines and a vermilion accent), `theme-moss` (dark, forest green and clay) and `theme-blueprint` (a navy drafting grid with amber marks). Each README lists its layouts, inputs and component.

## What a theme can set

A theme can bring layouts, components, layers, CSS, public files, UnoCSS settings, default headmatter and Angular providers. Its default headmatter sits under the deck's own: the deck wins. `defaults`, `fonts`, `drawings`, `htmlAttrs` and `themeConfig` are merged key by key.

The one exception is `colorSchema`. A theme that sets `light` or `dark` has colours for that mode only, so every deck that uses it keeps that mode, as in Slidev. The toggle is gone, and when the deck's headmatter asks for another mode the generator says that it is not used. Of the official themes, `bricks` is light only and `shibainu` dark only.

## Eject a theme

```sh
slide-ng theme eject
```

copies the theme in use into `./theme` and sets `theme: ./theme`, so you can edit it. `--theme` or `SLIDE_NG_THEME` picks another theme to copy. For the built-in theme this copies every layout, with their imports rewritten to `slide-ng/...` (including the helpers `background` and `frame`, which stay in the package), and the layouts' CSS as `styles/index.css`. For a package it copies the whole package folder without `node_modules`, `.git` and symbolic links. It refuses a folder that is not empty. `--dir` picks another folder name.

The built-in styles still load before the ejected `styles/index.css`. Your copy overrides them rule by rule, so deleting a rule from the copy brings the built-in one back. To undo a built-in rule, override it, for example `.slidev-layout.end { background: none }`. A later slide.ng version can change the built-in rules under your copy.

## Limits

- There is no versioning or compatibility check between a theme and the app.
- A layout's inputs are not read from the component, because Angular decorators are not parsed. They come from the built-in layout or from `theme.json`.
- Class names in a theme are found by UnoCSS in `.ts` files of the roots and in the deck's markdown, not in CSS files.
- `themeConfig` is not read.
- `@apply` in a theme's CSS does nothing, because there is no UnoCSS directive transformer. The generator warns. Write the CSS out, or put the classes on the elements.
- A theme package whose `files` leaves its folders out installs empty. The generator warns, instead of failing later with "is not a known element".

Next: [Writing a theme](./writing-a-theme.md).
