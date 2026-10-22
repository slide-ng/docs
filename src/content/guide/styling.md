---
title: Styling
description: Style slides with UnoCSS utility classes, dark mode variants and plain CSS.
---

# Styling

slide.ng uses *UnoCSS with a Tailwind-like preset. Write utility classes in your HTML and in the `class:` frontmatter key. The CSS for the classes you use is built automatically, and only for them. Attributify (`<div text="sm red-500">`), variant groups (`hover:(bg-blue-500 text-white)`), the `prose` typography and directives such as `@apply` work as in Slidev, see [UnoCSS](../features/unocss.md).

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

`colorSchema: light` or `dark` in the headmatter fixes the mode and hides the button. A theme made for one mode fixes it too, see [Themes and addons](../customize/themes.md#what-a-theme-can-set).

## Responsive prefixes

`md:`, `lg:` and the other responsive prefixes follow the browser window, not the slide. The slide keeps its own size and is scaled, so the same slide can show another column count on a phone, in the presenter preview or in the PDF. Use plain classes for the slide's layout.

## Plain CSS

A `<style>` block applies to its slide only. See [Scoped styles](../features/scoped-styles.md). For CSS that applies to every slide, a `styles/index.css` in a theme, addon or the deck's folder is added after the app's styles.

UnoCSS's directives work in both: `@apply`, `--uno:`, `@screen` and `theme()`, see [UnoCSS](../features/unocss.md#directives).

The core styles follow Slidev's: code is 12px (`--slidev-code-font-size`), and the paragraph right after a heading is dimmed (`h1 + p`), also when it holds only a component. A raw `<pre>` is not styled.

## Shortcuts and icons

slide.ng defines a few of Slidev's utility shortcuts, such as `bg-main`, `text-primary` and `border-main`. The `primary` ones take no opacity, so `bg-primary/10` does nothing. `themeConfig: { primary: '#5d8392' }` in the headmatter changes the colour of `text-primary`, see [Theme settings](../customize/themes.md#theme-settings). Icons are classes or tags, see [Icons](../features/icons.md). A theme or deck can add its own UnoCSS settings in `uno.config.mjs`, see [Directory structure](../customize/directory-structure.md).
