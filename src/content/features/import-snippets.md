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
<<< ./snippets/greet.py python [greet.py ~i-carbon:code~] {2}{lines:true}
```

The parts come in this order, each one after the path optional: `<<< path#region lang [title] {ranges}{options}`. The title may have spaces and an [icon](./code-groups.md#icons-in-titles). The path cannot have spaces, because a word after it is read as the language.

The path is relative to the markdown file. `@/` is the folder of the entry `slides.md`. Inside a file imported with `src:`, a path starts at that file's folder: write `<<< @/snippets/a.ts` for the deck's own `snippets/` folder. The "not found" warning says so, and names the slide and the file and line it comes from.

`#greet` is a region written in the file between markers:

```ts
// #region greet
export const greet = (name: string) => `Hello ${name}`;
// #endregion greet
```

Also recognised are `<!-- #region -->`, `/* #region */` and `# region`. The markers are not part of the imported code. A missing file is a warning and a comment in the block.

To edit the imported file from the slide while the dev server runs, see [Writing back to files](./monaco-write.md).
