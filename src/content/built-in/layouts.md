---
title: Layouts
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

An unknown layout name prints a warning that lists the names and uses `default`. Themes and decks can add layouts or replace these, see [Themes and addons](../customize/themes.md).

## Pictures

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
  <figure class="m-0"><img src="/images/layouts/default.png" alt="The default layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>default</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/cover.png" alt="The cover layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>cover</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/intro.png" alt="The intro layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>intro</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/center.png" alt="The center layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>center</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/section.png" alt="The section layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>section</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/statement.png" alt="The statement layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>statement</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/fact.png" alt="The fact layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>fact</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/quote.png" alt="The quote layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>quote</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/end.png" alt="The end layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>end</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/full.png" alt="The full layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>full</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/none.png" alt="The none layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>none</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image.png" alt="The image layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>image</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image-left.png" alt="The image-left layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>image-left</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/image-right.png" alt="The image-right layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>image-right</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe.png" alt="The iframe layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>iframe</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe-left.png" alt="The iframe-left layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>iframe-left</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/iframe-right.png" alt="The iframe-right layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>iframe-right</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/two-cols.png" alt="The two-cols layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>two-cols</code></figcaption></figure>
  <figure class="m-0"><img src="/images/layouts/two-cols-header.png" alt="The two-cols-header layout" class="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 m-0" loading="lazy" /><figcaption class="text-sm text-zinc-500 mt-1"><code>two-cols-header</code></figcaption></figure>
</div>

The pictures are slides of the built-in theme, taken from slide.ng's own test decks.
