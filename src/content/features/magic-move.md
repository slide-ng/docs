---
title: Magic Move
description: Animate between several versions of a code block, one click each.
---

# Magic Move

Several code steps in one block, moving between them with a click each. The animation is `@shikijs/magic-move`, loaded only when a deck uses it.

Use a fence with four backticks and `magic-move` after the language. Inside it, write normal fences, one per step:

`````md
````md magic-move {lines: true}
```js {*|1|2-3}
let count = 1
function add() { count++ }
```

```ts
let count: number = 1
const add = () => count += 1
```
````
`````

- Each inner fence is one step. Ranges inside a step add clicks of their own, so `{*|1|2-3}` is three steps.
- Options after `magic-move`: `lines`, `at` (the first click) and `duration` in milliseconds.
- `magicMoveDuration` in the headmatter sets the duration for the deck, and `magicMoveCopy: false` removes the copy button.
- A `[title]` before the options gives a title bar.

Only some `shiki.magicMove` options of Slidev are read. The stagger is fixed.
