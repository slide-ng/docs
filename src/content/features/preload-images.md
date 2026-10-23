---
title: Loading pictures ahead
description: The pictures of the next slides are loaded before they are shown, as with Slidev's preloadImages.
---

# Loading pictures ahead

Pictures are loaded before their slide is shown, as in Slidev, so a slide does not appear half drawn. It is on by default.

```md
---
preloadImages: { ahead: 3 }
---
```

| Value | What it does |
| --- | --- |
| `true` | The default: 3 slides ahead. |
| `{ ahead: n }` | `n` slides ahead. `0` loads none ahead. |
| `false` | Turns it off. |

After each move, the pictures of the slide on screen, the one before and the next `ahead` slides load in idle time. 3 seconds after the page has loaded, every slide's pictures load. At most two pictures load at a time, the ones near the current slide first, so on a slow network the whole deck does not hold up the next slide.

- When the browser asks to save data, or the connection is 2g or 3g, only the slides around the current one are loaded ahead. The whole deck would cost a download of every picture.
- The pictures are found by the generator: `<img src>` and markdown pictures, `url()` in inline styles, and the frontmatter's `image`, `backgroundImage` and `background`.
- `preload: false` in a slide's frontmatter leaves that slide out.
- All slides are in the first bundle, so `preload` has no other effect here.

## Progress in a component

`preloadProgress` (0 to 1) and `preloadComplete` in `slide-ng/lib/preload-images` are signals a component can read:

```ts
import { Component } from '@angular/core';
import { preloadComplete, preloadProgress } from 'slide-ng/lib/preload-images';

@Component({
  selector: 'preload-status',
  template: '@if (!done()) { Loading pictures: {{ (progress() * 100).toFixed(0) }}% }',
})
export class PreloadStatus {
  progress = preloadProgress;
  done = preloadComplete;
}
```

A picture that still fails after two retries counts as done, so the progress reaches 1. With `preloadImages: false` it is complete from the start. When the whole-deck pass is skipped to save data, `preloadComplete` becomes true only once every slide's pictures were loaded by visiting them.
