---
title: Interface language
description: Show the bar, the menus and the presenter in the deck's language, translate them with a JSON file, and switch one deck between languages.
---

# Interface language

slide.ng's own interface is in English: the bar and its tooltips, the settings, sync and language menus, the overview, the go-to box, the right-click menu, the presenter and its click preview, the `/overview` and notes pages, the info dialog, the drawing toolbar and the password prompt of `dev --remote`. The headmatter's `lang` picks another language. Turkish is built in.

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
| `languages` | One file per language, such as `{ en: slides.md, tr: slides.tr.md }`, and a language menu in the bar. See [One deck in several languages](#one-deck-in-several-languages). |

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

Only that locale's data goes into the build, or each language's with `languages`. `pt-BR` uses Angular's `pt-BR` data, or else `pt`. A language Angular has no data for is written the English way, and the generator says so. `uiLang` does not change the locale. The date on the notes PDF follows `lang` too.

The "go to" box (`g`) compares titles by the rules of the deck's language and without accents, so in a Turkish deck `izmir` finds "İzmir" and `cafe` finds "Café". A slide number may be typed with Arabic-Indic or Persian digits (`٣`, `۵`).

## Right to left

`ar`, `he`, `fa` and `ur` set `dir="rtl"` on the page, unless `htmlAttrs.dir` says otherwise. The bar, the menus, the go-to box and the presenter are mirrored, and so are a blockquote's line and the progress bar's minutes. Mermaid drawings stay left to right, as Mermaid lays them out; their Arabic or Hebrew labels still read right to left.

- The keys stay physical, as in Slidev: right and space go to the next click, left to the one before. A selected `slide-ng-drag` element moves the way the arrow points.
- In the quick overview the arrow keys follow the mirrored grid: left goes to the next card, which is on the left. In the sync menu ArrowLeft goes to the next mode.
- Transitions are not mirrored: `slide-left` still slides to the left.
- An interface language written the other way than the page, such as `uiLang: en` in an Arabic deck, keeps the direction of its text, so "2 slides" keeps its order.
- The note editors and the side editor take the direction of each line from its first letter, so a line that mixes Arabic and Latin is not reordered.

## One deck in several languages

Write the slides of each language in a file of its own, and list the files in the headmatter of the entry file:

```md
---
title: My talk
languages:
  en: slides.md
  tr: slides.tr.md
---

# Hello
```

`slides.tr.md` has the Turkish slides, in the same order:

```md
---
title: Konuşmam
---

# Merhaba
```

The bar then has a language button, with a translate icon. Its menu lists the languages, each named in its own language, with the current one ticked. Choosing one keeps the address and the slide. It switches the slides, `<html lang>` and `dir`, the page title, the locale of the pipes and the interface text.

- The page loads again for the switch, because Angular fixes the locale when the app starts.
- The choice is kept in the browser, per deck, like the other settings. The presenter and audience windows of one browser switch together. Another device keeps its own choice.
- A page starts in the entry file's language until the reader chooses another.
- It works in `dev`, in a build and in an offline folder.

Each file is read as a deck. Its headmatter goes over the entry file's, so you can translate `title`, `info` and `titleTemplate`, and write the theme, `fonts` and the rest once. The key in `languages` is its `lang`, and its `uiLang` is its own. The theme, addons, `allowOutsideRoot` and the page's `<head>` come from the entry file.

Slides are paired by number, because the number is the address:

- A slide takes the frontmatter of the entry file's slide with the same number, under its own. So `layout`, `routeAlias`, `clicks` and `class` are written once, in the entry file. Its `title` is not taken.
- The generator warns, with files and lines, when the files have a different number of slides.
- A slide the translation does not have is shown from the entry file. A slide past the entry file's last is left out.
- `hide: true` drops a slide from its own file only, so hide it in every file.
- Drawings belong to a slide number, so the languages share them.

In `dev`, the side editor, the notes editor and `slide-ng-drag` write to the file of the language on screen. Every file listed is watched.

`--lang tr` on `dev` and `build` starts the page in Turkish, and `slide-ng export --lang tr` exports the Turkish slides. A language that is not in `languages` is warned about and ignored. See the [CLI reference](../built-in/cli.md).

A deck without `languages` has no language button and nothing of the switch in its build.

### One build per language

Without `languages`, you can still write one entry file per language, and import the slides that are the same in every language with `src:`:

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

`--lang tr` on `dev`, `build` and `export` then sets `lang` for one run without changing the file, and replaces `uiLang` too, so the interface follows it. `SLIDE_NG_LANG` does the same.

`--lang` is for slides written in that language. It also sets `<html lang>` and the language of the PDF, so `--lang en` on a Turkish deck tells screen readers that the Turkish text is English. To change only the interface, set `uiLang` in the headmatter instead.

The language of a build is fixed when it is built, so `export --dist` and `export --url` refuse `--lang`. Build each language with `slide-ng build --lang <tag>`, then export that folder.

## Limits

- Turkish is the only built-in translation.
- Error messages that come from the browser (camera, recording, screen sharing) and the generator's warnings stay English.
- In a right-to-left deck the keys and the transitions are not mirrored, on purpose, as in Slidev.
- With `languages`, a switch loads the page again, so a running presenter timer, an open dialog and unsaved text in the side editor are lost. Other devices keep their own language.
- The built-in context menu labels follow the language, so a `setup/context-menu.ts` should pick an entry by its `icon`, not its label.
