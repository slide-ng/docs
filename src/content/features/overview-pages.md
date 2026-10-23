---
title: Overview and notes pages
description: The /overview, /entry and /notes-edit pages list the slides with their notes, and let you edit the notes while the dev server runs.
---

# Overview and notes pages

Besides the slides, the presenter and `/notes`, a deck has three pages of its own, as in Slidev.

| Address | What it shows |
| --- | --- |
| `/overview` | Every slide in a list, with a clicks slider under it and its notes beside it. On a narrow screen the notes go below each slide. |
| `/entry` | Links to the slides, the presenter, the notes, the overview and, while the dev server runs, the notes editor. Open it on a second device to pick a page. |
| `/notes-edit` | Every note of the deck in one text, while the dev server runs. |

The button at the top of the quick overview (`o`) opens `/overview`. With `dev --remote`, `/overview` and `/notes-edit` need the password, like the presenter.

## Edit the notes

While the dev server runs, a double click on a note in `/overview`, or Enter on it, turns it into a text box. Leaving the text saves it into the markdown file, and Escape cancels. A live region says how the save ended, "Saved." or "Not saved.".

`/notes-edit` has every note after a `--- #N` line, where `N` is the slide number:

```md
--- #1
Say hello.

--- #2
[click] Then show the first point.
```

The notes that changed are saved after a short pause. Keep the `--- #N` lines as they are: a text whose lines were changed is not saved. Saving rebuilds the deck and reloads the page, and the page keeps the caret and what you typed meanwhile.

- A `-->` in a note would end the HTML comment early, so it is written `-- >`, as in the presenter's note editor.
- Each line takes its direction from its first letter, so a line that mixes Arabic and Latin keeps its order.
- The notes of a slide imported from outside the deck's folder cannot be edited here.

The presenter page has its own note editor, see [Presenter mode](../guide/presenter-mode.md#notes).

## Limits

- `/notes-edit` and the note editing of `/overview` work only while the dev server runs. A static build leaves `/notes-edit` out, and `/overview` shows the notes read-only.
- The names `overview`, `entry` and `notes-edit` cannot be a `routeAlias`, see [Slide addresses](./routing.md).
