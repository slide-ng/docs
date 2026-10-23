---
title: Setup hooks
description: Change how slide.ng draws code, math and diagrams, which keys and menu entries exist, and how markdown is read.
---

# Setup hooks

A `setup/` folder changes how slide.ng draws code, math and diagrams, which keys and menu entries there are, and how the markdown is read. It works like Slidev's `setup/` folder: one file per job, each file default-exports a function.

The folder can be in the deck's own folder, in a theme and in an addon. Every root may have the same file. The roots run weakest first (built-in theme, `theme:`, the addons in order, the deck), so the deck has the last word. How the answers of several roots are put together is written under each hook.

There are two kinds of hooks:

- Node hooks run while the slides are generated: `shiki`, `katex`, `transformers` and `preparser`. They are bundled with esbuild first, so they can be written in TypeScript and import their own files and packages. An error names the root and the file.
- Browser hooks become part of the app: `main`, `root`, `routes`, `shortcuts`, `context-menu`, `mermaid`, `mermaid-renderer`, `monaco` and `code-runners`. They must be `.ts` files. Angular compiles them with the rest of the app, so `import type { ... } from 'slide-ng/...'` and `@angular/core` work.

| File | Runs | The function receives | Returns |
| --- | --- | --- | --- |
| `setup/shiki.ts` | generating | `{}` | Shiki options |
| `setup/katex.ts` | generating | nothing | KaTeX options |
| `setup/transformers.ts` | generating | nothing | `{ pre, codeblocks }` |
| `setup/preparser.ts` | generating | `{ filepath, headmatter, mode }` | a list of extensions |
| `setup/mermaid.ts` | browser | nothing | Mermaid config |
| `setup/mermaid-renderer.ts` | browser | nothing | a function that draws a diagram, or nothing |
| `setup/monaco.ts` | browser | `monaco` | editor options, or nothing |
| `setup/code-runners.ts` | browser | nothing | `{ language: run }` |
| `setup/shortcuts.ts` | browser | `(actions, list)` | the list of shortcuts |
| `setup/context-menu.ts` | browser | `items` | the list of entries |
| `setup/main.ts` | browser, at start | nothing | Angular providers |
| `setup/root.ts` | browser, at start | nothing | nothing |
| `setup/routes.ts` | browser, at start | the app's routes | the list of routes |
| `setup/providers.ts` | browser, at start | the older way | an array of providers is the default export |

## Shiki

`setup/shiki.ts` returns the options of Shiki's `codeToHtml`. As in Slidev, `langs` adds languages, `transformers` change the HTML of every block, and `theme` or `themes` choose the colours (`themes` wins). Options of later roots are put over earlier ones, and `langs` of all roots are collected.

Install the transformer package first (`npm i -D @shikijs/transformers`); the sample uses it.

```ts
// setup/shiki.ts
import { transformerNotationDiff } from '@shikijs/transformers';

export default () => ({
  langs: ['rust', 'elixir'],
  themes: { light: 'github-light', dark: 'github-dark' },
  transformers: [transformerNotationDiff()],
});
```

## KaTeX

`setup/katex.ts` returns KaTeX's options, such as `macros`, `strict` or `trust`. A later root replaces a key of an earlier one, and a `macros` object is replaced as a whole. `displayMode` and `output` are decided by slide.ng.

```ts
// setup/katex.ts
export default () => ({ macros: { '\\RR': '\\mathbb{R}' } });
```

## Transformers

`setup/transformers.ts` returns `{ pre, codeblocks }`.

- `pre` are functions that get `{ s, slide, options }` for each slide before it is read. `s` is a [MagicString](https://github.com/Rich-Harris/magic-string) of the slide's markdown, and `slide` has `no`, `index`, `title`, `frontmatter` and `source`. They may be async. `preCodeblock` and `postCodeblock` are accepted too and run after `pre`, because slide.ng has one pass.
- `codeblocks` are functions that get `{ code, info, lang, meta, slide, options }` for each code block. A string they return replaces the block. It is Angular template text, so it may use components, and a `{` or `}` in plain text is written `&#123;` and `&#125;`. `undefined` leaves the block to the next function, and finally to the normal highlighting.

```ts
// setup/transformers.ts
export default () => ({
  pre: [({ s }) => s.replace(/\[\[\[(.*?)\]\]\]/g, (_all, text) => `<b>${text}</b>`)],
  codeblocks: [({ info, code }) => (info.startsWith('count') ? `<p>${code.trim().length} characters</p>` : undefined)],
});
```

## Preparser

`setup/preparser.ts` runs when the markdown file is read, before it is cut into slides. It returns a list of extensions of Slidev's parser: `transformRawLines(lines)` changes the array in place, `transformSlide(content, frontmatter)` returns new text, and `transformNote(note, frontmatter)`. The extensions of all roots are used.

```ts
// setup/preparser.ts
export default () => [
  {
    name: 'shout',
    transformRawLines(lines: string[]) {
      lines.forEach((line, i) => {
        if (line.startsWith('!! ')) lines[i] = `# ${line.slice(3).toUpperCase()}`;
      });
    },
  },
];
```

## Mermaid

`setup/mermaid.ts` returns Mermaid's config. It applies to every diagram, and a diagram's own options come after it.

```ts
// setup/mermaid.ts
export default () => ({ theme: 'base', themeVariables: { primaryColor: '#ff0000' } });
```

## Mermaid renderer

`setup/mermaid-renderer.ts` returns a function that draws a diagram with another library, as in Slidev. The function gets the diagram's code and its options (the theme, the config of `setup/mermaid.ts` and the fence's own options, merged in that order) and returns the SVG as a string, or a promise of it. Mermaid itself is then not loaded. `scale` is still applied, and the export waits for the drawing.

```ts
// setup/mermaid-renderer.ts: Mermaid's hand-drawn look for every diagram
let counter = 0;

export default () => async (code: string, options: Record<string, unknown>) => {
  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({ startOnLoad: false, ...options, look: 'handDrawn' });
  return (await mermaid.render(`hand-drawn-${++counter}`, code)).svg;
};
```

- The setup function may be async, and it may return nothing to keep Mermaid.
- When several roots have the file, the last one that returns a function wins.
- A setup that throws is skipped with a warning in the console, and the next root or Mermaid draws instead.
- A renderer that throws, or that resolves to something other than a string, shows the red error box in place of the diagram.
- A renderer that uses another library imports it the same way. Install the library in the deck first.

## Monaco

`setup/monaco.ts` runs once Monaco is loaded, only for decks that have an editor. It gets the `monaco` module, so it can add themes or languages, and the object it returns is merged into the options of every editor. It may be async. TypeScript settings are `monaco.typescript.typescriptDefaults`: the old `monaco.languages.typescript` is undefined in this Monaco version. An editor's model is `file:///model-N.mts`, so an extra library for `import './context'` goes at `file:///context.ts`. A hook that throws is reported, and the editors still work.

```ts
// setup/monaco.ts
import type * as Monaco from 'monaco-editor';

export default (monaco: typeof Monaco) => {
  monaco.editor.defineTheme('mine-light', { base: 'vs', inherit: true, rules: [], colors: {} });
  monaco.editor.defineTheme('mine-dark', { base: 'vs-dark', inherit: true, rules: [], colors: {} });
  return {
    fontSize: 14,
    minimap: { enabled: true },
    theme: { light: 'mine-light', dark: 'mine-dark' },
  };
};
```

`theme` is one name for light and dark mode alike, or `{ light, dark }` to follow the deck's mode. The default is `vs` and `vs-dark`.

## Code runners

`setup/code-runners.ts` returns a map from the editor's language id to a function. `{monaco-run}` editors of that language run the function instead of the built-in JavaScript runner. The function gets the editor's text and returns `{ lines: string[][], error?: string }`, or a promise of it, where each inner list is one output line. A runner that throws shows the error instead of hanging. A deck's own runners win over a theme's or an addon's, and so does a `CODE_RUNNERS` provider of the deck.

```ts
// setup/code-runners.ts
export default () => ({
  python: async (code: string) => ({ lines: [[await runPython(code)]] }),
});
```

## Shortcuts

See [Shortcuts](../built-in/shortcuts.md). The roots are chained: each gets the list the one before returned. They run after a theme's `SHORTCUTS_SETUP` provider, so both add up. When two shortcuts have the same key, the one later in the list wins: appending one replaces a built-in key or an earlier root's.

## Context menu

`setup/context-menu.ts` gets the entries of the right-click menu and returns the list to show. An entry is `{ icon, label, run, disabled? }`, and `icon` is an icon class such as `i-carbon:star`. The roots are chained. The built-in labels are in the deck's [interface language](../features/interface-language.md), so pick an entry by its `icon`, not its label.

```ts
// setup/context-menu.ts
import type { ContextMenuItem } from 'slide-ng/setup';

export default (items: ContextMenuItem[]): ContextMenuItem[] => [
  ...items,
  { icon: 'i-carbon:link', label: 'Open the notes', run: () => window.open('/notes') },
];
```

## Main

`setup/main.ts` returns Angular providers that are added to the application, so a deck can provide any token the app injects, add an initializer, a router feature or a service. It is also the place to load the script of a web component, see [Layouts and components](./layouts-components.md#web-components). `setup/providers.ts` still works: it default-exports the array itself.

```ts
// setup/main.ts
import { provideEnvironmentInitializer } from '@angular/core';

export default () => [provideEnvironmentInitializer(() => console.log('the deck started'))];
```

## Root

`setup/root.ts` runs once when the app starts, in an injection context, so `inject()` works. Slidev runs it in the root component. It is the place for code that watches the whole app.

```ts
// setup/root.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export default () => {
  const router = inject(Router);
  router.events.subscribe(() => (document.documentElement.dataset['path'] = router.url));
};
```

## Routes

`setup/routes.ts` gets the app's Angular routes and returns the list to use, so a deck can add pages of its own, as with Slidev's `setup/routes.ts`. A page is an Angular component, in the file itself or imported from the root, such as `import { Gallery } from '../components/gallery'`. The roots are chained: each gets the list the one before returned.

```ts
// setup/routes.ts
import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({ selector: 'deck-about', template: '<h1>About this talk</h1>' })
class About {}

export default (routes: Routes): Routes => [...routes, { path: 'about', component: About }];
```

Now `/about` opens the page.

- Angular takes the first route that matches. So that a page you append is reached, the app's routes that match any address (the slide and the catch-all) are moved to the end afterwards. Routes the file adds stay where it put them.
- A page comes before the slides, so a slide whose `routeAlias` has the page's path is not reached at that address. The build cannot see these routes, so it cannot warn: give pages and aliases different names.
- The page is shown on its own, without the slide frame, the bar or the keys of the slides. With `dev --remote` it is not behind the password; add Angular's `canActivate` if it should be.
- The services of a deck page are not there: `inject(Nav)` fails, and `inject(Nav, { optional: true })` gives `null`. A page can inject Angular's `Router`, `Dark` from `slide-ng/lib/dark`, and the providers of `setup/main.ts`.
- A file that throws, or returns something other than a list, is skipped with a message in the console, and the slides still open.

## Differences from Slidev

- Slidev's setup files use `define...Setup` helpers from `@slidev/types`. Here a plain function is enough, and types come from `slide-ng/...`.
- `setup/main.ts` returns Angular providers, where Slidev's gets the Vue app. `setup/root.ts` has no component to work on.
- Shortcuts are `{ name, key, run, when }`, where Slidev's are `{ key, fn, autoRepeat }`. Context menu entries are `{ icon, label, run, disabled }`.
- `setup/routes.ts` gets Angular routes, where Slidev's gets Vue router records, and the slide routes stay last instead of being ranked by the router.
- Not available: `setup/vite.config.ts`, `setup/vue.ts`, a run context for `setup/code-runners.ts` (it gets the text only), Monaco's `monacoTypesSource`, and markdown-it plugins in `setup/transformers.ts`. The `codeblocks` function is the way to render a block yourself.
