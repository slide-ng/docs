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
| `<slide-ng-progress-bar />` | A bar that shows how far through the deck the slide is. Options: `position` (`top`, `bottom`, `inline`), `height`, `color`, `track`, `clicks`, `minutes`. See [Progress bar](../features/progress-bar.md). |
| `<slide-ng-title-renderer />` | The title of the slide it is on, as HTML: its inline markdown and `$math$` are drawn. `no="3"` shows the title of slide 3. Raw HTML in a title is shown as text. Slidev's `TitleRenderer`. |
| `<slide-ng-link to="3">text</slide-ng-link>` | A link to slide 3, or to a `routeAlias`. It has the prefix because `link` is a built-in HTML tag. The link has the slide's real address, so Ctrl or Cmd + click opens it in a new tab. `title="Details"` is the text when the tag has none. |
| `<slide-ng-light-or-dark>` | Shows `<div dark>...</div>` in dark mode and `<div light>...</div>` in light mode. |
| `<slide-ng-render-when context="slide">` | Content only where the slide is drawn: `slide`, `presenter`, `print`, `overview`, or `main` (slide or presenter). `visible` shows it while the element is on the screen. `[context]="['slide','overview']"` takes several, and in a list `visible` must hold too. Content marked `<div fallback>` shows everywhere else. In print and export every slide counts as visible. |

## Clicks

| Tag | What it does |
| --- | --- |
| `<slide-ng-clicks>` | Gives each child a click, as Slidev's `v-clicks`: each item of a single list, each body row of a single table, otherwise each child element (paragraphs, pictures, several lists). Options: `depth`, `every`, `at`, `hide`, `animation`. |
| `<slide-ng-switch>` | One child per click: `<slide-ng-switch><div at="1">a</div><div at="2">b</div><div at="3-5">c</div></slide-ng-switch>`. A number lasts until the next one starts. `3-5` is clicks 3 and 4: the end is not included. `unmount` takes the children that are not shown out of the page; their components stay alive. `transition="fade"` animates the change, also with `slide-left`, `slide-up`, `fade-out`, a `forward \| backward` pair or a [transition of your own](../guide/animations.md#your-own-transition); a bare `transition` is a fade. |
| `<slide-ng-click-gap size="2" />` | Leaves two clicks empty. |

`slide-ng-click` and `slide-ng-after` are directives, see [Directives](./directives.md).

## Drawing and layout helpers

| Tag | What it does |
| --- | --- |
| `<slide-ng-arrow x1="10" y1="20" x2="100" y2="200" color="red" width="2" two-way />` | An arrow on the slide. SVG, positions in slide pixels. `two-way` adds a head at the start. |
| `<slide-ng-transform scale="0.5" origin="top left">` | Scales what is inside. |
| `<slide-ng-auto-fit-text min="10" max="60" class="w-60 h-20">text</slide-ng-auto-fit-text>` | The biggest font size between `min` (30 by default) and `max` (100) that fits the box. `multi-line="false"` keeps it on one line. |
| `<slide-ng-drag pos="100,200,300,_">` | A movable box. `_` as height follows the content. |
| `<slide-ng-drag-arrow pos="100,100,200,100" color="red" [width]="3" />` | A movable arrow. `pos` is `x,y,width,height`, as in Slidev: from (100, 100), 200 to the right and 100 down. |

## Media and embeds

| Tag | What it does |
| --- | --- |
| `<slide-ng-youtube id="luoMHjh-XcQ?start=60" width="560" height="315" />` | An embedded YouTube video. `id` is the video id, optionally followed by YouTube's embed options, as in Slidev: `?start=60&end=90`, `list`, `loop`, `autoplay`, `mute` and the other documented ones. Other options are dropped. `start` (seconds) and `list` (a playlist id) can also be attributes, and they win over the same option in `id`. A start time, `start` or the `t` of a shared link, may be written YouTube's way, `1m30s` or `1h2m3s`; anything else is dropped with a warning. |
| `<slide-ng-video autoplay="true" autoreset="click" controls poster="...">` | A video that plays when its slide, or its `slide-ng-click`, comes. `autoplay="once"` plays once. `timestamp` starts at a second. Put `<source>` tags inside. A class or size on it, such as `class="h-60"`, sizes the video, which keeps its shape. Where the video does not play (print, export, overview), `printPoster="/still.png"` replaces `poster`, and `printTimestamp="12"` (seconds, or `last`) picks the frame to show. |
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

Slidev's `PoweredBySlidev` badge is not available. Your own components work like these, see [Layouts and components](../customize/layouts-components.md).
