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
- The notes are plain text. Ruby annotations for Japanese (`notesAutoRuby`) are not supported.
