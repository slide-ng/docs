---
title: Importing slides
description: Build a deck from several markdown files with src.
---

# Importing slides

`src:` in a slide's frontmatter replaces that slide with the slides of another markdown file.

```md
---
src: ./pages/intro.md
class: from-here
---
```

A range after `#` picks some of the imported slides: `src: ./pages/intro.md#2,4-6`.

- Keys set on the importing slide win over the keys of the imported slides, see [Default frontmatter](./frontmatter-defaults.md).
- The text of the importing slide is ignored.
- A missing file or a circular import is reported when the slides are generated, and the slide is skipped.
- The path is relative to the file that holds the `src:` line.

Imported files are not touched by `slide-ng format` unless you name them as arguments. The dev server cannot edit imported slides that lie outside the deck's folder.
