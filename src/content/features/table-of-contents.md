---
title: Table of contents
description: Build a table of contents from slide titles with slide-ng-toc.
---

# Table of contents

`<slide-ng-toc />` lists the slides that have a title and are not hidden. It works from the `title` and `level` of each slide.

```md
<slide-ng-toc columns="2" />
```

The title is the `title` key, or else the first heading. The level is the `level` key, or else the number of `#` in that heading. A slide whose level is higher than the one before it becomes its child, so `# A`, `## A.1`, `## A.2`, `# B` gives A with A.1 and A.2, and B.

Leave a slide out with `hideInToc: true`.

| Option | Meaning |
| --- | --- |
| `columns` | Number of columns, 1 by default. |
| `listClass`, `listStyle` | Classes or inline style for the lists. |
| `start` | The first number, 1 by default. |
| `minDepth`, `maxDepth` | Which levels to list. |
| `mode` | `all`, `onlyCurrentTree` (the path to the current slide and what is below it) or `onlySiblings` (the lists that contain the current slide). |

The slide's title is plain text. Slidev's `TitleRenderer`, which shows a title as HTML, is not there.
