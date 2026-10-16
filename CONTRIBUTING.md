# Contributing

Thank you for improving the slide.ng docs. This file is a writing guide first, and a short list of mechanics second.

## Voice

- Say what the code does, in plain words. Address the reader as "you", and write in the present tense.
- Short sentences. One idea each. If a sentence needs a second comma, split it.
- No marketing words: not "powerful", "seamless", "blazing", "simply", "just". If something is hard, say so.
- Say what is missing. A page that hides a limit costs the reader an afternoon. Missing features are listed in `src/content/migrating/not-supported.md`, and the page of the feature itself says so too.
- Say "slide.ng" in lower case, even at the start of a sentence, and write "Slidev" and "Angular" as their owners do.
- Use "Slidev" only when you mean the other tool. Explain a difference once, on the [differences page](src/content/migrating/from-slidev.md), and link to it.
- Spell out `slides.md`, `slide-ng` and every key in code font. A key, a flag or a file name is always `code`.

## Structure of a page

- The front matter has a `title` and a `description`. The description is one sentence and is used in search and social tags.
- Start with `# Title`, then one or two sentences that say what the page is for. Then the sample.
- Features pages (`src/content/features/`) are short: what it is, one working sample, the options as a list or table, the limits. If a page grows past a screen or two, split it or move the detail to the guide.
- Guide pages (`src/content/guide/`) are narrative and link to the feature pages. Reference pages (`src/content/built-in/`) are tables.
- Put the page in `nav` in `src/ngmd.config.ts`. The sidebar is only what is listed there.
- Link with relative `.md` paths, for example `[Layouts](../guide/layouts.md)`. They work on GitHub and on the site, and the build checks them, headings included.
- Use the authoring components sparingly: a `ngmd-callout` for a real warning, `ngmd-demo` for a live deck, `ngmd-image` for a picture. Do not put two callouts next to each other.

## Samples

Every claim and every sample is checked against the real implementation before it is written down.

- Run the sample. A slide.ng sample goes into a deck that is generated and built with the current slide.ng, and the result is looked at in a browser.
- Read the source for options, defaults and limits. The names of flags and keys are copied from the code, not from memory.
- A sample that cannot work as written, for example one that needs a package that is not installed, says so next to it.
- Fenced code is always plain text on this site, including Angular syntax (`{{ }}`, `@if`, custom tags). Prefer a fence over inline code for anything with braces or angle brackets.
- Use `sh` for shell, `md` for slides, `ts` for TypeScript, `yaml` for YAML. When a sample contains a fence of its own, wrap it in a fence with more backticks.

Words that look like templates and are not (`{{ngmd-version}}`) are replaced by the build. Do not write that token.

## Live decks

A deck in `demos/<name>/slides.md` is built into `public/demos/<name>/` by `pnpm run demos`, and the built files are committed. Give a deck `routerMode: hash`, so it works on any host. Embed it with:

```html
<ngmd-demo src="/demos/<name>/" title="What the reader sees"></ngmd-demo>
```

Keep decks small. Do not use Monaco in a demo: it makes the deck many megabytes.

## Mechanics

```sh
pnpm install
pnpm run dev
pnpm run format:check
pnpm test
pnpm run build
pnpm run check:dist
```

- Prettier formats the TypeScript, CSS and config files. It leaves `src/content` and `demos` alone, so line breaks in prose are yours.
- The build fails on a broken internal link or heading anchor. Fix the link, not the check.
- Commit messages: `<type>: short imperative summary`, with `docs` for content, `feat` for the site, `build` for tooling, `fix` and `chore`. Keep the first line under 70 characters.
- One logical change per commit and per pull request.

## Licence

By contributing you agree that your changes are released under the MIT licence of this repository.
