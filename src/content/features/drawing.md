---
title: Drawing
description: Draw on slides with a toolbar, shared between windows.
---

# Drawing

The pen button in the bar opens the toolbar. Tools: pen, line, arrow, ellipse, rectangle, eraser, with colours, width, undo, redo, clear and pin.

```md
---
drawings:
  enabled: true
  persist: true
  presenterOnly: false
  syncAll: true
---
```

| Key | Meaning |
| --- | --- |
| `enabled` | `true`, `false`, or `dev` or `build` to allow drawing only in that mode. |
| `persist` | While `slide-ng dev` runs, save `.slide-ng/drawings/<slide>.svg`. Builds and exported PDFs show those files. In `dev`, a device that joins later sees them only after the next regeneration. |
| `presenterOnly` | Only the presenter's window can draw. |
| `syncAll` | `false` keeps viewers' drawings on their own screen. |

The keys while the toolbar is open are listed in [Drawing and recording](../guide/drawing-recording.md). Drawing markup that arrives from another window is checked against a shape whitelist.
