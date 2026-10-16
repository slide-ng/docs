---
title: Maximum height
description: Limit the height of a code block and scroll inside it.
---

# Maximum height

`maxHeight` makes a long block scroll instead of growing:

````md
```ts {maxHeight:'100px'}
// many lines
```
````

Options only take simple values: numbers, `true` or `false`, and text. The value is a CSS length.
