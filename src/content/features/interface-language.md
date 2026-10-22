---
title: Interface language
description: Show the bar, the menus and the presenter in the deck's language, and translate them with a JSON file.
---

# Interface language

slide.ng's own interface is in English: the bar and its tooltips, the settings menu, the overview, the go-to box, the right-click menu, the presenter, the info dialog and the drawing toolbar. The headmatter's `lang` picks another language. Turkish is built in.

```md
---
lang: tr # <html lang="tr">, the interface in Turkish, dates and numbers written the Turkish way
uiLang: en # optional: the interface in another language than the slides
---
```

| Key | What it does |
| --- | --- |
| `lang` | The language of the deck: `<html lang>`, the interface language and the locale of the `date`, `number`, `currency` and `percent` pipes. |
| `uiLang` | The interface language only. It wins over `lang`. |

A tag is written the usual way: `pt_br` is read as `pt-BR`. Without either key the interface is English.

## Translate it

For a language that is not built in, put `locales/<lang>.json` next to `slides.md`. It is flat JSON, with the keys you translate:

```json
{ "nav.next": "Nächste Folie", "presenter.noNotes": "Keine Notizen für Folie {no}." }
```

The keys and their English text are listed in [UI-STRINGS.md](https://github.com/slide-ng/slide.ng/blob/main/docs/UI-STRINGS.md) in the slide.ng repository. Keep the `{name}` placeholders, in any order the sentence needs.

- A key that no file translates stays English, and so does a language without a file.
- A theme or an addon can have a `locales/` folder too. The built-in translations come first, then the theme, the addons and the deck, key by key, so a deck can change one text of its theme. See [Themes and addons](../customize/themes.md#translating-the-interface).
- In each folder the shorter tag is read first: `de.json`, then `de-AT.json`.
- The generator warns about a key that does not exist, a value that is not text and a placeholder that was lost or added. That key stays English. A file that is not JSON stops the build.

## Dates and numbers

`lang` also sets Angular's `LOCALE_ID`, so the pipes in a slide write for that language:

```md
{{ price | currency: 'EUR' }} · {{ day | date }} · {{ n | number }}
```

Only that locale's data goes into the build. `pt-BR` uses Angular's `pt-BR` data, or else `pt`. A language Angular has no data for is written the English way, and the generator says so. `uiLang` does not change the locale. The date on the notes PDF follows `lang` too.

## Right to left

`ar`, `he`, `fa` and `ur` set `dir="rtl"` on the page, unless `htmlAttrs.dir` says otherwise. The bar, the menus, the go-to box and the presenter are mirrored.

## One deck in several languages

Write one entry file per language, and import the slides that are the same in every language with `src:`:

```
slides.md        lang: en
slides.tr.md     lang: tr, its own translated slides, and src: ./pages/demo.md for a shared one
pages/demo.md
```

Build each into its own folder:

```sh
slide-ng build slides.md --out dist/en
slide-ng build slides.tr.md --out dist/tr
```

`--lang tr` on `dev`, `build` and `export` sets `lang` for one run without changing the file. `SLIDE_NG_LANG` does the same. See the [CLI reference](../built-in/cli.md).

## Limits

- Turkish is the only built-in translation.
- Error messages that come from the browser (camera, recording, screen sharing) and the generator's warnings stay English.
- In a right-to-left deck the arrow keys, swipes and the position of the drawing toolbar are not mirrored.
- The language cannot be switched while presenting. Build one deck per language instead.
- The built-in context menu labels follow the language, so a `setup/context-menu.ts` should pick an entry by its `icon`, not its label.
