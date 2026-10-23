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

- An address of only digits, or `/`, `./` or `#/` followed by a slide number or a `routeAlias`, becomes a `<slide-ng-link>`. A click moves to that slide without loading the page again, with history or hash routing, a base or an offline folder. Ctrl or Cmd + click opens it in a new tab. A number past the last slide goes to the last slide. An alias may be any name, also `./café` or `./My%20Alias`.
- Other addresses that start with `/` or `./`, such as `/file.pdf` or a name that is no `routeAlias`, stay plain links.
- The generator warns, naming the slide, about a number past the last slide (`[far](99)`), a `./name` or `#/name` that is no `routeAlias`, and a link to the alias of a slide with `hide:`. A `/name` is not warned about, since it may be a page of the site.
- `#id` and `./#id` scroll to that element of the slide. `#5` is such an anchor too: write `5` or `#/5` for slide 5.
- An `http:` or `https:` address gets `target="_blank" rel="noopener"`. `mailto:` and other links stay as they are. To open a web page in the same tab, write the link as HTML: `<a href="https://example.com">x</a>` is left as written.
- An `<a>` written as HTML whose `href` is a slide (`<a href="/3">`, also `./3`, `#/3` or an alias) becomes a `<slide-ng-link>` too. It keeps its `class`, `id` and `style`. With other attributes, such as `target`, it is left as written, with a warning that names its line, because it does not reach the slide with hash routing, a base or offline. `<slide-ng-link to="4">` always works.
- In speaker notes a web page opens a new tab too. A link to a slide moves the presenter to that slide, see [Speaker notes](../features/speaker-notes.md).
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

## Errors and warnings

Messages start with the file and line they are about (`slides.md:12: ...`), or with the slide (`[slides] slide 4: ...`). A warning keeps the deck running, and an error stops the build. In the dev server a red banner or Angular's error overlay shows the message, the same after a reload as in the terminal, and the last good slides stay on screen until the file is fixed.

- A mistyped name gets the nearest real one: `layout: image-rigth` gets "Did you mean "image-right"?", and so do `<slide-ng-tocc />`, `slide-ng-clik` and a component tag one or two letters away from one of yours. Any unknown `slide-ng-*` name is a warning.
- Angular's own errors name the slide and the line of the markdown they are on.
- An element left open, such as a `<div>` without `</div>`, a closing tag with another name, or a closing tag that closes nothing, stops the build with a message that names the slide and the tag.
- The usual YAML slips in a frontmatter are said in plain words, with the line: a value with `: ` in it (quote it, `title: "Part 2: the plan"`), a tab (YAML needs spaces), a quote that is never closed, and a missing closing `---`. A heading that became a YAML comment because the closing `---` is missing gets a warning too.

## Formatting the file

`slide-ng format` tidies spacing and rewrites the frontmatter as clean YAML. See [Formatting](../features/format.md).
