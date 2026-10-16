---
title: Styling
description: Style slides with UnoCSS utility classes, dark mode variants and plain CSS.
---

# Styling

slide.ng uses *UnoCSS with a Tailwind-like preset. Write utility classes in your HTML and in the `class:` frontmatter key. The CSS for the classes you use is built automatically, and only for them.

```md
---
layout: center
class: text-center
---

# Big and red

<div class="text-6xl font-bold text-red-500">Hello</div>
```

## Dark mode

Dark mode follows the system until the viewer presses `d` or the sun and moon button. The choice is kept in the browser. Use the `dark:` variant for your own markup:

```md
<div class="bg-white dark:bg-black text-black dark:text-white p-4">Adapts</div>
```

`colorSchema: light` or `dark` in the headmatter fixes the mode and hides the button.

## Plain CSS

A `<style>` block applies to its slide only. See [Scoped styles](../features/scoped-styles.md). For CSS that applies to every slide, a `styles/index.css` in a theme, addon or the deck's folder is added after the app's styles.

## Shortcuts and icons

slide.ng defines a few of Slidev's utility shortcuts, such as `bg-main`, `text-primary` and `border-main`. Icons are classes or tags, see [Icons](../features/icons.md). A theme or deck can add its own UnoCSS settings in `uno.config.mjs`, see [Directory structure](../customize/directory-structure.md).
