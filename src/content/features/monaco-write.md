---
title: Writing back to files
description: Edit a snippet file from the slide while the dev server runs.
---

# Writing back to files

`{monaco-write}` on a snippet line makes the editor save into the imported file:

```md
<<< ./snippets/demo.ts {monaco-write}
```

While `slide-ng dev` runs, edits are saved into that file about half a second after you stop typing. The file must be a whole file inside the deck's folder.

A region, a plain code block or a static build gets a normal editor, and the generator warns for the first two. See [Import snippets](./import-snippets.md).
