---
title: What differs from Slidev
description: What stays the same, what is written differently, and how to move a Slidev deck to slide.ng.
---

# What differs from Slidev

slide.ng reads the same markdown file format as *Slidev, with the same parser. Anything about Vue, Vite plugins or Slidev's own theme packages is different, because slide.ng is Angular. This page lists the changes you will meet when you move a deck. For the features that are missing, see [Not supported](./not-supported.md).

## The same

- Slides separated by `---`, frontmatter and headmatter, notes in the last HTML comment, `src:` imports, `::name::` slots, per-slide `<style>`, block frontmatter.
- All 19 layouts, with the same names and props, plus `404` and `error`.
- `v-click`, `v-after`, `v-click-hide`, `<v-clicks>`, `<v-switch>`, `v-mark`, `v-drag`, the same transition names.
- Code fences with `[title]`, `{2,3|5|all}` ranges and `{lines:true}` options, `<<<` snippets with regions, code groups, Magic Move, Twoslash, Monaco blocks, KaTeX, Mermaid and PlantUML.
- Most headmatter keys, see [Headmatter and frontmatter](../built-in/headmatter.md), and most of the command line.
- The same keyboard shortcuts, the presenter view, drawing and recording.

## Syntax differences

| In Slidev | In slide.ng |
| --- | --- |
| Vue template syntax: `{{ x }}`, `v-if`, `v-for`, `v-bind` | Angular template syntax: `{{ x }}`, `@if`, `@for`, `@switch`, `@let`, `[prop]="x"`, `(event)="y"` |
| `<script setup>` for state | No equivalent. State lives in components, and parts of a slide share state with `#ref` and `@let` |
| `v-click="[2, 4]"` | `[v-click]="[2, 4]"`, because Angular reads a plain attribute as text. `v-click="3"` and `"+2"` are fine as they are |
| PascalCase components: `<Toc />`, `<Link>`, `<Youtube>`, `<SlidevVideo>`, `<AutoFitText>`, `<LightOrDark>`, `<RenderWhen>`, `<SlideCurrentNo>`, `<SlidesTotal>`, `<Transform>`, `<Arrow>`, `<VDragArrow>` | kebab-case tags: `<slide-toc />`, `<slide-link>`, `<youtube>`, `<slide-video>`, `<auto-fit-text>`, `<light-or-dark>`, `<render-when>`, `<slide-current-no />`, `<slides-total />`, `<transform>`, `<arrow>`, `<v-drag-arrow>` |
| `$slidev`, `$nav`, `$clicks`, `$page` | Angular injection: `Nav`, `ClicksContext`, `SLIDE_NO`, `RENDER_CONTEXT` from `slide-ng/lib/...` |
| Slide hooks `onSlideEnter`, `onSlideLeave` | Not available. A component can inject `Nav` or `ClicksContext` and use signals |
| Your own components in `components/`, written in Vue | Standalone Angular components in `components/`, found by their `selector` |
| Layouts in `layouts/*.vue` | Layouts in `layouts/*.ts`, see [Layouts and components](../customize/layouts-components.md) |
| UnoCSS config in `uno.config.ts` | `uno.config.mjs` |

`{{ }}` looks the same in both, but the expression inside is an Angular expression, not a JavaScript one with Vue's globals. `@if` and `@for` lines must be on their own line, see [Angular in markdown](../guide/angular-templates.md).

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

Slidev themes and addons are Vue packages. They cannot be used. slide.ng has its own contract, described in [Themes and addons](../customize/themes.md), and rebuilt versions of `seriph`, `shibainu`, `bricks` and `apple-basic`. Theme settings that Slidev keeps in `package.json#slidev` are in a `theme.json` here. There is no theme or addon gallery beyond the [official themes](../customize/theme-gallery.md).

## Setup files

Slidev's setup files use `define...Setup` helpers and get Vue and Vite objects. slide.ng's are plain functions. `setup/main.ts` returns Angular providers, and shortcuts and context menu entries have different shapes. The full list is in [Setup hooks](../customize/setup-hooks.md).

## A checklist for a move

1. Run `slide-ng` on the deck and read the warnings. Unknown layouts, a missing theme and unknown slots are all reported.
2. Replace `v-if`, `v-for` and `<script setup>` with Angular's control flow and with components.
3. Rename component tags to kebab-case, and `v-click` ranges to `[v-click]`.
4. Replace the theme with an official one, or write one.
5. Check the [not supported](./not-supported.md) list against what the deck uses.
