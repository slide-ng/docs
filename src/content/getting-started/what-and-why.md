---
title: What and why
description: What slide.ng is, how it relates to Slidev, and when to choose it.
---

# What and why

slide.ng is a tool that builds a slide deck from a markdown file. The file format follows *Slidev: slides are separated by `---`, each slide can start with a block of YAML, and notes live in an HTML comment.

What is different is the engine. Slidev renders slides with Vue. slide.ng generates one *Angular component per slide, so the slide's markup is an Angular template.

```md
---
layout: center
---

# Hello

Count is {{ c.n() }}.

<app-counter #c [start]="5" />

<div v-click>Appears on the first click</div>
```

## Why it exists

- You already write Angular, and you want the demo in your talk to be an Angular component, with signals, inputs and your own services, not a copy of it in another framework.
- You want one file for the whole talk that diffs well in git.
- You want a static site as the result, hosted anywhere, with no server.

## What you get

- All 19 Slidev layouts plus `404` and `error`, with the same names and props.
- Clicks, transitions, a presenter view with notes and a timer, drawing, recording.
- Code with Shiki highlighting at build time, stepped line highlights, Magic Move, Twoslash popups, Monaco editors.
- KaTeX math, Mermaid and PlantUML diagrams.
- Export to PDF, PNG, PPTX (pictures) and Markdown, a static build, an offline folder.
- Themes and addons, setup files, an MCP server.

## What to know before you choose it

- It is not a fork of Slidev. It uses Slidev's published markdown parser and ports its click logic, and everything else is new code. See [Credits](../project/credits.md).
- Slidev themes and addons are written for Vue and cannot be used. The four official themes were rebuilt for slide.ng. See [Theme gallery](../customize/theme-gallery.md).
- Some features are missing. [Not supported](../migrating/not-supported.md) lists them, and [What differs](../migrating/from-slidev.md) explains the syntax changes.
- It needs a recent Node (22.22.3 or newer) and, for export, a local Chromium.

## Next

[Install](./install.md) it and [make your first deck](./first-deck.md).
