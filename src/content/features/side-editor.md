---
title: Side editor
description: Edit the current slide's markdown next to the deck while you develop.
---

# Side editor

While `slide-ng dev` runs, the edit button in the bar opens a side editor with the markdown of the current slide. It is a text area over Shiki-coloured markdown, saved into `slides.md` as you type. It takes over outside edits too, so editing the file in your own editor keeps both in step.

<ngmd-image src="/images/ui/side-editor.png" alt="The side editor next to a slide" caption="The side editor" width="640"></ngmd-image>

On the presenter page the side editor opens in the notes pane. `editor: false` in the headmatter hides the button. A static build leaves the side editor out and makes no requests. Each line takes its direction from its first letter, so a line that mixes Arabic and Latin keeps its order.
