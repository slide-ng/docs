---
title: Speaker notes
description: Notes in the last HTML comment of a slide.
---

# Speaker notes

The last HTML comment of a slide is its note. It is stored in the slide's metadata and shown in the presenter view and on the notes page.

```md
# Slide

<!-- This text is a note. It is stored in the metadata, not shown. -->
```

In a note, `[click]` marks where the next click starts, and `[click:3]` moves three clicks on, counted from the marker before it, as in Slidev. A double click on a marker in the presenter view jumps there.

- `/notes` shows only the notes and follows the presenter.
- `slide-ng export-notes` writes a PDF of the notes.
- `slide-ng build --without-notes` leaves the notes out of the built site.
- A note is markdown: lists, `**bold**`, `code` and links are drawn, with the typography preset's `prose` look, as in Slidev.
- A link to a web page in a note opens a new tab, so the presenter view stays. A link to a slide, such as `[demo](5)`, moves the presenter to that slide when you click it in the presenter view. In `/notes` and elsewhere it opens the address.
- `/overview` lists every note next to its slide, and while the dev server runs you can edit the notes there, in the presenter and on `/notes-edit`. See [Overview and notes pages](./overview-pages.md).

## Readings above words

`notesAutoRuby` in the headmatter shows a reading above each listed word in every note, with `<ruby>`, as in Slidev. It helps when you read a language such as Japanese aloud:

```md
---
notesAutoRuby:
  日本語: にほんご
  発表: はっぴょう
---
```

Words in code, inside a tag's attributes and in a `<ruby>` you wrote yourself are left alone. A longer listed word is matched before a shorter one.
