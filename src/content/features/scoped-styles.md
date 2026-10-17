---
title: Scoped styles
description: A style block that applies to one slide only.
---

# Scoped styles

A `<style>` block in a slide applies to that slide only.

```md
# Red title

<style>
h1 { color: red; }
</style>
```

The CSS is placed inside the slide's own element with native CSS nesting, so every selector matches only inside that slide, layout elements included. For example `.two-cols-header { column-gap: 20px }` works. Nested rules and `&` work too.

`@keyframes` work. UnoCSS directives such as `--uno: ...` and `@apply` do not work, and the generator warns about them. Use utility classes in the HTML instead, see [Styling](../guide/styling.md).
