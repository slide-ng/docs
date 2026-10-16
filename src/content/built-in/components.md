---
title: Components
description: The components available in every slide without importing anything, with their attributes.
---

# Components

These tags work in every slide. The generator imports a component only into the slides that use its tag, so a component you do not use costs nothing.

## Navigation and structure

| Tag | What it does |
| --- | --- |
| `<slide-ng-toc />` | Table of contents from slide titles and levels. Options: `columns`, `listClass`, `listStyle`, `start`, `minDepth`, `maxDepth`, `mode`. See [Table of contents](../features/table-of-contents.md). |
| `<slide-ng-current-no />` | The number of the slide it is on. |
| `<slide-ng-total />` | The number of slides. |
| `<slide-ng-link to="3">text</slide-ng-link>` | A link to slide 3, or to a `routeAlias`. It has the prefix because `link` is a built-in HTML tag. |
| `<slide-ng-light-or-dark>` | Shows `<div dark>...</div>` in dark mode and `<div light>...</div>` in light mode. |
| `<slide-ng-render-when context="slide">` | Content only where the slide is drawn: `slide`, `presenter`, `print`, `overview`, or `main` (slide or presenter). `[context]="['slide','overview']"` takes several. Content marked `<div fallback>` shows everywhere else. |

## Clicks

| Tag | What it does |
| --- | --- |
| `<slide-ng-clicks>` | Reveals the items of a list one by one. Options: `depth`, `every`, `at`, `hide`. |
| `<slide-ng-switch>` | One child per click: `<slide-ng-switch><div at="1">a</div><div at="2">b</div><div at="3-5">c</div></slide-ng-switch>`. A number lasts until the next one starts, `3-5` is explicit. |
| `<slide-ng-click-gap size="2" />` | Leaves two clicks empty. |

`slide-ng-click` and `slide-ng-after` are directives, see [Directives](./directives.md).

## Drawing and layout helpers

| Tag | What it does |
| --- | --- |
| `<slide-ng-arrow x1="10" y1="20" x2="100" y2="200" color="red" width="2" two-way />` | An arrow on the slide. SVG, positions in slide pixels. `two-way` adds a head at the start. |
| `<slide-ng-transform scale="0.5" origin="top left">` | Scales what is inside. |
| `<slide-ng-auto-fit-text min="10" max="60" class="w-60 h-20">text</slide-ng-auto-fit-text>` | The biggest font size between `min` (30 by default) and `max` (100) that fits the box. `multi-line="false"` keeps it on one line. |
| `<slide-ng-drag pos="100,200,300,_">` | A movable box. `_` as height follows the content. |
| `<slide-ng-drag-arrow pos="100,100,300,200" color="red" [width]="3" />` | A movable arrow. |

## Media and embeds

| Tag | What it does |
| --- | --- |
| `<slide-ng-youtube id="luoMHjh-XcQ" width="560" height="315" />` | An embedded YouTube video. `id` is the video id. There are no start time or playlist options. |
| `<slide-ng-video autoplay="true" autoreset="click" controls poster="...">` | A video that plays when its slide, or its `slide-ng-click`, comes. `autoplay="once"` plays once. `timestamp` starts at a second. Put `<source>` tags inside. |
| `<slide-ng-tweet id="20" scale="0.8" conversation="none" cards="hidden" />` | An embedded tweet. Loads Twitter's script, so it needs the network. |
| `<slide-ng-blue-sky uri="at://did:.../app.bsky.feed.post/..." scale="0.8" />` | An embedded Bluesky post, needs the network. `uri` can also be the post's web address. |

## Written by the generator

`<slide-ng-code-group>`, `<slide-ng-code-block-wrapper>`, `<slide-ng-magic-move>`, `<slide-ng-katex-block-wrapper>`, `<slide-ng-mermaid>`, `<slide-ng-plant-uml>` and `<slide-ng-monaco>` are produced for code fences and math. You normally use the markdown forms, see [Code](../guide/code.md) and [Diagrams and math](../guide/diagrams-math.md). `<slide-ng-mermaid code="..." />` also works as a tag.

## Example

```md
<slide-ng-link to="intro">Back to the intro</slide-ng-link>

<slide-ng-render-when context="print">Only on paper.</slide-ng-render-when>

<slide-ng-arrow x1="40" y1="40" x2="240" y2="120" color="red" />
```

## Not there

Slidev's `PoweredBySlidev` badge and `TitleRenderer` are not available. Your own components work like these, see [Layouts and components](../customize/layouts-components.md).
