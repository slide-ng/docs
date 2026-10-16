---
title: Line numbers
description: Show line numbers on one block or on every block.
---

# Line numbers

Add `lines:true` to the options of a block:

````md
```ts {lines:true, startLine:5}
const a = 1
const b = 2
```
````

`startLine` sets the number of the first line. To turn line numbers on for every block, set it once in the headmatter:

```md
---
lineNumbers: true
---
```

A block can still opt out with `lines:false`.
