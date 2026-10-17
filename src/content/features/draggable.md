---
title: Draggable elements
description: Move and resize elements on a slide, and save the position into the markdown.
---

# Draggable elements

`slide-ng-drag` makes an element movable:

```md
<img slide-ng-drag="[100, 200, 300, 150]" src="/pic.png">   <!-- x, y, width, height, in slide pixels -->
<div slide-ng-drag="square">named: numbers in the frontmatter</div>
<div slide-ng-drag>starts where it is and can be moved</div>
<slide-ng-drag pos="100,200,300,_">height follows the content</slide-ng-drag>
<slide-ng-drag-arrow pos="100,100,200,100" color="red" [width]="3" />  <!-- from (100,100), 200 right and 100 down -->
```

A named position lives in the slide's frontmatter:

```md
---
dragPos:
  square: 600,300,100,100
---
```

Click an element to select it. Corner handles resize it (Shift keeps the shape), the round handle above rotates it (Shift snaps to 15 degrees), and the arrow keys move it by 1 pixel (Shift: 10).

`slide-ng-drag-arrow` takes `pos` as `x,y,width,height`, as in Slidev: it goes from (x, y) to (x + width, y + height), and the sizes may be negative.

While `slide-ng dev` runs, the new place is written back into `slides.md`, and a name is written to `dragPos`. A name that is missing from the slide's `dragPos` is reported, and the element starts where the layout puts it. Dragging on a slide with `zoom` follows the pointer. A built deck keeps a move only until the page closes. Put the element directly in the slide, not inside a positioned wrapper, as in Slidev.
