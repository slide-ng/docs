---
title: Syntax
description: How a slides.md file is read, slide by slide.
---

# Syntax

A deck is one markdown file. Everything else in this guide is a feature you switch on from inside it.

<ngmd-demo src="/demos/tour/" title="A tour of features. Press o for the overview."></ngmd-demo>

## Slides

A line with only `---` separates slides. A block of YAML between two `---` lines at the top of a slide is that slide's frontmatter.

```md
---
title: My talk
---

# First slide

---
layout: center
class: text-red-500
---

# Second slide
```

The frontmatter of the first slide is the headmatter. It describes the whole deck: title, theme, transition, export settings, and so on. The keys of both are in [Headmatter and frontmatter](../built-in/headmatter.md).

If you set nothing, the first slide uses the `cover` layout and every other slide uses `default`.

## Notes

The last HTML comment of a slide is its speaker note. It is stored with the slide and shown in the presenter view, never on the slide.

```md
# Slide

<!-- This text is a note. -->
```

## Slots

A line with only `::name::` starts a named part of the slide, which a layout can place somewhere:

```md
---
layout: two-cols
---

# Left, the default part

::right::

# Right
```

See [Slots](../features/slots.md).

## Importing slides

`src:` in a slide's frontmatter replaces the slide with the slides of another file. See [Importing slides](../features/importing-slides.md).

## Per-slide styles

A `<style>` block in a slide applies to that slide only. See [Scoped styles](../features/scoped-styles.md).

## Code and math

Fenced code is highlighted while the deck is generated. Math uses `$...$` and `$$ ... $$`. Diagrams are `mermaid` and `plantuml` fences. Pages for each: [Code](./code.md), [Diagrams and math](./diagrams-math.md).

## Angular syntax

Interpolation, control flow and your own components work in a slide. Read [Angular in markdown](./angular-templates.md) for the few rules that keep the markdown converter from breaking your template.

## Formatting the file

`slide-ng format` tidies spacing and rewrites the frontmatter as clean YAML. See [Formatting](../features/format.md).
