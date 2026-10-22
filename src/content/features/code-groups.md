---
title: Code groups
description: Show several code blocks as tabs.
---

# Code groups

Wrap blocks in `::code-group` and `::`. The tab name is the title in brackets.

`````md
::code-group

```sh [npm]
npm i @slide-ng/core
```

```sh [yarn]
yarn add @slide-ng/core
```

::
`````

## Icons in titles

An icon goes in front of a code block, code group tab or Magic Move title, as in Slidev. Write it in the title as `~i-set:name~`:

`````md
```sh [npm ~i-carbon:terminal~]
npm i @slide-ng/core
```
`````

Its `@iconify-json` set must be installed, and a name the installed set does not have gets a warning that names the slide. With `@iconify-json/vscode-icons` installed, Slidev's built-in icons are matched from the title: `npm`, `pnpm`, `vue`, `package.json`, `.ts`, `.svg` and more, the longest name first.

- A built-in name has to be a whole word of the title, a file's extension (`main.ts`) or the start of a file name (`eslint.config.js`). Slidev looks anywhere in the title, so there `results.tsv` gets a TypeScript icon; here it does not.
- Every `~...~` in a title is taken out of the text shown, and the first one is the icon.
- A `<<<` snippet takes the title after the language, with spaces and an icon: `<<< ./a.py python [a.py ~i-carbon:code~]`. See [Import snippets](./import-snippets.md).
