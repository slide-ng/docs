---
title: Motion
description: Move an element between named states with v-motion.
---

# Motion

`v-motion` moves an element between named states. It is a small substitute for Slidev's, built on CSS transitions without spring physics.

```md
<div v-motion
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
| `click-N` | From click N on. `click-N-M` is from N up to M. Later clicks win. |
| `leave` | After the slide. |

Put `v-click` on the same element and it uses `initial` before its click and `enter` after. Properties are `x` and `y` (pixels), `scale`, `scaleX`, `scaleY`, `rotate` (degrees), `opacity`, and any other CSS property in camelCase. `transition: { duration, delay, ease }` takes milliseconds, milliseconds and a CSS timing function, with defaults 500, 0 and `ease-out`.

Not supported: springs, `hovered`, `tapped`, `focused`, `visible`, keyframe lists and presets.
