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

## Links

As in Slidev, a markdown link to a slide moves inside the deck, and a link to a web page opens a new tab:

```md
[go to slide 5](5), or [5](/5), [5](./5), [5](#/5)
[pricing](/pricing) goes to the slide with routeAlias: pricing
[results](#results) goes to a heading of this slide
[the docs](https://example.org) opens in a new tab
```

- An address of only digits, or `/`, `./` or `#/` followed by a slide number or a `routeAlias`, becomes a `<slide-ng-link>`. A click moves to that slide without loading the page again, with history or hash routing, a base or an offline folder. Ctrl or Cmd + click opens it in a new tab. A number past the last slide goes to the last slide.
- Other addresses that start with `/` or `./`, such as `/file.pdf` or a name that is no `routeAlias`, stay plain links.
- `#id` and `./#id` scroll to that element of the slide. `#5` is such an anchor too: write `5` or `#/5` for slide 5.
- An `http:` or `https:` address gets `target="_blank" rel="noopener"`. `mailto:` and other links stay as they are.
- An `<a>` written as HTML is left as written. Use `<slide-ng-link to="4">` for a link to a slide in HTML.
- In speaker notes a web page opens a new tab too, but a link to a slide stays a plain address.
- In an exported PDF a link to a slide points at that slide's page, see [Export](./export.md#links-in-a-pdf).

The differences with Slidev are on the [differences page](../migrating/from-slidev.md).

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
