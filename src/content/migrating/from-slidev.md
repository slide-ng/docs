---
title: What differs from Slidev
description: What stays the same, what is written differently, and how to move a Slidev deck to slide.ng.
---

# What differs from Slidev

slide.ng reads the same markdown file format as *Slidev, with the same slide splitter and frontmatter reader (the markdown inside a slide is converted with `marked`, so smart quotes are not made). Anything about Vue, Vite plugins or Slidev's own theme packages is different, because slide.ng is Angular. This page lists the changes you will meet when you move a deck. For the features that are missing, see [Not supported](./not-supported.md).

## The same

- Slides separated by `---`, frontmatter and headmatter, notes in the last HTML comment, `src:` imports, `::name::` slots, per-slide `<style>`, block frontmatter.
- All 19 layouts, with the same names and props, plus `404` and `error`.
- The click, mark, motion and drag features, with the same props and modifiers. Only the names change, see below.
- Code fences with `[title]`, `{2,3|5|all}` ranges and `{lines:true}` options, `<<<` snippets with regions, code groups, Magic Move, Twoslash, Monaco blocks, KaTeX, Mermaid and PlantUML.
- Most headmatter keys, see [Headmatter and frontmatter](../built-in/headmatter.md), and most of the command line.
- The same keyboard shortcuts, the presenter view, drawing and recording.

## Added in slide.ng

- A click preview on the presenter page: the eye button or `u` shows what the later clicks of the current slide show, greyed out, and a click on a part goes to its click. See [Presenter mode](../guide/presenter-mode.md#click-preview).
- A progress bar on the slides, `progressBar` or `<slide-ng-progress-bar />`. Slidev has one on its presenter page only. See [Progress bar](../features/progress-bar.md).
- `navPosition` puts the navigation bar in any corner, or in the middle of the top or bottom edge. Slidev's bar is always at the bottom left. See [Headmatter and frontmatter](../built-in/headmatter.md#the-deck-and-its-look).
- `slide-ng.config.yaml` next to `slides.md` holds the deck's options with the keys of the headmatter, and the headmatter wins key by key. See [The config file](../built-in/headmatter.md#the-config-file-slide-ng-config-yaml).
- A built-in Turkish interface and `locales/<lang>.json` to translate the interface. See [Interface language](../features/interface-language.md).
- One deck in several languages, with a language menu in the bar that switches the slides and the interface. See [Interface language](../features/interface-language.md#one-deck-in-several-languages).

## Syntax differences

| In Slidev | In slide.ng |
| --- | --- |
| Vue template syntax: `{{ x }}`, `v-if`, `v-for`, `v-bind` | Angular template syntax: `{{ x }}`, `@if`, `@for`, `@switch`, `@let`, `[prop]="x"`, `(event)="y"` |
| `<script setup>` for state | No equivalent. State lives in components, and parts of a slide share state with `#ref` and `@let` |
| `v-click`, `v-after`, `v-click-hide`, `<v-clicks>`, `<v-click-gap>`, `<v-switch>`, `v-mark`, `v-motion`, `v-drag`, `<v-drag>`, `<v-drag-arrow>` | The same name with the `slide-ng-` prefix: `slide-ng-click`, `slide-ng-after`, `slide-ng-click-hide`, `<slide-ng-clicks>`, `<slide-ng-click-gap>`, `<slide-ng-switch>`, `slide-ng-mark`, `slide-ng-motion`, `slide-ng-drag`, `<slide-ng-drag>`, `<slide-ng-drag-arrow>`. The old names stop the generator |
| `v-click="[2, 4]"` | `slide-ng-click="[2, 4]"` is bound for you, and `[slide-ng-click]="[2, 4]"` is the Angular binding. `slide-ng-click="3"` and `"+2"` are fine as they are |
| PascalCase components: `<Toc />`, `<TitleRenderer />`, `<Link>`, `<Youtube>`, `<SlidevVideo>`, `<AutoFitText>`, `<LightOrDark>`, `<RenderWhen>`, `<SlideCurrentNo>`, `<SlidesTotal>`, `<Transform>`, `<Arrow>`, `<VDragArrow>` | kebab-case tags with the `slide-ng-` prefix: `<slide-ng-toc />`, `<slide-ng-title-renderer />`, `<slide-ng-link>`, `<slide-ng-youtube>`, `<slide-ng-video>`, `<slide-ng-auto-fit-text>`, `<slide-ng-light-or-dark>`, `<slide-ng-render-when>`, `<slide-ng-current-no />`, `<slide-ng-total />`, `<slide-ng-transform>`, `<slide-ng-arrow>`, `<slide-ng-drag-arrow>` |
| `{{ $clicks }}`, `{{ $page }}`, `$nav.currentPage` | The same names, but the values that change are Angular signals, so they are called: `{{ $clicks() }}`, `{{ $page() }}`, `$nav.currentPage()`. The generator warns about the uncalled forms. `$frontmatter`, `$slidev.configs` and `$slidev.themeConfigs` are read as they are. See [Angular in markdown](../guide/angular-templates.md#the-global-context) |
| `{{ $slidev.themeConfigs.primary }}` | The same, or `{{ themeConfig['primary'] }}`. The CSS variables `--slidev-theme-<key>` are the same |
| Slide hooks `onSlideEnter`, `onSlideLeave`, `useIsSlideActive` | `onSlideEnter`, `onSlideLeave` and `isSlideActive()` from `slide-ng/lib/slide-hooks`, called in a component. See [Layouts and components](../customize/layouts-components.md#slide-hooks) |
| Your own components in `components/`, written in Vue | Standalone Angular components in `components/`, found by their `selector` |
| Layouts in `layouts/*.vue` | Layouts in `layouts/*.ts`, see [Layouts and components](../customize/layouts-components.md) |
| UnoCSS config in `uno.config.ts` | `uno.config.mjs` |
| `v-pre` for a literal `{{ }}` | `ngNonBindable` on the element, or `\{\{` or `&#123;&#123;` in text |
| `<template #1>` children of `<v-switch>`, `<template #dark>` of `<LightOrDark>` | `<div at="1">` children of `<slide-ng-switch>`, and `<div dark>` or `<div light>` in `<slide-ng-light-or-dark>`. A `<template #...>` slot renders nothing, and the generator reports it |
| A named slot of your own component, `<template #title>` | An element with an attribute, `<span slot-title>`, and `<ng-content select="[slot-title]" />` in the component |
| `@click="$slidev.nav.next"` | `(click)="$nav.next()"` |
| Self-closing HTML tags, `<div />` | `<div></div>`. Angular stops with NG5002 otherwise. Components, `<img />` and `<br />` are fine |
| Windi's comma in arbitrary values, `grid-cols-[80px,1fr]` | `_` as in UnoCSS, `grid-cols-[80px_1fr]` |
| Any `/x` or `./x` markdown link is a link inside the deck | Only a slide number or a `routeAlias` is: `[x](5)`, `/5`, `./5`, `#/5`, `/alias`. Other addresses, such as `/file.pdf`, stay plain links. See [Links](../guide/syntax.md#links) |
| `[x](#5)` goes to slide 5 | `#5` is an anchor on the slide. Write `5` or `#/5` |
| Every link that is not a slide opens a new tab | `http` and `https` links do. `mailto:` and the like stay as they are |

`{{ }}` looks the same in both, but the expression inside is an Angular expression, not a JavaScript one with Vue's globals. An event handler cannot assign a slide field, because a slide has no class. `@if` and `@for` lines must be on their own line, see [Angular in markdown](../guide/angular-templates.md).

## Command line

| Slidev | slide.ng |
| --- | --- |
| `slidev` on port 3030 | `slide-ng` on port 4230 |
| `slidev build --base /talk/` | `slide-ng build --base /talk/` |
| `slidev dev --base` | Refused. The dev server always runs at `/` |
| `slidev --tunnel` | Refused. Use `--remote` on your network |
| `slidev export --format pptx-editable` | Not made. `pptx` holds pictures and notes |
| `npm init slidev` | `slide-ng create <folder>` |

slide.ng adds `build --offline`, which makes a folder that opens from disk, and `fonts.selfHost`. See [Presenting offline](../guide/offline.md).

## Themes and addons

Slidev themes and addons are Vue packages. They cannot be used. slide.ng has its own contract, described in [Themes and addons](../customize/themes.md), and rebuilt versions of `seriph`, `shibainu`, `bricks` and `apple-basic`, and a new `adev` theme. Theme settings that Slidev keeps in `package.json#slidev` are in a `theme.json` here. There is no theme or addon gallery beyond the [official themes](../customize/theme-gallery.md).

## Setup files

Slidev's setup files use `define...Setup` helpers and get Vue and Vite objects. slide.ng's are plain functions. `setup/main.ts` returns Angular providers, and shortcuts and context menu entries have different shapes. The full list is in [Setup hooks](../customize/setup-hooks.md).

## A checklist for a move

1. Run `slide-ng` on the deck and read the warnings. Unknown layouts, a missing theme and unknown slots are all reported.
2. Replace `v-if`, `v-for` and `<script setup>` with Angular's control flow and with components.
3. Rename component tags to kebab-case with the `slide-ng-` prefix, and `v-click` and the other `v-` names to `slide-ng-click` and so on. The generator stops on the old names, Slidev's PascalCase components (`<Toc />`, `<VClicks>`, `<Youtube>`, ...) included, and lists every one of them with its new name in one run.
4. Replace the theme with an official one, or write one. A Slidev theme name such as `seriph` is looked up as `@slide-ng/theme-seriph` and stops the build when that is not installed.
5. Pictures next to `slides.md` (`./images/x.png`) in a slide's markup are copied into the build. Move the ones that components, CSS `url()` and the frontmatter name into `public/`.
6. Put each component file directly in `components/`. Sub-folders are not read.
7. Remember that an HTML comment at the end of a slide is its speaker note, as in Slidev.
8. `.slidev-layout h4` sets a size, so `<h4 class="text-xs">` keeps the heading size, as in current Slidev. Older decks expected the class to win: add `!`, as in `!text-xs`.
9. Check the [not supported](./not-supported.md) list against what the deck uses.
