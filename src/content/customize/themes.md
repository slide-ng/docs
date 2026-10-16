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

`seriph`, `shibainu`, `bricks` and `apple-basic` are rebuilt from the official Slidev themes, and published from a separate repository, slide.ng-themes, one package each. `default` is the built-in look. See the [Theme gallery](./theme-gallery.md).

```sh
npm i -D @slide-ng/theme-seriph
```

```md
---
theme: seriph
---
```

<ngmd-callout type="warning" title="Not published yet">
  The theme packages are not on npm yet. Until they are, install them from a checkout of slide.ng-themes with a `file:` path, or use `--theme /path/to/slide.ng-themes/packages/theme-seriph`.
</ngmd-callout>

Slidev themes are written for Vue and are not compatible. Only the folder names are alike.

## What a theme can set

A theme can bring layouts, components, layers, CSS, public files, UnoCSS settings, default headmatter and Angular providers. Its default headmatter sits under the deck's own: the deck wins. `defaults`, `fonts`, `drawings`, `htmlAttrs` and `themeConfig` are merged key by key.

## Eject a theme

```sh
slide-ng theme eject
```

copies the theme in use into `./theme` and sets `theme: ./theme`, so you can edit it. For the built-in theme this copies every layout, with their imports rewritten to `slide-ng/...`, and the layouts' CSS as `styles/index.css`. For a package it copies the whole package folder without `node_modules`, `.git` and symbolic links. It refuses a folder that is not empty. `--dir` picks another folder name.

## Limits

- There is no versioning or compatibility check between a theme and the app.
- A layout's inputs are not read from the component, because Angular decorators are not parsed. They come from the built-in layout or from `theme.json`.
- Class names in a theme are found by UnoCSS in `.ts` files of the roots and in the deck's markdown, not in CSS files.
- `themeConfig` is not read.

Next: [Writing a theme](./writing-a-theme.md).
