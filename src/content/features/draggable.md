---
title: Draggable elements
description: Move and resize elements on a slide, and save the position into the markdown.
---

# Draggable elements

`v-drag` makes an element movable:

```md
<img v-drag="[100, 200, 300, 150]" src="/pic.png">   <!-- x, y, width, height, in slide pixels -->
<div v-drag="square">named: numbers in the frontmatter</div>
<div v-drag>starts where it is and can be moved</div>
<v-drag pos="100,200,300,_">height follows the content</v-drag>
<v-drag-arrow pos="100,100,300,200" color="red" [width]="3" />
```

A named position lives in the slide's frontmatter:

```md
---
dragPos:
  square: 600,300,100,100
---
```

Click an element to select it. Corner handles resize it (Shift keeps the shape), the round handle above rotates it (Shift snaps to 15 degrees), and the arrow keys move it by 1 pixel (Shift: 10).

While `slide-ng dev` runs, the new place is written back into `slides.md`, and a name is written to `dragPos`. A built deck keeps a move only until the page closes. Put the element directly in the slide, not inside a positioned wrapper, as in Slidev.
