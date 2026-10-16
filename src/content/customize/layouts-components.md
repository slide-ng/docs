---
title: Layouts and components
description: Write your own layout or component in a deck and use it from slides.
---

# Layouts and components

You do not need a theme to add a layout or a component. Put the file in the deck's own folder.

## A component

A component is a standalone Angular component with a plain string `selector`. Put it in a `components/` folder next to `slides.md`:

```ts
// components/hello.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'my-hello',
  template: '<p class="text-xl">Hello, {{ name() }}</p>',
})
export class MyHello {
  name = input('world');
}
```

Use it as a tag in any slide:

```md
<my-hello name="slide.ng" />
```

Every exported component with a selector in `components/` is available. The generator imports it into a slide only when the slide's markup contains `<my-hello`. Giving a component the same class name as a built-in one replaces the built-in.

Inputs, outputs, signals and your own services work as in any Angular app. Because a slide has no class of its own, share state between parts of a slide with a template reference, see [Angular in markdown](../guide/angular-templates.md).

## A layout

A layout is a standalone component that puts the slide's content in `<ng-content />`. Put it in `layouts/`:

```ts
// layouts/banner.ts
import { Component } from '@angular/core';

@Component({
  selector: 'my-banner',
  host: { class: 'slidev-layout default' },
  template: `
    <div class="bg-blue-600 text-white p-4 text-2xl">Talk title</div>
    <ng-content />
  `,
})
export class Banner {}
```

Use it by the file name:

```md
---
layout: banner
---

# A slide under a banner
```

- The layout name is the name of the file, so `layouts/banner.ts` is `layout: banner`.
- The selector must be a string literal and the class must be exported, because the generator reads the file as text.
- A layout with the same name as a built-in one replaces it.
- To take frontmatter keys as inputs, or to name slots, describe them in a `theme.json`, see [Writing a theme](./writing-a-theme.md).

## Layers

A `layers/` folder adds components that sit over or under every slide, see [Global layers](../features/global-layers.md).

## Importing from the app

Use the `slide-ng/` alias to reach the app's code. For example `import { Nav } from 'slide-ng/lib/nav'` gives a component the slide navigation. Details are in [Directory structure](./directory-structure.md).
