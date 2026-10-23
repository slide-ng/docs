---
title: Progress bar
description: A thin bar on every slide that shows how far through the deck you are.
---

# Progress bar

`progressBar` in the headmatter draws a thin bar along the edge of every slide. It is empty on the first slide and full on the last, and the clicks of a slide fill part of the way to the next one.

```md
---
progressBar:
  position: top
  height: 6
  color: '#e11d48'
---
```

`progressBar: true` uses the defaults, and `progressBar: top` or `bottom` is short for the position. Any other value draws no bar, and the build warns about it.

| Option | What it does |
| --- | --- |
| `position` | `top` or `bottom` (default). |
| `height` | In slide pixels. Default `4`. |
| `color` | The colour of the filled part. Default: the theme's primary colour, also one set with `themeConfig.primary`. |
| `track` | The colour of the empty part. Default transparent. |
| `clicks` | `false` counts whole slides only. Default `true`. The clicks of the last slide do not count. |
| `minutes` | `true` shows the minutes of the presenter [timer](./timer.md) while it runs: those left of a countdown, or those passed on a stopwatch. |

The bar is drawn on the audience page, on the presenter's slide and next step, and in print and export. Slidev has a bar on its presenter page only.

## Place it yourself

`<slide-ng-progress-bar />` draws the same bar in a slide, with the same options as attributes. `position="inline"` keeps it where it is written instead of on an edge.

```md
<slide-ng-progress-bar position="inline" height="8" color="teal" />
```

In a [layer](./global-layers.md), which is a plain Angular component, import it first:

```ts
// layers/global-bottom.ts
import { Component } from '@angular/core';
import { SlideProgressBar } from 'slide-ng/builtin/progress-bar';

@Component({
  selector: 'my-global-bottom',
  imports: [SlideProgressBar],
  template: '<slide-ng-progress-bar position="bottom" height="6" />',
})
export default class MyGlobalBottom {}
```

For screen readers the bar is a `progressbar` named "Progress through the slides". The name and the minutes are in the deck's [interface language](./interface-language.md). In forced colors mode the bar is filled with the system's highlight colour.
