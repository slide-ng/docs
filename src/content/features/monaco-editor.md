---
title: Monaco editor
description: Put an editable code editor, or a diff, in a slide.
---

# Monaco editor

An editor in the slide. *Monaco is loaded only when a deck has one, and it needs no network.

````md
```ts {monaco}
const message: string = 'edit me'
```

```ts {monaco-diff}
console.log('Original text')
~~~
console.log('Modified text')
```
````

- `{monaco}` is an editor with the code. Options go in a second brace: `lines`, `readonly`, `height` (`initial`, `auto` or a CSS size).
- `{monaco-diff}` shows two texts side by side, split by a line that holds only `~~~`.
- The editors follow the deck's dark mode. A `setup/monaco.ts` can give a theme of its own for each mode.

Keys typed in an editor do not trigger slide shortcuts. A `setup/monaco.ts` file changes editor options for the whole deck, see [Setup hooks](../customize/setup-hooks.md).

Monaco does not load type definitions of packages (`monacoTypesSource` is not supported), so it does not know types from `node_modules`.

<ngmd-callout type="warning" title="Size">

A deck with Monaco and Mermaid becomes a large script in an offline folder. See [Presenting offline](../guide/offline.md).

</ngmd-callout>
