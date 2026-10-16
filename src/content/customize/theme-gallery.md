---
title: Theme gallery
description: The four official slide.ng themes, with a live deck for each and credits to the original designers.
---

# Theme gallery

The official themes are ports of the official Slidev themes, rebuilt as Angular code for slide.ng. Each one lives in its own package in the *slide.ng-themes repository: `@slide-ng/theme-seriph`, `@slide-ng/theme-shibainu`, `@slide-ng/theme-bricks` and `@slide-ng/theme-apple-basic`. Each deck below has a slide for every layout of its theme. The theme fonts load from Google Fonts, so the decks look right with a network.

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
</ngmd-tabs>

## seriph

A theme with serif fonts and a blue-grey accent. Original by [Anthony Fu](https://github.com/antfu).

- Fonts `PT Serif` for text and headings and `PT Mono` for code, loaded from the font provider.
- The accent `#5d8392` colours `h1`, links on hover and the quote bar.
- A `cover` layout with a dimmed `background` (a picture or a colour). The original's random cover photo is not used, so a cover without `background` is a blue-grey gradient.

## shibainu

A dark theme in brown and tan with light grey text. Original by [iiiiiiinès](https://github.com/iiiiiiines).

- Fonts `Titillium Web` and `Fira Code`. The colour schema is `dark` by default.
- 14 layouts with the original's names: `cover`, `default`, `center`, `section`, `section-2`, `section-3`, `default-2` to `default-7`, `right` and `quote`.
- The original's vector illustrations are replaced by flat shapes drawn in CSS.

## bricks

A light theme of flat coloured shapes with a serif title font. Original by [iiiiiiinès](https://github.com/iiiiiiines).

- Fonts `Signika Negative`, `Sigmar One` and `Fira Code`.
- 9 layouts with slots: `cover`, `intro`, `default`, `section`, `items`, `quote`, `fact`, `statement` and `blank`.
- The eleven polygon shapes of the original as `<polygon-1 />` to `<polygon-11 />`, sized with classes such as `class="w-20 h-20"`.

## apple-basic

A plain white theme after Keynote's "Basic White". Original by [Jeremy Meissner](https://github.com/JeremyMeissner).

- Helvetica Neue as a local font, so nothing is downloaded.
- 10 layouts: `intro`, `intro-image`, `intro-image-right`, `image-right`, `bullets`, `section`, `statement`, `fact`, `quote` and `3-images`.
- No pictures of its own: picture props take an address or a colour.

## Use one

```md
---
theme: bricks
---
```

See [Themes and addons](./themes.md) for installing and for how a theme is found.

## Credits and licence

The code of the original themes is MIT licensed, copyright (c) 2021 Slidev.js Team. The layout names, slots, CSS values and font settings follow the originals, and the Angular components are new code. The images and other assets of the original themes are licensed CC BY-NC-SA 4.0, which does not allow commercial use, so none of them is copied. Where an original draws a picture, the port draws its own CSS gradients, and code colours come from Shiki instead of Prism. Each package's README says what is ported and what differs.

There is no community theme gallery, and community Slidev themes cannot be used.
