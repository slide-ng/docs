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
- The code runs in a worker of a sandboxed frame, with no access to the slides, and stops after 5 seconds. A run stuck in an endless loop holds up nothing else, and pressing run again or leaving the slide stops it at once. `console` works; the worker has no `document`, `parent` or `alert`.
- The code runs in strict mode, as in Slidev: `total = 1` without `let` or `const` stops with "ReferenceError: total is not defined". `monacoRunUseStrict: false` in the headmatter runs it without `"use strict"`.
- The output takes its click in document order: an output at `showOutputAt:'+1'` followed by a `slide-ng-click` shows first.
- TypeScript is turned into JavaScript for you.
- `console.table` and `console.group` are shown too.
- `import` is not supported.

To run another language, a `setup/code-runners.ts` file maps a language id to a function. The runner is picked by the language of the code fence, also one Monaco does not know. An editor whose language has no runner says so instead of running it as JavaScript. See [Setup hooks](../customize/setup-hooks.md).
