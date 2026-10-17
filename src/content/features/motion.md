---
title: Motion
description: Move an element between named states with slide-ng-motion.
---

# Motion

`slide-ng-motion` moves an element between named states. It is a small substitute for Slidev's, built on CSS transitions without spring physics.

```md
<div slide-ng-motion
  :initial="{ x: -80, opacity: 0 }"
  :enter="{ x: 0, opacity: 1 }"
  :click-1="{ y: 30 }"
  :click-2-4="{ scale: 1.5, transition: { duration: 800 } }"
  :leave="{ x: 80 }">
  slide.ng
</div>
```

| State | When |
| --- | --- |
| `initial` | Before the slide is shown. |
| `enter` | While the slide is shown. |
| `click-N` | From click N on. `click-N-M` is from click N until click M, M not included. Later clicks win. |
| `leave` | After the slide. |

Put `slide-ng-click` on the same element and it uses `initial` before its click and `enter` after. Properties are `x` and `y` (pixels), `scale`, `scaleX`, `scaleY`, `rotate` (degrees), `opacity`, and any other CSS property in camelCase. `transition: { duration, delay, ease }` takes milliseconds, milliseconds and a CSS timing function, with defaults 500, 0 and `ease-out`.

In a PDF made with `--with-clicks`, the states follow the clicks. A `click-N-M` state is not applied in print and in the overview.

Not supported: springs, `hovered`, `tapped`, `focused`, `visible`, keyframe lists and presets.
