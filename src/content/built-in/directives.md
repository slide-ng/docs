---
title: Directives
description: The attributes you add to elements in a slide - v-click, v-after, v-mark, v-motion and v-drag.
---

# Directives

Directives are attributes you put on an HTML element in a slide.

| Directive | What it does | Page |
| --- | --- | --- |
| `v-click` | Shows the element at a click. Takes nothing, a number (`"3"`), a relative step (`"+2"`) or, as a binding, a range `[v-click]="[2, 4]"`. | [Clicks](../guide/animations.md) |
| `v-after` | Shows the element together with the one before it. | [Clicks](../guide/animations.md) |
| `v-click-hide` | With `v-click`, hides the element at the click instead of showing it. | [Clicks](../guide/animations.md) |
| `v-mark` | Draws a hand-made mark at a click. Modifiers pick type and colour. | [Marks](../features/marks.md) |
| `v-motion` | Moves an element between named states. | [Motion](../features/motion.md) |
| `v-drag` | Makes an element movable and resizable, and saves the position. Takes `[x, y, width, height]`, a name from `dragPos`, or nothing. | [Draggable elements](../features/draggable.md) |

## Two forms of the same value

Angular reads `v-click="3"` as plain text, and slide.ng turns it into the number 3. For a value that is computed, or an array, use a binding: `[v-click]="[2, 4]"`.

## Components that work with them

`<v-clicks>` applies `v-click` to the items of a list. `<v-switch>` shows one child per click. `<v-click-gap>` skips clicks. `<v-drag>` and `<v-drag-arrow>` are the component forms of `v-drag`. See [Components](./components.md).

## Not available

Vue's own directives (`v-if`, `v-for`, `v-model`, `v-bind`) are not there. Use Angular's control flow, see [Angular in markdown](../guide/angular-templates.md). Slidev's slide hooks (`onSlideEnter`, `onSlideLeave`) are not supported either.
