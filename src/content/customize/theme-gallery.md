---
title: Theme gallery
description: The five official slide.ng themes, with a live deck for each and credits to the original designers.
---

# Theme gallery

This page is part of the Resources menu. Decks made with the themes are in the [Showcases](../resources/showcases.md), the [starter](../resources/starter.md) deck has its own page, and every demo deck is on the [Live demos](../resources/demos.md) page. The themes repository also publishes its decks as a standalone site at [slide-ng.github.io/themes](https://slide-ng.github.io/themes/).

Four of the official themes are ports of the official Slidev themes, rebuilt as Angular code for slide.ng, and `adev` is a new theme inspired by angular.dev. Each one lives in its own package in the slide-ng/themes repository: `@slide-ng/theme-seriph`, `@slide-ng/theme-shibainu`, `@slide-ng/theme-bricks`, `@slide-ng/theme-apple-basic` and `@slide-ng/theme-adev`. Each deck below has a slide for every layout of its theme, and the adev deck has a slide for every component too. The theme fonts load from Google Fonts, so the decks look right with a network. Each deck has a small theme switcher in the top left corner that opens the same slide in another theme. It is only in these demos and is not part of the theme packages.

<ngmd-tabs>
  <ngmd-tab title="seriph">
    <ngmd-demo src="/demos/theme-seriph/" title="seriph, 7 slides"></ngmd-demo>
  </ngmd-tab>
  <ngmd-tab title="shibainu">
    <ngmd-demo src="/demos/theme-shibainu/" title="shibainu, 14 slides"></ngmd-demo>
  </ngmd-tab>
  <ngmd-tab title="bricks">
    <ngmd-demo src="/demos/theme-bricks/" title="bricks, 9 slides"></ngmd-demo>
  </ngmd-tab>
  <ngmd-tab title="apple-basic">
    <ngmd-demo src="/demos/theme-apple-basic/" title="apple-basic, 11 slides"></ngmd-demo>
  </ngmd-tab>
  <ngmd-tab title="adev">
    <ngmd-demo src="/demos/theme-adev/" title="adev, 39 slides"></ngmd-demo>
  </ngmd-tab>
</ngmd-tabs>

## seriph

A theme with serif fonts and a blue-grey accent. Original by [Anthony Fu](https://github.com/antfu).

- Fonts `PT Serif` for text and headings and `PT Mono` for code, loaded from the font provider.
- The accent `#5d8392` colours `h1`, links on hover and the quote bar.
- A `cover` layout with a dimmed `background` (a picture or a colour). The original's random cover photo is not used, so a cover without `background` is a blue-grey gradient.

## shibainu

A dark theme in brown and tan with light grey text. Original by [iiiiiiinès](https://github.com/iiiiiiines).

- Fonts `Titillium Web` and `Fira Code`. The theme has dark colours only, so a deck that uses it stays dark. slide.ng warns when the deck asks for another mode.
- 14 layouts with the original's names: `cover`, `default`, `center`, `section`, `section-2`, `section-3`, `default-2` to `default-7`, `right` and `quote`.
- The original's vector illustrations are replaced by flat shapes drawn in CSS.

## bricks

A light theme of flat coloured shapes with a serif title font. Original by [iiiiiiinès](https://github.com/iiiiiiines).

- Fonts `Signika Negative`, `Sigmar One` and `Fira Code`. The theme has light colours only, so a deck that uses it stays light. slide.ng warns when the deck asks for another mode.
- 9 layouts with slots: `cover`, `intro`, `default`, `section`, `items`, `quote`, `fact`, `statement` and `blank`.
- The eleven polygon shapes of the original as `<polygon-1 />` to `<polygon-11 />`, sized with classes such as `class="w-20 h-20"`.

## apple-basic

A plain white theme after Keynote's "Basic White". Original by [Jeremy Meissner](https://github.com/JeremyMeissner).

- Helvetica Neue as a local font, so nothing is downloaded.
- 10 layouts: `intro`, `intro-image`, `intro-image-right`, `image-right`, `bullets`, `section`, `statement`, `fact`, `quote` and `3-images`.
- No pictures of its own: picture props take an address or a colour.

## adev

The look of [angular.dev](https://angular.dev), the Angular documentation site, in light and dark. Inspired by angular.dev, not an official Angular theme.

- Fonts `Inter`, `Inter Tight` and `DM Mono`. The grey scale, accent colours and gradients are adev's own tokens, with its dark mode mixes.
- Light and dark are both complete, as on angular.dev, with the theme's own switch: a small sun or moon button in the top right corner of every slide. It only recolours the slides, not the slide.ng dock, and the choice is stored and starts from the system preference. The theme sets no `colorSchema`, so the deck keeps its own page mode.
- Code uses angular.dev's Shiki themes (`github-light` and `github-dark`), and Angular code is highlighted out of the box: `angular-ts`, `angular-html`, `ng`, `ng-ts` and `ng-html` fences need no setup file, including `@Component` templates and `@if`, `@for` and `@defer` blocks.
- 12 layouts: `cover`, `intro`, `default`, `center`, `section`, `two-cols`, `image-right`, `image-left`, `quote`, `fact`, `statement` and `end`.
- Components: alerts (ten kinds, nine of them also as `NOTE:` paragraphs), pills, API item labels, kbd keys, a decorative header, `<adev-card-grid>` with `<adev-card>`, `<adev-stat>`, `<adev-count-up>`, `<adev-steps>` and `<adev-button>`.
- Code: prefer and avoid cards (`{prefer}` and `{avoid}` fences), line numbers, highlights, diff lines, a copy button, `::code-group` file tabs, `<<<` snippet cards and `<adev-code-card>`.
- Media: tabs with `<adev-tab-group>`, image sizes (`#small`, `#medium`), `<adev-video>` and Mermaid diagrams drawn in the theme colours.
- Every component has its syntax and an example in the [theme README](https://github.com/slide-ng/themes/blob/main/packages/theme-adev/README.md).
- No Angular logo, wordmark or mascot is included.

## Use one

```md
---
theme: bricks
---
```

See [Themes and addons](./themes.md) for installing and for how a theme is found.

## Credits and licence

`adev` follows the design tokens and styles of angular.dev (Angular, MIT licensed, copyright (c) 2010-2026 Google LLC). slide.ng is a community project and is not affiliated with or endorsed by Google or the Angular team. The Angular logo is CC BY 4.0 and is not used.

The code of the original Slidev themes is MIT licensed, copyright (c) 2021 Slidev.js Team. The layout names, slots, CSS values and font settings follow the originals, and the Angular components are new code. The images and other assets of the original themes are licensed CC BY-NC-SA 4.0, which does not allow commercial use, so none of them is copied. Where an original draws a picture, the port draws its own CSS gradients, and code colours come from Shiki instead of Prism. Each package's README says what is ported and what differs.

There is no community theme gallery, and community Slidev themes cannot be used.
