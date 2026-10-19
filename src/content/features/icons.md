---
title: Icons
description: Use any Iconify icon as a tag or as a class, or draw icons with ng-icons.
---

# Icons

Any icon of an installed Iconify set can be written as a tag, `<set-name />`, or as a class.

```md
<carbon-apps /> <mdi-account-circle class="text-red-500 text-3xl" /> <ph-star-fill />
<span class="i-carbon:apps"></span>
```

Carbon (`carbon`), Material Design Icons (`mdi`) and Phosphor (`ph`) are installed. To add a set, find it on iconify.design and install it, for example:

```sh
npm i -D @iconify-json/tabler
```

Install it in the deck's folder, next to `slides.md`. Then write `<tabler-bell />`. Nothing else is configured, and only the icons you use end up in the CSS. Colour and size come from the text, so `text-red-500` and `text-3xl` work.

The tag form is rewritten in slide markdown only, and an icon is a `<span>`, not an `<svg>`. In a component or layer template, write `<span class="i-carbon:apps"></span>`.

## ng-icons

[ng-icons](https://github.com/ng-icons/ng-icons) draws an icon as an inline SVG from an Angular component, so you can set its size, colour and stroke width. It needs no change to slide.ng: install it in the deck, list the icons you want, and wrap its component once.

```sh
npm i @ng-icons/core @ng-icons/lucide
```

List the icons the deck uses in `setup/main.ts`:

```ts
// setup/main.ts
import { provideIcons } from '@ng-icons/core';
import { lucideRocket, lucideHeart } from '@ng-icons/lucide';

export default () => [provideIcons({ lucideRocket, lucideHeart })];
```

Slides only find components that are written in `components/`, so wrap `NgIcon` there. Re-exporting it is not enough.

```ts
// components/deck-icon.ts
import { Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'deck-icon',
  imports: [NgIcon],
  template: `<ng-icon [name]="name()" [size]="size()" [color]="color()" [strokeWidth]="strokeWidth()" />`,
})
export class DeckIcon {
  name = input.required<string>();
  size = input('1.5rem');
  color = input('currentColor');
  strokeWidth = input('2');
}
```

Then use it in a slide:

```md
<deck-icon name="lucideRocket" size="64" color="#e5541a" /> <deck-icon name="lucideHeart" strokeWidth="1" />
```

Every icon you write must be listed in `provideIcons`. The SVGs are part of the build, so offline mode and PDF export work. The [starter](/resources/starter) has a working example on its Icons slide.
