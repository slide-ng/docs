---
title: Twoslash
description: Show real TypeScript types on hover.
---

# Twoslash

Add `twoslash` after the language, then hover the code to see types. They are worked out while the deck is generated, so no TypeScript reaches the browser.

````md
```ts twoslash
const count = Math.max(1, 2)
//    ^?
```
````

`//    ^?` shows the type of the word above the `^`, on a line of its own under that code line, so it does not cover the code.

A TypeScript error in the block is shown under its line, and the types still work. Add `// @errors: <code>` to mark an error as expected. A code that `// @errors` lists but TypeScript does not report gets a warning that names the slide; the block is still drawn. When Twoslash fails on a block, the warning gives its reason and the slide.

`twoslash` in the headmatter takes `true` (the default), `false`, `dev` or `build`, as in Slidev. `false` shows the blocks without types, and `dev` or `build` runs Twoslash in that mode only. A build and an export count as `build`.
