---
title: Built-in layouts
description: Every built-in layout, its frontmatter props and a picture of it.
---

# Layouts

Set a layout in a slide's frontmatter with `layout: <name>`. The names and props match Slidev. The first slide is `cover` and all others are `default` unless you say otherwise.

| Layout | Use | Props |
| --- | --- | --- |
| `default` | Normal content. | |
| `cover` | Title slide. | `background`: a colour or an image, dimmed. |
| `intro` | Introduce the talk. | |
| `center` | Content in the middle of the screen. Add `class: text-center` to centre the text too. | |
| `section` | Start of a new section. | |
| `statement` | A statement as the main content. | |
| `fact` | One big fact or number. | |
| `quote` | A quotation. | |
| `end` | Last slide. Shows `END` when empty. | |
| `full` | Content uses the whole screen, no padding. | |
| `none` | No styling at all. | |
| `image` | An image as the whole slide. | `image`, `backgroundSize` |
| `image-left`, `image-right` | Image on one side, content on the other. | `image`, `backgroundSize`, `class` (goes to the content) |
| `iframe` | A web page as the whole slide. | `url`, `scale` |
| `iframe-left`, `iframe-right` | A web page on one side. | `url`, `scale`, `class` (goes to the content) |
| `two-cols` | Two columns. Slots `::left::` (also the default text) and `::right::`. | `class` (both columns), `layoutClass` (the whole layout) |
| `two-cols-header` | A header, two columns and a bottom row. Slots `::left::`, `::right::`, `::bottom::`. The text before the first marker is the header. | `class`, `layoutClass` |
| `404`, `error` | Shown when an address matches no slide, or a slide fails. | |

`image` is an address (`/photo.png` is served from the `public/` folder) or a colour for the background. `backgroundSize` defaults to `cover`.

An unknown layout name prints a warning that names the nearest layout (`image-rigth`: "Did you mean "image-right"?"), lists the names and uses `default`. Themes and decks can add layouts or replace these, see [Themes and addons](../customize/themes.md).

## Pictures

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
  <figure class="m-0"><img src="/images/layouts/default.webp" alt="The default layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>default</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/cover.webp" alt="The cover layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>cover</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/intro.webp" alt="The intro layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>intro</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/center.webp" alt="The center layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>center</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/section.webp" alt="The section layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>section</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/statement.webp" alt="The statement layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>statement</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/fact.webp" alt="The fact layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>fact</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/quote.webp" alt="The quote layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>quote</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/end.webp" alt="The end layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>end</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/full.webp" alt="The full layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>full</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/none.webp" alt="The none layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>none</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image.webp" alt="The image layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>image</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image-left.webp" alt="The image-left layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>image-left</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image-right.webp" alt="The image-right layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>image-right</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe.webp" alt="The iframe layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>iframe</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe-left.webp" alt="The iframe-left layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>iframe-left</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe-right.webp" alt="The iframe-right layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>iframe-right</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/two-cols.webp" alt="The two-cols layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>two-cols</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/two-cols-header.webp" alt="The two-cols-header layout" width="960" height="540" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-brand-muted mt-1"><code>two-cols-header</code></figcaption></figure>
</div>

The pictures are slides of the built-in theme, taken from slide.ng's own test decks.
