---
title: Layouts
description: Choose how a slide is arranged with the layout key, and fill named parts with slots.
---

# Layouts

A layout decides how a slide's content is placed. Pick one in the slide's frontmatter:

```md
---
layout: image-right
image: /photo.png
---

# A title

Text next to the picture.
```

slide.ng has all the layouts of Slidev, with the same names and props, plus `404` and `error`. The first slide is `cover` and every other slide is `default` unless you say otherwise. An unknown name prints a warning that names the nearest layout, lists the real names and uses `default`.

<ngmd-image src="/images/layouts/two-cols.png" alt="A slide with two columns" caption="The two-cols layout" width="480"></ngmd-image>

The [Layouts reference](../built-in/layouts.md) lists every layout with its props and a picture. A theme can add layouts or replace a built-in one, see [Themes and addons](../customize/themes.md).

## Props

Some layouts read extra frontmatter keys. For example `image` and `backgroundSize` for the image layouts, `url` and `scale` for the iframe layouts, `background` for `cover`.

```md
---
layout: iframe-left
url: https://angular.dev
scale: 0.8
class: p-8
---

# Next to a web page
```

For layouts with a `class` prop (`image-left`, `image-right`, `iframe-left`, `iframe-right`, `two-cols`, `two-cols-header`), the `class` goes to the content area. For the others it goes on the layout itself.

## Slots

`two-cols` and `two-cols-header` have named slots. A line with only `::right::` starts the right column:

```md
---
layout: two-cols-header
---

This is the header

::left::

# Left

::right::

# Right

::bottom::

A row under both columns.
```

`::default::` goes back to the default part, so parts can be written in any order. If the layout has no slot with that name, a warning is printed and the text stays where it was.

## Your own layout

A layout is a standalone Angular component in a `layouts/` folder next to `slides.md`. See [Layouts and components](../customize/layouts-components.md).
