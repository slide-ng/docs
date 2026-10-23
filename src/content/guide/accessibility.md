---
title: Accessibility
description: What slide.ng does for screen readers, keyboards, contrast and motion, and what a deck has to do itself.
---

# Accessibility

This page lists what the slides, the presenter and the other pages do for people who use a screen reader, a keyboard, high contrast or less motion. The second half is what a deck author has to do, because slide.ng cannot do it for you.

## Screen readers

- Each new slide is announced with its number and title, in a polite live region. A title is read as plain text: its markdown marks go, and `$math$` is its TeX, with TeX's one-character escapes undone, so `$400\%$` is "400%".
- Elements that wait for a click are hidden from screen readers until they show. They are inert too: their links and buttons take no focus, also with the `fade` preset, where they are visible but dimmed.
- The slide, with the bar, is the main landmark of the audience page. The presenter, `/overview` and `/notes` each have a main landmark and a level-one heading, and `/entry`, `/notes-edit` and the notes print page have a main landmark.
- The presenter page has three named regions: Current slide, Next step and Notes. The next-step picture is skipped, so headings are not read twice. Line numbers of code and of Magic Move are skipped too.
- The quick overview, the right-click menu and the "go to" box are named dialogs, with all their controls inside. Each overview card is named "Go to slide N: title".
- The progress bar is a `progressbar` named "Progress through the slides".
- Math is read as its TeX source, in the slide and in a title drawn by `<slide-ng-title-renderer>` or the table of contents.
- An exported PDF is tagged for screen readers and has the deck's language. `--per-slide` loses the tags.

## Keyboard

- In the quick overview (`o`) the arrow keys move the focus from card to card.
- The right-click menu opens with Shift+F10 or the menu key, see [Shortcuts](../built-in/shortcuts.md#mouse).
- Escape in the settings menu, the sync menu and the drawing toolbar closes it and gives the focus back to its button. After Edit Notes, Escape gives the focus back to the Edit Notes button.
- The borders of the presenter's notes pane are Tab stops that the arrow keys move.
- In the presenter's [click preview](./presenter-mode.md#click-preview) the badges are buttons named "Go to click N".
- On `/overview`, while the dev server runs, each note says it can be edited, and a live region says how a save ended.

## Contrast, size and zoom

- The interface's text is at least 4.5:1, or 3:1 for large text, in light and dark mode. That includes the notes of later clicks, which are faded once, and the "No notes." placeholder.
- Icon buttons are at least 24 by 24 pixels, also the click preview's badges and the timer's buttons.
- The settings and sync menus and the info dialog stay inside the window down to 320 by 180 pixels, which is 400% zoom, and scroll.
- In forced colors mode, such as Windows high contrast, the icons are drawn in the text colour and the progress bars in the system's highlight colour.

A theme that changes the colours, or `.slidev-note-fade`, has to keep these contrasts.

## Less motion

When the system asks for less motion (`prefers-reduced-motion: reduce`), slide transitions, click animations, `slide-ng-motion` and Magic Move change at once. A transition with a fixed `duration` ends at once too. JavaScript timers in your own components are not changed: check `matchMedia('(prefers-reduced-motion: reduce)')` there.

## What the deck has to do

- Give every picture a text alternative: `![A red bridge at night](/bridge.jpg)` or `<img alt="...">`. A picture given as `image:` or `background:` in the frontmatter is a CSS background and cannot have one. When it carries meaning, put an `<img alt>` in the slide or say it in the text.
- Give each slide a title, with a heading or `title:`. It is what screen readers announce and what the "go to" box finds.
- Set `lang` in the headmatter to the language of the slides. It is `<html lang>`, the PDF's language and the [interface language](../features/interface-language.md).
- In a Mermaid diagram, `accTitle: ...` and `accDescr: ...` lines become the title and description of the SVG.
- Say a formula in words, in the text or the notes, when the audience needs it. Math is read as TeX, not as "a over b".
- Use `slide-ng-click` rather than `@if ($clicks() > 1)` for content that appears: it stays on the page, hidden and inert, and the click preview shows it.
- Check the colours of your own components in both modes.
