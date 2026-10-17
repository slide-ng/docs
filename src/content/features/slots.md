---
title: Slots
description: Place parts of a slide with named slot lines.
---

# Slots

A line with only `::name::` starts a named part of the slide. A layout decides where each part goes.

```md
---
layout: two-cols
---

# Left (the default slot)

::right::

# Right
```

- `two-cols` has `::left::` (also the default text) and `::right::`.
- `two-cols-header` has `::left::`, `::right::` and `::bottom::`. The text before the first marker is the header.
- `::default::` goes back to the default part, so parts can be written in any order.
- If the layout has no slot with that name, a warning is printed and the text stays in the normal flow.

Layouts from a theme can declare their own slots in `theme.json`, and a deck's own layouts in a `theme.json` next to `slides.md`. A slot's content reaches the layout as an element with the slot's name as an attribute, so the layout places it with `<ng-content select="[name]" />`. The built-in `two-cols` uses `select="[left]"` and `select="[right]"`. See [Writing a theme](../customize/writing-a-theme.md).
