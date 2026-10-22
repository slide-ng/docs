---
title: Drawing and recording
description: Draw on slides, show a camera bubble, and record your screen or camera in the browser.
---

# Drawing and recording

## Drawing

The pen button in the bar, or the right-click menu, opens a toolbar: pen, line, arrow, ellipse, rectangle, eraser, colours, width, undo, redo, clear and pin.

<ngmd-image src="/images/ui/drawing-toolbar.png" alt="The drawing toolbar over a slide" caption="The drawing toolbar" width="640"></ngmd-image>

Keys while the toolbar is open: `L` line, `A` arrow, `S` stylus, `R` rectangle, `E` ellipse, `C` clear, digits for colours, `Ctrl+Z` undo, `Escape` closes. The eraser is a button in the toolbar and has no key. Drawings belong to a slide, are shared between windows and are kept in the browser.

```md
---
drawings:
  enabled: true
  persist: true
  presenterOnly: false
  syncAll: true
---
```

`enabled` can be `false`, or `dev` or `build` to allow drawing only while developing or only in the built deck. With `persist: true`, drawings made while `slide-ng dev` runs are saved as `.slide-ng/drawings/<slide>.svg`, and builds show those files. `syncAll: false` keeps viewers' drawings on their own screen. See [Drawing](../features/drawing.md).

## Camera and recording

`record: true` adds a camera button and a record button to the bar, plus camera, microphone and screen options to the settings. The default is `dev`, so only while developing. `false` and `build` also work.

The camera is a round, draggable picture over the slides. Recording uses the browser's recorder, and a `.webm` file is downloaded when you stop. Pause and resume work. Screen recording asks which tab or screen to share.

The presenter page has a Screen Mirror switch that shows a shared window instead of the slide.

<ngmd-callout type="info" title="Limits">

There is no separate camera file, no mp4 or mkv, and no cloud upload. See [Recording](../features/recording.md).

</ngmd-callout>
