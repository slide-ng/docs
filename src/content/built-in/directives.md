---
title: Directives
description: The attributes you add to elements in a slide - slide-ng-click, slide-ng-after, slide-ng-mark, slide-ng-motion and slide-ng-drag.
---

# Directives

Directives are attributes you put on an HTML element in a slide.

| Directive | What it does | Page |
| --- | --- | --- |
| `slide-ng-click` | Shows the element at a click. Takes nothing, a number (`"3"`), a relative step (`"+2"`) or, as a binding, a range `[slide-ng-click]="[2, 4]"`. | [Clicks](../guide/animations.md) |
| `slide-ng-after` | Shows the element at the same click as the one before it, a relative `+0`. | [Clicks](../guide/animations.md) |
| `slide-ng-click-hide` | With `slide-ng-click`, hides the element at the click instead of showing it. | [Clicks](../guide/animations.md) |
| `slide-ng-mark` | Draws a hand-made mark at a click. Modifiers pick type and colour. | [Marks](../features/marks.md) |
| `slide-ng-motion` | Moves an element between named states. | [Motion](../features/motion.md) |
| `slide-ng-drag` | Makes an element movable and resizable, and saves the position. Takes `[x, y, width, height]`, a name from `dragPos`, or nothing. | [Draggable elements](../features/draggable.md) |

## Two forms of the same value

Angular reads `slide-ng-click="3"` as plain text, and slide.ng turns it into the number 3. For a value that is computed, or an array, use a binding: `[slide-ng-click]="[2, 4]"`.

## Relative and absolute clicks

A bare `slide-ng-click`, `+n`, `slide-ng-after` and a bare `slide-ng-mark` count from the relative counter, as in Slidev: the last plain or `+n` click before them. An absolute number such as `slide-ng-click="3"` does not move that counter. So after only absolute clicks, `slide-ng-after` shows from the start: give it a number too.

## Components that work with them

`<slide-ng-clicks>` gives a click to each item of a list, each row of a table or each child. `<slide-ng-switch>` shows one child per click. `<slide-ng-click-gap>` skips clicks. `<slide-ng-drag>` and `<slide-ng-drag-arrow>` are the component forms of `slide-ng-drag`. See [Components](./components.md).

## Not available

Vue's own directives (`v-if`, `v-for`, `v-model`, `v-bind`) are not there. Use Angular's control flow, see [Angular in markdown](../guide/angular-templates.md). Slidev's slide hooks (`onSlideEnter`, `onSlideLeave`) are not supported either.
