---
title: Code
description: Highlighted code blocks, line steps, imports from files, groups, Magic Move, Twoslash and editors.
---

# Code

Code fences are coloured while the deck is generated, with *Shiki, so the browser gets finished HTML. The language is the first word after the backticks. Everything after it is optional and follows Slidev's order:

````md
```ts [title.ts] {2,3|5|all} {lines:true, startLine:5, maxHeight:'100px'}
const a = 1
```
````

| Part | Meaning |
| --- | --- |
| `[title.ts]` | A title bar above the block. |
| `{2,3}` | Lines 2 and 3 are highlighted and the others are dimmed. `{*}` highlights nothing and keeps every line normal. |
| `{1\|3-4\|all}` | One range per click. Each `\|` adds one click to the slide. |
| `lines:true` | Line numbers. Set `lineNumbers: true` in the headmatter for every block. |
| `startLine:5` | The first line number. |
| `maxHeight:'100px'` | Scroll inside the block. |

The ranges and the options are two separate braces, as in Slidev. Options only take simple values: numbers, `true` or `false`, and text. Hover a block to get the copy button.

## Pages for each feature

- [Line highlighting](../features/line-highlighting.md), including steps that follow clicks
- [Line numbers](../features/line-numbers.md) and [Maximum height](../features/max-height.md)
- [Code groups](../features/code-groups.md), tabs for several blocks
- [Import snippets](../features/import-snippets.md) with `<<<`
- [Magic Move](../features/magic-move.md), animated steps between versions of a block
- [Twoslash](../features/twoslash.md), type popups on hover
- [Monaco editor](../features/monaco-editor.md), [running code](../features/monaco-run.md) and [writing back to files](../features/monaco-write.md)

## Colours and languages

Choose the Shiki themes in the headmatter, and add language names that map to another one:

```md
---
shiki:
  themes:
    light: vitesse-light
    dark: vitesse-dark
codeAliases:
  mylang: ts
---
```

A language Shiki does not know is shown plain, with a warning. For more control, a `setup/shiki.ts` file returns Shiki's options. See [Setup hooks](../customize/setup-hooks.md).
