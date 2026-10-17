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

## Syntax differences

| In Slidev | In slide.ng |
| --- | --- |
| Vue template syntax: `{{ x }}`, `v-if`, `v-for`, `v-bind` | Angular template syntax: `{{ x }}`, `@if`, `@for`, `@switch`, `@let`, `[prop]="x"`, `(event)="y"` |
| `<script setup>` for state | No equivalent. State lives in components, and parts of a slide share state with `#ref` and `@let` |
| `v-click`, `v-after`, `v-click-hide`, `<v-clicks>`, `<v-click-gap>`, `<v-switch>`, `v-mark`, `v-motion`, `v-drag`, `<v-drag>`, `<v-drag-arrow>` | The same name with the `slide-ng-` prefix: `slide-ng-click`, `slide-ng-after`, `slide-ng-click-hide`, `<slide-ng-clicks>`, `<slide-ng-click-gap>`, `<slide-ng-switch>`, `slide-ng-mark`, `slide-ng-motion`, `slide-ng-drag`, `<slide-ng-drag>`, `<slide-ng-drag-arrow>`. The old names stop the generator |
| `v-click="[2, 4]"` | `[slide-ng-click]="[2, 4]"`, because Angular reads a plain attribute as text. `slide-ng-click="3"` and `"+2"` are fine as they are |
| PascalCase components: `<Toc />`, `<Link>`, `<Youtube>`, `<SlidevVideo>`, `<AutoFitText>`, `<LightOrDark>`, `<RenderWhen>`, `<SlideCurrentNo>`, `<SlidesTotal>`, `<Transform>`, `<Arrow>`, `<VDragArrow>` | kebab-case tags with the `slide-ng-` prefix: `<slide-ng-toc />`, `<slide-ng-link>`, `<slide-ng-youtube>`, `<slide-ng-video>`, `<slide-ng-auto-fit-text>`, `<slide-ng-light-or-dark>`, `<slide-ng-render-when>`, `<slide-ng-current-no />`, `<slide-ng-total />`, `<slide-ng-transform>`, `<slide-ng-arrow>`, `<slide-ng-drag-arrow>` |
| `$slidev`, `$nav`, `$clicks`, `$page` | Angular injection: `Nav`, `ClicksContext`, `SLIDE_NO`, `RENDER_CONTEXT` from `slide-ng/lib/...`. There is no global in markdown: a small component exposes the value and a `#ref` reads it |
| Slide hooks `onSlideEnter`, `onSlideLeave` | Not available. A component can inject `Nav` or `ClicksContext` and use signals |
| Your own components in `components/`, written in Vue | Standalone Angular components in `components/`, found by their `selector` |
| Layouts in `layouts/*.vue` | Layouts in `layouts/*.ts`, see [Layouts and components](../customize/layouts-components.md) |
| UnoCSS config in `uno.config.ts` | `uno.config.mjs` |
| `v-pre` for a literal `{{ }}` | `ngNonBindable` on the element, or `\{\{` or `&#123;&#123;` in text |
| `<template #1>` children of `<v-switch>`, `<template #dark>` of `<LightOrDark>` | `<div at="1">` children of `<slide-ng-switch>`, and `<div dark>` or `<div light>` in `<slide-ng-light-or-dark>`. A `<template #...>` slot renders nothing, and the generator reports it |
| A named slot of your own component, `<template #title>` | An element with an attribute, `<span slot-title>`, and `<ng-content select="[slot-title]" />` in the component |
| `@click="$slidev.nav.next"` | A small component that injects `Nav` and calls `nav.next()` |
| Self-closing HTML tags, `<div />` | `<div></div>`. Angular stops with NG5002 otherwise. Components, `<img />` and `<br />` are fine |
| `@apply` in CSS | Does nothing, and the generator warns. Write the CSS out, or put the classes on the elements |
| Windi's comma in arbitrary values, `grid-cols-[80px,1fr]` | `_` as in UnoCSS, `grid-cols-[80px_1fr]` |

`{{ }}` looks the same in both, but the expression inside is an Angular expression, not a JavaScript one with Vue's globals. An event handler cannot assign a slide field, because a slide has no class. `@if` and `@for` lines must be on their own line, see [Angular in markdown](../guide/angular-templates.md).

## Command line

| Slidev | slide.ng |
| --- | --- |
| `slidev` on port 3030 | `slide-ng` on port 4230 |
| `slidev build --base /talk/` | `slide-ng build --base /talk/` |
| `slidev dev --base` | Refused. The dev server always runs at `/` |
| `slidev --tunnel` | Refused. Use `--remote` on your network |
| `slidev export` with several entries | One entry per run |
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
3. Rename component tags to kebab-case with the `slide-ng-` prefix, `v-click` and the other `v-` names to `slide-ng-click` and so on, and `v-click` ranges to `[slide-ng-click]`. Search for `v-click`, `v-after`, `v-mark`, `v-motion`, `v-drag` and `<v-`.
4. Replace the theme with an official one, or write one. A Slidev theme name such as `seriph` is looked up as `@slide-ng/theme-seriph` and stops the build when that is not installed.
5. Pictures next to `slides.md` (`./images/x.png`) in a slide's markup are copied into the build. Move the ones that components, CSS `url()` and the frontmatter name into `public/`.
6. Put each component file directly in `components/`. Sub-folders are not read.
7. Remember that an HTML comment at the end of a slide is its speaker note, as in Slidev.
8. `.slidev-layout h4` sets a size, so `<h4 class="text-xs">` keeps the heading size, as in current Slidev. Older decks expected the class to win: add `!`, as in `!text-xs`.
9. Check the [not supported](./not-supported.md) list against what the deck uses.
