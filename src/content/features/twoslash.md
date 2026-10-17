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

A TypeScript error in the block is shown under its line, and the types still work. Add `// @errors: <code>` to mark an error as expected. The `twoslash: dev|build` switch of Slidev is not read.
