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

`@keyframes` work. UnoCSS's directives work as in Slidev: `@apply p-4 text-red-500;`, `--uno: p-4;`, `@screen md { ... }` and `theme('colors.red.500')` are written out as CSS. `h1 { @apply dark:text-white; }` becomes a rule for dark mode, and `forward:`, `backward:`, `light:` and `rtl:` work the same way. See [UnoCSS](./unocss.md#directives).
