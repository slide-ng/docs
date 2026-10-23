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
  layers/          optional: global-top.ts, global-bottom.ts, slide-top.ts, slide-bottom.ts, custom-nav-controls.ts
  setup/           optional: setup hooks
  public/          optional: pictures and fonts, served from /
  locales/         optional: translations of the interface, tr.json, de.json, ...
  uno.config.mjs   optional: UnoCSS shortcuts and rules
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

A layout that replaces a built-in one keeps the built-in layout's inputs. For example `cover` keeps `background`. The frontmatter keys that are inputs become attributes of your tag, so give your component inputs of the same names. A `props` list replaces the built-in inputs, so keep the ones you still want: a `cover` that adds `event` lists `["background", "event"]`, or a `background:` picture is dropped. The `slide-ng/layouts/background` helper turns that input into the style the built-in cover uses.

Text, numbers and booleans arrive as text, as for any HTML attribute. Use `input(0, { transform: numberAttribute })` or `booleanAttribute` for them, otherwise `draft: false` is the text `"false"`. A list or an object (`owners: [Priya, Jonas]`) is bound as its value.

A slot's content arrives as an element with the slot's name as an attribute. Place it with `<ng-content select="[name]" />`.

## 3. Add a component

`my-theme/components/callout.ts` with `selector: 'my-callout'`. Slides can write `<my-callout>text</my-callout>`, and the generator imports it into every slide that uses the tag.

That is for slides only. A layout, a layer or another component imports the components it uses itself, also those of its own theme: `import { Footer } from '../components/footer'` and `imports: [Footer]`. The theme's folders are copied side by side, so `../` works between them. In a component template, write an icon as `<span class="i-carbon:star"></span>`.

## 4. Add CSS

`my-theme/styles/index.css` is plain CSS and comes after the app's CSS. UnoCSS classes work in the layouts and components, and `uno.config.mjs` can add shortcuts:

```js
export default { shortcuts: { 'my-muted': 'op60 text-sm' } };
```

UnoCSS's directives work in this CSS, as in Slidev: `@apply p-4 text-red-500;`, `--uno: p-4;`, `@screen md { ... }` and `theme('colors.red.500')` are written out as CSS while the deck is generated. A utility UnoCSS does not know gives a warning. Variant groups such as `hover:(a b)` are not expanded in the `.ts` files of a theme: write the classes out there.

Dark mode is the class `dark` on `<html>`: write `html.dark .my-quote { ... }` for the dark palette. The core styles dim the paragraph right after a heading (`h1 + p`, a subtitle). Set its `opacity` in your CSS if your theme should not.

Write sides with logical properties (`border-inline-start`, `padding-inline-start`, `ms-4`, `ps-4`) rather than `left` and `right`, so the theme mirrors in a right-to-left deck (`lang: ar`, `he`, `fa` or `ur`). The core blockquote line is a `border-inline-start`: a theme that sets `border-left` on a blockquote shows both lines in such a deck.

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
- A `colorSchema` of `light` or `dark` says the theme has colours for that mode only: every deck that uses it keeps that mode, and the generator warns when a deck asks for another. Leave it out when the theme styles both.
- `layouts.<name>`: `props` are the frontmatter keys that become inputs, `slots` are the names accepted after `::name::`, and `classProp: true` sends the slide's `class` to the input `contentClass` instead of the tag.

Settings a deck may change, such as the accent colour, go in `themeConfig`, as in Slidev. Each one is the CSS variable `--slidev-theme-<key>` on `<body>`, and the deck's `themeConfig: { accent: '#22c55e' }` replaces your default:

```json
{ "headmatter": { "themeConfig": { "accent": "#f59e0b" } } }
```

```css
.my-quote {
  border-left: 4px solid var(--slidev-theme-accent);
}
```

The variables are written after the roots' style sheets, so they win over a value you set on `:root` or `html.dark`. Use them in rules on the elements, or alias them on `body` or below: an alias on `:root` is worked out before the variable exists there. `primary` is the colour of the built-in accent (`text-primary`, the progress bar). In a component, `inject(THEME_CONFIG)` from `slide-ng/lib/theme-config` gives the whole map, lists and objects too. There is one value for both colour modes, so a theme that wants another dark colour can offer a second key, such as `primaryDark`, and use it under `html.dark`. The rules for values are in [Themes and addons](./themes.md#theme-settings).

Keys other than `name`, `headmatter` and `layouts` are not read, and the generator says so: settings such as `colorSchema` and `fonts` go under `headmatter`. A value of the wrong type is reported and ignored. A deck's own folder can have a `theme.json` too, to describe the inputs and slots of its own layouts.

Pictures go in `public/`. Translations of slide.ng's interface go in `locales/<lang>.json`, see [Themes and addons](./themes.md#translating-the-interface).

## A footer or page number

Put it in `layers/global-top.ts`. Read the slide's number with `inject(SLIDE_NO)` from `slide-ng/lib/slide-context`. `Nav.no()` is the slide being presented, so in the PDF it would print the same number on every page. `layers/global-bottom.ts` is drawn under the slide, so a theme that paints the slide background on `.slidev-layout` hides it. See [Global layers](../features/global-layers.md).

## Extra: providers and setup hooks

A theme can change the shortcuts, or how code editors run code, with a `setup/` file. See [Setup hooks](./setup-hooks.md). `setup/providers.ts` default-exports an array of Angular providers, which are added to the application:

| Token | From | Use |
| --- | --- | --- |
| `SHORTCUTS_SETUP` | `slide-ng/lib/shortcuts` | A function `(actions, list) => list` to add, change or remove shortcuts. One provider is used, the last root's. The `setup/shortcuts.ts` files of all roots run after it. |
| `CODE_RUNNERS` | `slide-ng/code/runners` | `{ provide: CODE_RUNNERS, multi: true, useValue: { javascript: (code) => result } }` replaces how `{monaco-run}` runs a language. |
| `SYNC_TRANSPORTS` | `slide-ng/sync/transport` | Another way to carry presenter sync (multi). |

## Share it

A theme is a folder, so publish it as an npm package with these folders at the top of the package. List every folder in `files`: a package without them installs empty, and the generator warns. slide.ng looks the name up as `@slide-ng/theme-<name>`, then `slide-ng-theme-<name>`, then `<name>`, so name your package `slide-ng-theme-<name>`, or `@your-scope/theme-<name>` and use `theme: @your-scope/theme-<name>`.

```json
{
  "name": "slide-ng-theme-ocean",
  "version": "1.0.0",
  "license": "MIT",
  "keywords": ["slide-ng-theme", "slide-ng"],
  "files": ["layouts", "components", "layers", "styles", "public", "setup", "locales", "theme.json", "uno.config.mjs"],
  "peerDependencies": { "@slide-ng/core": "*" }
}
```

To start from the built-in look instead of from nothing, run `slide-ng theme eject`.

## Check it

Run the deck with `slide-ng` and edit the theme. The folders are watched, so an edit regenerates and reloads. Run `slide-ng build` to see the real build, which fails on a template error in a layout.
