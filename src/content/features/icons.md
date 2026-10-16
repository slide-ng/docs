---
title: Icons
description: Use any Iconify icon as a tag or as a class.
---

# Icons

Any icon of an installed *Iconify set can be written as a tag, `<set-name />`, or as a class.

```md
<carbon-apps /> <mdi-account-circle class="text-red-500 text-3xl" /> <ph-star-fill />
<span class="i-carbon:apps"></span>
```

Carbon (`carbon`), Material Design Icons (`mdi`) and Phosphor (`ph`) are installed. To add a set, find it on iconify.design and install it, for example:

```sh
npm i -D @iconify-json/tabler
```

Then write `<tabler-bell />`. Nothing else is configured, and only the icons you use end up in the CSS. Colour and size come from the text, so `text-red-500` and `text-3xl` work.
