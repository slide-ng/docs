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

Only the `.ts` files directly in `components/` are read, not its sub-folders.

## Pipes and directives

A pipe in `components/` (`@Pipe({ name: 'initials' }) export class InitialsPipe`) is imported into every slide whose expressions use it: `{{ name | initials }}`. A directive is imported when a slide uses its selector: a tag, an attribute (also as `*structural`), a tag with an attribute such as `button[appRipple]`, or a list of these.

## Packages

Components can import `@angular/common`, `@angular/forms` and `@angular/router`, which come with slide.ng. Do not install another copy of an `@angular/*` package in the deck: two copies of Angular give a blank page. `@angular/animations` is not included. Use Angular's `animate.enter` and `animate.leave`, or CSS.

Any other package a component imports, such as `chart.js`, is installed next to `slides.md` (`npm i chart.js`). It is found the way Node finds packages, from the deck's folder up. A package that slide.ng comes with (Angular, `rxjs`, `shiki`) is always slide.ng's copy.

## Web components

A web component such as `<model-viewer>` or Shoelace's `<sl-button>` is not an Angular component, so Angular stops with "is not a known element". Load its script in `setup/main.ts` (`import '@google/model-viewer';`) and list its tags in the headmatter:

```yaml
customElements: [model-viewer, sl-*] # a name ending in * is a prefix; true allows any tag with a dash
```

Only the slides that use a listed tag get Angular's `CUSTOM_ELEMENTS_SCHEMA`. Elsewhere a mistyped component name is still an error. Attributes are set as written; bind a property with `[prop]="value"`.

## Where a component is drawn

A slide is drawn in every window that shows it: the presenter page and each audience page. A component that only shows things needs nothing more. One that acts, such as a timer that calls `nav.next()`, a sound or a request, does so in every window, so the deck would move twice. Act in one window only, for example when `inject(RENDER_CONTEXT)` from `slide-ng/lib/slide-context` is `'slide'`, the audience page. It is `'presenter'` on the presenter page, and `'previewNext'`, `'print'` or `'overview'` in previews.

In the PDF and in the overview every slide is drawn at once, so `Nav.no()` is the slide being presented, not the slide being drawn. Inject `SLIDE_NO` to know which slide a component is in.

## Slide hooks

Slidev's slide hooks are in `slide-ng/lib/slide-hooks`. Call them in an injection context, which is a field or the constructor of a component:

- `onSlideEnter((to, from) => ...)` runs once the component is drawn while its slide is on screen, and each time the deck comes back to the slide.
- `onSlideLeave((to, from) => ...)` runs when another slide is shown after this one.
- `isSlideActive()` is a signal, true while the slide is on screen. It is Slidev's `useIsSlideActive`.

```ts
// components/enter-count.ts
import { Component, signal } from '@angular/core';
import { isSlideActive, onSlideEnter } from 'slide-ng/lib/slide-hooks';

@Component({
  selector: 'enter-count',
  template: '{{ active() ? "here" : "away" }}, entered {{ n() }} times',
})
export class EnterCount {
  active = isSlideActive();
  n = signal(0);
  constructor() {
    onSlideEnter(() => this.n.update((v) => v + 1));
  }
}
```

- `to` and `from` are slide numbers, from 1. `from` is `undefined` when no other slide was shown before.
- The hooks run on the slide and presenter pages and in print (`export` and the PDF), not in thumbnails or the presenter's next-step pane.
- In print every page is its slide on screen, as in Slidev: `onSlideEnter` runs once per page, `onSlideLeave` never runs, and `isSlideActive()` is true. Something a hook animates is captured as it is when the page is taken, so give `export` a `--wait`.
- The deck removes a slide it leaves, so a component that should remember something across visits keeps it outside the component.
- A hook that throws is reported in the browser console. The other hooks of the slide still run.

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
- To take frontmatter keys as inputs, or to name slots, describe them in a `theme.json` next to `slides.md`, see [Writing a theme](./writing-a-theme.md). The values arrive as attribute text, except lists and objects.
- A layout is not a slide: it imports the components it uses itself (`imports: [Footer]`).
- A deck's own `layouts/404.ts` replaces the page shown for an unknown slide.

## Layers

A `layers/` folder adds components that sit over or under every slide, see [Global layers](../features/global-layers.md).

## Importing from the app

Use the `slide-ng/` alias to reach the app's code. For example `import { Nav } from 'slide-ng/lib/nav'` gives a component the slide navigation. Details are in [Directory structure](./directory-structure.md).
