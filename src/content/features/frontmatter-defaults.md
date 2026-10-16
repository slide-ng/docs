---
title: Default frontmatter
description: Set frontmatter that every slide starts from, and how imported frontmatter merges.
---

# Default frontmatter

`defaults` in the headmatter holds frontmatter that every slide starts from. A slide's own keys win.

```md
---
title: My talk
defaults:
  layout: center
  transition: fade
---
```

Here every slide that does not set `layout` is centred, including the first one. When the first slide should still be a cover, set `layout: cover` on it.

## Merging with imports

When a slide imports others with `src:`, the keys on the importing slide win over the keys of the imported slides. In the example below the imported slides get `class: from-here`:

```md
---
src: ./pages/intro.md
class: from-here
---
```

A theme can also bring `defaults`. The deck's own headmatter wins over the theme's, and `defaults`, `fonts`, `drawings`, `htmlAttrs` and `themeConfig` are merged key by key. See [Themes and addons](../customize/themes.md).
