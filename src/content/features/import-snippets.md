---
title: Import snippets
description: Put a file, or one region of it, into a code block.
---

# Import snippets

`<<<` puts a file, or one part of it, into a code block. It takes the same title, ranges and options as a fence.

```md
<<< ./snippets/example.ts
<<< ./snippets/example.ts#greet
<<< ./snippets/example.ts#greet ts {1|2}
<<< @/snippets/example.ts {*}{lines:true}
```

The path is relative to the markdown file. `@/` is the folder of the entry `slides.md`.

`#greet` is a region written in the file between markers:

```ts
// #region greet
export const greet = (name: string) => `Hello ${name}`;
// #endregion greet
```

Also recognised are `<!-- #region -->`, `/* #region */` and `# region`. The markers are not part of the imported code. A missing file is a warning and a comment in the block.

To edit the imported file from the slide while the dev server runs, see [Writing back to files](./monaco-write.md).
