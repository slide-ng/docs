---
title: Global layers
description: Components drawn over or under every slide.
---

# Global layers

A layer is a component that is drawn on top of or below slides. Add a file named after the layer to a `layers/` folder next to `slides.md`, a theme or an addon:

| File | Where it is drawn |
| --- | --- |
| `layers/global-top.ts` | Once, over all slides. |
| `layers/global-bottom.ts` | Once, under all slides. |
| `layers/slide-top.ts` | Inside every slide, on top. |
| `layers/slide-bottom.ts` | Inside every slide, below. |

Each file default-exports a standalone component:

```ts
// layers/global-top.ts
import { Component, inject } from '@angular/core';
import { SLIDE_NO } from 'slide-ng/lib/slide-context';

@Component({
  selector: 'my-footer',
  template: '<div class="absolute bottom-2 right-4 text-sm">Slide {{ no }}</div>',
})
export default class MyFooter {
  no = inject(SLIDE_NO);
}
```

Layers let clicks through. Give your own elements `pointer-events: auto` if they need the mouse. Inject `SLIDE_NO` to know which slide a layer is drawn on. That is right in the PDF and in the overview too, where every slide is drawn at once. `Nav.no()` stays the presented slide there, so a footer that reads it prints the same number on every page.
