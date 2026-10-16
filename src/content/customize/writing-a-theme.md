---
title: Writing a theme
description: Make a theme in five steps, from a folder next to your deck to an npm package.
---

# Writing a theme

A theme is a folder with the same shape as a deck's own folder. The rules are in [Themes and addons](./themes.md) and [Directory structure](./directory-structure.md). This page is a walk-through.

## 1. Make the folder

```
my-theme/
  theme.json
  layouts/
  components/
  styles/index.css
```

Put it next to your deck and write `theme: ./my-theme` in the headmatter. Start with only the parts you need.

## 2. Replace a layout

`my-theme/layouts/quote.ts`:

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'my-quote',
  host: { class: 'slidev-layout my-quote' },
  template: '<div class="my-quote-body"><ng-content /></div>',
})
export class MyQuote {}
```

Any slide with `layout: quote` now uses it. The selector must be a plain string literal and the class must be exported, because the generator finds a layout by reading the file as text.

If your layout reads frontmatter such as `author: Ada`, give the component an input of that name and list it in `theme.json`:

```json
{ "layouts": { "quote": { "props": ["author"] } } }
```

A layout that replaces a built-in one keeps the built-in layout's inputs. For example `cover` keeps `background`. The frontmatter keys that are inputs become attributes of your tag, so give your component inputs of the same names.

## 3. Add a component

`my-theme/components/callout.ts` with `selector: 'my-callout'`. Slides can write `<my-callout>text</my-callout>`, and the generator imports it into every slide that uses the tag.

## 4. Add CSS

`my-theme/styles/index.css` is plain CSS and comes after the app's CSS. UnoCSS classes work in the layouts and components, and `uno.config.mjs` can add shortcuts:

```js
export default { shortcuts: { 'my-muted': 'op60 text-sm' } };
```

## 5. Default settings

`theme.json` can set headmatter defaults and describe layouts:

```json
{
  "name": "minimal",
  "headmatter": { "colorSchema": "dark", "transition": "fade" },
  "layouts": { "quote": { "props": ["author"], "slots": [], "classProp": false } }
}
```

- `headmatter`: defaults for the deck. The deck's own headmatter wins. This is also where fonts go, for example `"fonts": { "sans": "Titillium Web", "mono": "Fira Code" }`.
- `layouts.<name>`: `props` are the frontmatter keys that become inputs, `slots` are the names accepted after `::name::`, and `classProp: true` sends the slide's `class` to the input `contentClass` instead of the tag.

Pictures go in `public/`.

## Extra: providers and setup hooks

A theme can change the shortcuts, or how code editors run code, with a `setup/` file. See [Setup hooks](./setup-hooks.md). `setup/providers.ts` default-exports an array of Angular providers, which are added to the application:

| Token | From | Use |
| --- | --- | --- |
| `SHORTCUTS_SETUP` | `slide-ng/lib/shortcuts` | A function `(actions, list) => list` to add, change or remove shortcuts. The last root that provides it wins. |
| `CODE_RUNNERS` | `slide-ng/code/runners` | `{ provide: CODE_RUNNERS, multi: true, useValue: { javascript: (code) => result } }` replaces how `{monaco-run}` runs a language. |
| `SYNC_TRANSPORTS` | `slide-ng/sync/transport` | Another way to carry presenter sync (multi). |

## Share it

A theme is a folder, so publish it as an npm package with these folders at the top of the package. slide.ng looks the name up as `@slide-ng/theme-<name>`, then `slide-ng-theme-<name>`, then `<name>`, so name your package `slide-ng-theme-<name>`, or `@your-scope/theme-<name>` and use `theme: @your-scope/theme-<name>`.

```json
{
  "name": "slide-ng-theme-ocean",
  "version": "1.0.0",
  "license": "MIT",
  "keywords": ["slide-ng-theme", "slide-ng"],
  "files": ["layouts", "components", "styles", "public", "setup", "theme.json"],
  "peerDependencies": { "slide-ng": "*" }
}
```

To start from the built-in look instead of from nothing, run `slide-ng theme eject`.

## Check it

Run the deck with `slide-ng` and edit the theme. The folders are watched, so an edit regenerates and reloads. Run `slide-ng build` to see the real build, which fails on a template error in a layout.
