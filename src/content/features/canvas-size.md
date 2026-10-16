---
title: Canvas size
description: Change the size and the aspect ratio of the slide canvas.
---

# Canvas size

Slides are drawn on a canvas of fixed size and scaled to fit the screen. The default is 980 pixels wide and 16/9, like Slidev. The height is rounded up.

```md
---
canvasWidth: 980
aspectRatio: 16/9
---
```

`aspectRatio` can be a fraction such as `4/3` or a number such as `1.6`. A smaller `canvasWidth` makes everything look bigger on the screen. Positions in `slide-ng-drag` and `<slide-ng-arrow>` are in canvas pixels.
