---
title: Introduction
description: slide.ng turns one markdown file into a slide deck that is compiled with Angular. Start here.
---

<ngmd-hero title="slide.ng" logo="/brand/mark-color.svg" gradient>
  Presentations written in markdown, with real Angular template syntax inside. One file in, a static site out.
</ngmd-hero>

# Introduction

slide.ng is a slide deck tool for people who write talks in markdown and want Angular, not a separate framework, under the slides. It is inspired by *Slidev and keeps Slidev's file format, layout names and many of its features.

You write one file, `slides.md`. Each slide in it becomes a small *Angular component that is compiled ahead of time. That is why `{{ }}`, `@if` and your own standalone components work inside a slide.

The deck below is the starter deck that `slide-ng create` makes. It is a real build, not a screenshot.

<ngmd-demo src="/demos/starter/" title="The starter deck"></ngmd-demo>

## Where to go

<ngmd-card-grid columns="2">
  <ngmd-card icon="rocket" title="Getting started" link="/getting-started/what-and-why" cta="Read">
    What slide.ng is, how to run it, and your first deck.
  </ngmd-card>
  <ngmd-card icon="book" title="Guide" link="/guide/syntax" cta="Read">
    Syntax, layouts, clicks, code, math, presenting, export and hosting.
  </ngmd-card>
  <ngmd-card icon="layers" title="Features" link="/features/importing-slides" cta="Browse">
    One short page for every feature, from importing slides to the MCP server.
  </ngmd-card>
  <ngmd-card icon="file" title="Built-in reference" link="/built-in/headmatter" cta="Look up">
    Layouts, components, directives, shortcuts, CLI flags and every frontmatter key.
  </ngmd-card>
  <ngmd-card icon="palette" title="Customize" link="/customize/themes" cta="Read">
    Themes, addons, setup files, and how to write your own layout or component.
  </ngmd-card>
  <ngmd-card icon="compass" title="Coming from Slidev" link="/migrating/from-slidev" cta="Compare">
    What is the same, what differs, and what is not there.
  </ngmd-card>
</ngmd-card-grid>

## Live decks on this site

Every page that shows a deck embeds a real build of it. You can also open them directly:

- [The starter deck](/getting-started/first-deck)
- [A tour of features](/guide/syntax)
- [The theme gallery](/customize/theme-gallery), one deck for each official theme

<ngmd-callout type="warning" title="Status">
  slide.ng is early. Version 0.1.0 is on npm as `@slide-ng/core`, and some Slidev features are missing. The [list of what is not supported](./migrating/not-supported.md) is kept honest.
</ngmd-callout>
