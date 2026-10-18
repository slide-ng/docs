---
title: Showcases
description: Example decks made with slide.ng, each one a project you can read, run and copy.
---

# Showcases

These decks are made with slide.ng. Every one is a normal project in the [slide.ng-showcases](https://github.com/slide-ng/slide.ng-showcases) repository: a `slides.md` and, where the deck needs them, its own components, setup files, styles, layouts and snippets. Open a deck here, then read its source next to it.

Pick a card to see the deck in a frame on its own page. The frames load from GitHub Pages (`slide-ng.github.io`).

<ngmd-showcase-grid>

<!-- showcases:start -->

- [Angular Workshop](/resources/showcases/angular-workshop)
- [Signals Deep Dive](/resources/showcases/signals-deep-dive)
- [Forms and Di](/resources/showcases/forms-and-di)
- [Pipes and i18n](/resources/showcases/pipes-and-i18n)
- [Control Flow Torture](/resources/showcases/control-flow-torture)
- [Angular Animations and Styles](/resources/showcases/angular-animations-and-styles)
- [Scaffold Flow](/resources/showcases/scaffold-flow)
- [Clicks Masterclass](/resources/showcases/clicks-masterclass)
- [Motion and Transitions](/resources/showcases/motion-and-transitions)
- [Magic Move Stories](/resources/showcases/magic-move-stories)
- [Monaco and Twoslash](/resources/showcases/monaco-and-twoslash)
- [Polyglot Code](/resources/showcases/polyglot-code)
- [Diagram Zoo](/resources/showcases/diagram-zoo)
- [Math Lecture](/resources/showcases/math-lecture)
- [Math Heavy](/resources/showcases/math-heavy)
- [Markdown Extras](/resources/showcases/markdown-extras)
- [Layouts and Sizes](/resources/showcases/layouts-and-sizes)
- [Layouts and Sizes Portrait](/resources/showcases/layouts-and-sizes-portrait)
- [Presenter and Drawing](/resources/showcases/presenter-and-drawing)
- [All Setup Hooks](/resources/showcases/all-setup-hooks)
- [Theme Switcher](/resources/showcases/theme-switcher)
- [Typography History](/resources/showcases/typography-history)
- [Recipes Zine](/resources/showcases/recipes-zine)
- [Brand Deck](/resources/showcases/brand-deck)
- [Forest Carbon Report](/resources/showcases/forest-carbon-report)
- [Architecture Review](/resources/showcases/architecture-review)
- [Conference Keynote](/resources/showcases/conference-keynote)
- [Product Update](/resources/showcases/product-update)
- [Ship It](/resources/showcases/ship-it)
- [RTL and Languages](/resources/showcases/rtl-and-languages)
- [Edge Cases](/resources/showcases/edge-cases)

<!-- showcases:end -->

</ngmd-showcase-grid>

## Add your own

1. Make a folder in `decks/` of the showcases repository with a `slides.md`.
2. Add it to `showcases.json` with a `slug` (the folder name), a `theme`, a one-line `blurb` and a few `tags`.
3. Run `node scripts/readme.mjs` to update the table in its README, and `npm run build:one -- <slug>` to build the deck and check it.
4. Open a pull request.

The pages on this site are generated from `showcases.json`: `pnpm run showcases` in the docs repository rewrites them.
