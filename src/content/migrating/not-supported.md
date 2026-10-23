---
title: Not supported
description: What slide.ng does not do, or does only in part, compared with Slidev.
---

# Not supported

This list is taken from the parity table that is kept with the slide.ng source, where every row is compared with Slidev's own documentation and tied to a test. A feature is listed here when it is not there, or when it works only in part.

## Not there

- Slidev themes and addons: they are Vue packages.
- Comark or MDC syntax (`comark: true`, `mdc: true`). The generator warns, and the syntax stays text.
- `:emoji:` shortcodes. Type the emoji itself.
- `v-pre`. Use Angular's `ngNonBindable`, or write `&#123;&#123;` for a literal `{{`.
- `selectable`.
- `dev --base`, `dev --tunnel` and `dev --inspect`.
- `export --format pptx-editable`.
- A Prettier plugin, a converter from Vue syntax, `overviewSnapshots` and the browser exporter page. These are left out on purpose.
- A released VS Code extension. A first version is in the slide-ng/vscode-extension repository; it is not released and was not run inside VS Code.
- Theme and addon galleries, and community themes.
- `setup/vite.config.ts` and `setup/vue.ts`, which are about Vite and Vue.
- Monaco type loading (`monacoTypesSource`), markdown-it plugins in transformers, and a run context for code runners.
- `mhchem` in KaTeX.

## Only in part

- `slide-ng-motion`: CSS transitions between states, no spring physics or presets.
- Recording: no separate camera file, no mp4 or mkv, no cloud upload.
- Links to slides: in a PDF made with `--per-slide`, or with a `--range` that leaves the slide out, a link to another slide is no link. A link to a slide in the notes moves the presenter page only; in `/notes` it opens the address.
- Markdown links: only a slide number or a `routeAlias` becomes a link inside the deck, and only `http` and `https` links open a new tab. See [What differs from Slidev](./from-slidev.md#syntax-differences).
- The interface language: Turkish is the only built-in translation, and browser error messages and the generator's warnings stay English. See [Interface language](../features/interface-language.md).
- `routerMode: memory`: only the print pages and a slide link's `#/<number>` are read from the address, so the presenter and the other pages of the app cannot be opened by address.
- `setup/routes.ts`: a page of your own is not behind the `--remote` password, and the build cannot warn when its path is also a `routeAlias`.
- `fonts`: loaded from the provider like Slidev's, plus `selfHost`, which is tested against a fake provider only.
- `colorSchema`: `auto`, `light` and `dark` work, `all` does not.
- Touch: swiping works, but pinch zoom and touch tuning for drawing and `slide-ng-drag` were not tried on a real device.
- `addons`: resolution and merge order are tested, but no deck was built with an addon end to end.
- Raw HTML: HTML and `<style>` work, `<script setup>` has no equivalent.

## Not checked

These were not tried, so treat them as unknown rather than working:

- Firefox and Safari, for the app, export and the offline folder. Only Chromium was used.
- Real devices over a real network for `--remote`, the real screen share picker, wake lock behaviour and real projectors.
- A deck installed from the npm registry with the newest changes: a new deck gets the version of `@slide-ng/core` that is published, which can be behind the repository.
- Real Google Fonts for `fonts.selfHost`, a PWA update on an installed deck, and hosting on GitHub Pages or Netlify beyond writing the files they read.
- Open Graph pictures in a real crawler.

## Where this list comes from

The source repository has `docs/PARITY.md`, with every row, and `docs/STATUS.md`, with the test results and the problems found along the way. When a row there changes, this page should change with it.
