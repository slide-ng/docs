---
title: UnoCSS
description: Attributify, variant groups, the prose preset and UnoCSS directives, as in Slidev.
---

# UnoCSS

Slides are styled with *UnoCSS utility classes, see [Styling](../guide/styling.md). These UnoCSS features work as in Slidev.

```md
<div flex="~ col" text="sm red-500" p="4">Attributify</div>
<div class="hover:(bg-blue-500 text-white)">A variant group</div>
<article class="prose dark:prose-invert">Long text, styled</article>
```

## Attributify

Utilities can be attributes: `<div flex="~ col" text="sm red-500" p="4">`, with a variant in the name (`hover:bg="blue-500"`) or without a value (`<div flex items-center>`). Angular keeps such attributes as they are.

- Only the deck's own files are read this way: slides, `components/`, layouts and the other files of the deck, its theme and addons.
- Some attributes are never read as utilities, because they are inputs or draw an SVG: those of slide.ng's components (`<slide-ng-toc columns="2">`), the frontmatter keys a layout takes (`scale: 0.8` of `iframe-right`), the inputs of the deck's own components, and the attributes of SVG elements (`<text font-size="14">`). Use `class` there.
- Plain HTML attributes are read too: `<table border="1">` gets a border, `<span font="bold">` is bold, `<div m="4">` gets a margin.
- An attribute name cannot have a `/` in it. A bare `<div bg-black/50>` stops the generator with a message that says to write it in the class, `class="bg-black/50"`, or with a value, `bg="black/50"`.

`unocss: { attributify: false }` in the headmatter turns attributify off for the deck, for a deck written for 1.x that uses such attributes as HTML. Classes and variant groups still work.

## Variant groups

`class="hover:(bg-blue-500 text-white)"` is written as `hover:bg-blue-500 hover:text-white` while the deck is generated. It works in attributify values (`text="hover:(red-500 xl)"`) and as a bare attribute, `<div p-4 hover:(bg-teal-50 border-teal-400)>`.

Only a slide's markup is expanded. Code blocks and inline code are shown as written, and the `.ts` files of components, layouts, setup files, themes and addons write the classes out.

## Typography

`class="prose"` styles long text: headings, lists, links and quotes. Add `dark:prose-invert` for dark mode, and `not-prose` on a part that should keep its own look. The speaker notes use it too.

## Directives

UnoCSS's directives work in a slide's `<style>` and in `styles/` of the deck, a theme or an addon:

```md
<style>
h1 {
  @apply text-4xl text-red-500;
}
.card {
  --uno: p-4 rounded shadow;
}
@screen md {
  .card { color: theme('colors.red.700'); }
}
</style>
```

They are written out as CSS while the deck is generated. A utility UnoCSS does not know gives a warning. In a slide's `<style>`, a variant for something outside the slide works too: `h1 { @apply dark:text-white; }` becomes `.dark <slide> h1`, and `forward:`, `backward:`, `light:` and `rtl:` the same way. `group-hover:` and `peer-checked:` look for the `.group` or `.peer` inside the slide.

## Limits

- `text-primary`, `bg-primary` and `border-primary` are shortcuts for the theme's colour, as in Slidev, so they take no opacity: `bg-primary/10` does nothing. Write the colour out, such as `bg-teal-600/10`, or use `color-mix(in srgb, var(--slidev-theme-primary) 10%, transparent)` in a `<style>`.
- The deck's files are read as text, as in Slidev, so a word in backticks in a slide or a note, such as `` `grid` ``, still makes its CSS. That rule also styles an element whose `grid` attribute is an input of your component; name the input otherwise.
- Class names in a theme are found in the `.ts` files of the roots and in the deck's markdown, not in CSS files.
