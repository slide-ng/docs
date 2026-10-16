---
title: Running code
description: Run the code of an editor in a sandbox and show the result.
---

# Running code

`{monaco-run}` is an editor with a Run result below it.

````md
```ts {monaco-run} {autorun:false, showOutputAt:'+1', height:'auto'}
console.log('runs on a click and the result appears')
```
````

- `autorun` is `true`, `false` or `'once'`.
- `showOutputAt:'+1'` shows the output after a click.
- The code runs in a sandboxed frame with no access to the slides, and stops after 5 seconds.
- TypeScript is turned into JavaScript for you.
- `import` is not supported.

To run another language, a `setup/code-runners.ts` file maps a language id to a function. See [Setup hooks](../customize/setup-hooks.md).
