---
title: Marks
description: Draw hand-made marks on text at a click.
---

# Marks

`v-mark` draws a hand-made mark on an element at a click, with rough-notation. The library is only loaded when a deck uses it. It works like `v-click`:

```md
<span v-mark.red.circle="1">circled at click 1</span>
<span v-mark.underline>underlined at the next click</span>
<span v-mark="{ at: 3, type: 'box', color: '#234' }">boxed at click 3</span>
<span v-mark="[2, 4]">shown at clicks 2 and 3 only</span>
```

Modifiers:

- Type: `underline` (the default), `circle`, `highlight`, `box`, `bracket`, `strike-through` (also `strike`, `line-through`), `crossed-off` (also `cross`).
- Colour: `red`, `blue`, `green`, `orange`, `yellow`, `pink`, `purple`, `teal`, `cyan`, `indigo`, `lime`, `gray`, `black`, `white`.
- `.delay300` waits 300 ms after the click, and `.op50` sets the opacity.

In the object form, any rough-notation option works: `strokeWidth`, `padding`, `iterations`, `animationDuration`, `brackets`, `multiline`. `true` shows the mark from the start and `false` never.
