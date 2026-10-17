---
title: PDF with the build
description: Make the PDF at build time and add a download button.
---

# PDF with the build

```sh
slide-ng build --download
```

`--download` makes the PDF with the same code as `slide-ng export` and writes it next to the site as `<exportFilename>.pdf`. It also shows a download button in the bar and the settings menu. Needs a Chromium, see [Export](../guide/export.md).

You can switch it on in the deck instead. `slide-ng build` then makes the PDF too:

```md
---
download: true
exportFilename: my-talk
---
```

- Without a working Chromium, `download: true` alone only warns: the site is built without the PDF. `--download` asks for the PDF, so it fails instead.
- The button is enabled only if the page can really fetch a PDF next to it, so it stays disabled in `slide-ng dev` and in a build that has no PDF.
- `download: https://example.com/talk.pdf` points the button at a file somewhere else, and no PDF is made.
- `exportFilename` is a plain file name without folders.
- In an offline folder the button opens the PDF in a new tab.
