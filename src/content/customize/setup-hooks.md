---
title: Setup hooks
description: Change how slide.ng draws code, math and diagrams, which keys and menu entries exist, and how markdown is read.
---

# Setup hooks

A `setup/` folder changes how slide.ng draws code, math and diagrams, which keys and menu entries there are, and how the markdown is read. It works like Slidev's `setup/` folder: one file per job, each file default-exports a function.

The folder can be in the deck's own folder, in a theme and in an addon. Every root may have the same file. The roots run weakest first (built-in theme, `theme:`, the addons in order, the deck), so the deck has the last word. How the answers of several roots are put together is written under each hook.

There are two kinds of hooks:

- Node hooks run while the slides are generated: `shiki`, `katex`, `transformers` and `preparser`. They are bundled with esbuild first, so they can be written in TypeScript and import their own files and packages. An error names the root and the file.
- Browser hooks become part of the app: `main`, `root`, `shortcuts`, `context-menu`, `mermaid`, `monaco` and `code-runners`. They must be `.ts` files. Angular compiles them with the rest of the app, so `import type { ... } from 'slide-ng/...'` and `@angular/core` work.

| File | Runs | The function receives | Returns |
| --- | --- | --- | --- |
| `setup/shiki.ts` | generating | `{}` | Shiki options |
| `setup/katex.ts` | generating | nothing | KaTeX options |
| `setup/transformers.ts` | generating | nothing | `{ pre, codeblocks }` |
| `setup/preparser.ts` | generating | `{ filepath, headmatter, mode }` | a list of extensions |
| `setup/mermaid.ts` | browser | nothing | Mermaid config |
| `setup/monaco.ts` | browser | `monaco` | editor options, or nothing |
| `setup/code-runners.ts` | browser | nothing | `{ language: run }` |
| `setup/shortcuts.ts` | browser | `(actions, list)` | the list of shortcuts |
| `setup/context-menu.ts` | browser | `items` | the list of entries |
| `setup/main.ts` | browser, at start | nothing | Angular providers |
| `setup/root.ts` | browser, at start | nothing | nothing |
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

## Differences from Slidev

- Slidev's setup files use `define...Setup` helpers from `@slidev/types`. Here a plain function is enough, and types come from `slide-ng/...`.
- `setup/main.ts` returns Angular providers, where Slidev's gets the Vue app. `setup/root.ts` has no component to work on.
- Shortcuts are `{ name, key, run, when }`, where Slidev's are `{ key, fn, autoRepeat }`. Context menu entries are `{ icon, label, run, disabled }`.
- Not available: `setup/vite.config.ts`, `setup/vue.ts`, `setup/routes.ts`, a run context for `setup/code-runners.ts` (it gets the text only), Monaco's `monacoTypesSource`, and markdown-it plugins in `setup/transformers.ts`. The `codeblocks` function is the way to render a block yourself.
