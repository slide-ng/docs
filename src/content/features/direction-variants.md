---
title: Direction variants
description: Style an element differently when moving forward or backward.
---

# Direction variants

After a move, the stage carries the class `slidev-nav-go-forward` or `slidev-nav-go-backward` until the next move. slide.ng adds two UnoCSS variants that use it:

```md
<div class="forward:text-red backward:text-blue">
  Red after a move forward, blue after a move backward.
</div>
```

Use it together with a [transition](../guide/animations.md) on the slide, so the styles change while the slides move.
