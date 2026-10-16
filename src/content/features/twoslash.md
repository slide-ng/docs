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

`//    ^?` shows the type of the word above the `^`.

A block that does not compile is shown without types, with a warning in the output. The `twoslash: dev|build` switch of Slidev is not read.
