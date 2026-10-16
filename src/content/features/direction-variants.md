---
title: Direction variants
description: Style an element differently when moving forward or backward.
---

# Direction variants

While a transition runs, the stage carries the class `slidev-nav-go-forward` or `slidev-nav-go-backward`. slide.ng adds two UnoCSS variants that use it:

```md
<div class="forward:text-red backward:text-blue">
  Red while a forward transition runs, blue while a backward one runs.
</div>
```

This works together with a [transition](../guide/animations.md) on the slide. Without a transition there is no direction to style.
