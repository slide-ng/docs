---
title: Line highlighting
description: Highlight lines of a code block, and step through ranges with clicks.
---

# Line highlighting

Put line numbers in braces after the language. The highlighted lines stay normal and the others are dimmed.

````md
```ts {2,3}
const a = 1
const b = 2
const c = 3
const d = 4
```
````

Separate ranges with `|` to move through them, one range per click:

````md
```ts {1|3-4|all}
const a = 1
const b = 2
const c = 3
const d = 4
```
````

- A range is a line (`2`), a list (`2,3`) or a span (`3-4`).
- `all` shows every line normally. `hide` shows nothing. `*` highlights nothing and keeps every line normal.
- Each `|` adds one click to the slide.
- In the options brace, `at` is the first click of the ranges (default `+1`) and `finally` is what is shown after the last click: `last`, `all`, `hide` or a range. Example: `{1|2} {at:'+1', finally:'last'}`.

Options go in a second brace, so `{2,3|5|all} {lines:true}` is valid.
