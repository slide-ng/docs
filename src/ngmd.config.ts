/**
 * NgMd site configuration.
 *
 * Edit this file to customise navigation, site metadata, and external links.
 * Sidebar, command palette, breadcrumb, and header all read from here.
 */

import type {BadgeVariant} from './types/badge.ts';

export interface NavItem {
  label: string;
  href: string;
  /** Optional lifecycle marker rendered as a coloured chip beside the
   * sidebar label. Accepts any value from the shared `BadgeVariant` set
   * (`new`, `updated`, `alpha`, `beta`, `stable`, `deprecated`), so the
   * sidebar chip and inline `<ngmd-badge>` always stay in sync. */
  status?: BadgeVariant;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Lifecycle marker for a documentation version. Drives the chip rendered
 * beside the version label in the switcher and the banner shown above
 * content when this deployment isn't the current stable release.
 *
 *   - `current`: the production stable. Most visitors should land here.
 *   - `next`: the upcoming release, served from a `next.*` subdomain.
 *   - `rc`: release candidate, served from an `rc.*` subdomain.
 *   - `deprecated`: older stable that's been superseded.
 */
export type VersionStatus = 'current' | 'next' | 'rc' | 'deprecated';

export interface VersionEntry {
  /** Switcher label, e.g. `v17`, `v18`, `next`. */
  label: string;
  /** External deployment URL. NgMd follows the adev / PrimeNG model of
   *  per-version subdomains (`v17.example.com`, `next.example.com`). The
   *  live deployment renders one version of the docs; other entries link
   *  out via `<a href target="_blank">`. */
  url: string;
  /** Lifecycle marker. */
  status: VersionStatus;
}

export interface VersionsConfig {
  /** Label of the entry that represents THIS deployment. The switcher
   *  marks it as the active row (no external link), and the content
   *  banner reads its status to decide whether to nudge visitors toward
   *  the current stable. */
  self: string;
  /** Ordered list rendered in the version switcher dropdown. Newest at
   *  the top is the convention adev and PrimeNG both follow. */
  list: VersionEntry[];
}

export interface SiteConfig {
  /** Brand name shown in the header next to the logo. */
  name: string;
  /** One-liner description used in meta tags + social previews. */
  description: string;
  /** Short tagline shown after the brand in the homepage `<title>`. */
  tagline?: string;
  /** Public origin (no trailing slash). Used by sitemap.xml + robots.txt. */
  url: string;
  /** Sub-path the site is served from, for hosts like GitHub Pages project
   *  sites (`https://user.github.io/repo/` uses `'/repo/'`). Defaults to `/`.
   *  The `NGMD_BASE` environment variable overrides it, so CI can set it
   *  without editing the config. `url` stays the origin; the base is added to
   *  the sitemap, `robots.txt` and social URLs. */
  base?: string;
  /** Repository URL. Powers the GitHub icon in the header. */
  githubUrl: string;
  /** Default branch used to build GitHub blob/edit links (e.g. the
   *  "view source" link on API symbol pages). Defaults to `main` when
   *  omitted. Set this if the repo's default branch isn't `main`. */
  githubBranch?: string;
  /** Path from the repository root to this site, for sites inside a
   *  monorepo (e.g. `apps/docs`). Prefixes the file paths in GitHub edit and
   *  source links. Omit when the site is the repository root. */
  githubDir?: string;
  /** Optional community links. `discord` adds an icon to the header and a
   *  link to the footer; `sponsor` adds a "Sponsor" link to the footer. */
  links?: {
    twitter?: string;
    discord?: string;
    sponsor?: string;
  };
  /**
   * Optional Algolia DocSearch credentials. When all three are set, the
   * command palette queries Algolia instead of the bundled Orama index.
   * Requires `algoliasearch` as a runtime dep: `pnpm add algoliasearch`.
   * Leave undefined to keep the default local search.
   */
  algolia?: {
    appId: string;
    apiKey: string;
    indexName: string;
  };
}

export interface Sponsor {
  /** Display name, also used as the avatar's alt text. */
  name: string;
  /** GitHub login. Drives the avatar and the profile link. */
  login: string;
}

export interface NgmdConfig {
  site: SiteConfig;
  /** Links rendered in the header next to the brand, in order. Internal
   *  paths route in-app; `http(s)` URLs open in a new tab. Leave undefined
   *  for no header links. */
  headerNav?: NavItem[];
  /** The "Copy Markdown" page actions. This site has none, so it is `false`. */
  pageActions?: false;
  /** Sponsors listed by `<app-sponsor-list>`. Leave undefined to render
   *  nothing. */
  sponsors?: Sponsor[];
  /** Sidebar sections, in render order. */
  nav: NavSection[];
  /**
   * Inline-link keywords. In any `.md` body, `*Keyword` resolves to a link
   * pointing at the configured URL. Unknown keywords log a warning and fall
   * back to literal `*Keyword` text. Change the URL here once, every doc
   * follows. Names may contain dots (`'slide.ng'`, `'Next.js'`); a dot that
   * ends a sentence is not part of the keyword.
   */
  keywords?: Record<string, string>;
  /**
   * Documentation version registry. When set with more than one entry, the
   * version switcher renders in the header. Each entry is a separate
   * deployment (its own URL); the live site renders one version and the
   * switcher links out to the others — the adev / PrimeNG model, no in-repo
   * historical content. Leave undefined for single-version sites.
   */
  versions?: VersionsConfig;
}

const config: NgmdConfig = {
  site: {
    name: 'slide.ng',
    description:
      'Presentations written in markdown, with real Angular template syntax inside. Documentation for slide.ng.',
    tagline: 'Slides in markdown, built with Angular',
    // Placeholder origin. For a project site (github.io/<repo>/) set `base` below, or build with
    // NGMD_BASE=/<repo>/.
    url: 'https://slide-ng.github.io',
    // Sub-path the site is served from. '/' is a host root.
    base: '/',
    githubUrl: 'https://github.com/slide-ng/slide.ng-docs',
  },

  // No page actions on this site.
  pageActions: false,

  headerNav: [
    {label: 'Docs', href: '/welcome'},
    {label: 'Guide', href: '/guide/syntax'},
    {label: 'Reference', href: '/built-in/headmatter'},
    {label: 'Themes', href: '/customize/theme-gallery'},
  ],

  keywords: {
    Slidev: 'https://sli.dev',
    Angular: 'https://angular.dev',
    Shiki: 'https://shiki.style',
    KaTeX: 'https://katex.org',
    Mermaid: 'https://mermaid.js.org',
    Monaco: 'https://microsoft.github.io/monaco-editor/',
    UnoCSS: 'https://unocss.dev',
    Iconify: 'https://iconify.design',
    NgMd: 'https://ngmd.netlify.app',
  },

  nav: [
    {
      label: 'Getting started',
      items: [
        {label: 'Introduction', href: '/welcome'},
        {label: 'What and why', href: '/getting-started/what-and-why'},
        {label: 'Install', href: '/getting-started/install'},
        {label: 'Your first deck', href: '/getting-started/first-deck'},
        {label: 'The command line', href: '/getting-started/cli'},
      ],
    },
    {
      label: 'Guide',
      items: [
        {label: 'Syntax', href: '/guide/syntax'},
        {label: 'Angular in markdown', href: '/guide/angular-templates'},
        {label: 'Layouts', href: '/guide/layouts'},
        {label: 'Clicks and transitions', href: '/guide/animations'},
        {label: 'Code', href: '/guide/code'},
        {label: 'Diagrams and math', href: '/guide/diagrams-math'},
        {label: 'Styling', href: '/guide/styling'},
        {label: 'Presenter mode', href: '/guide/presenter-mode'},
        {label: 'Drawing and recording', href: '/guide/drawing-recording'},
        {label: 'Export', href: '/guide/export'},
        {label: 'Hosting', href: '/guide/hosting'},
        {label: 'Presenting offline', href: '/guide/offline'},
      ],
    },
    {
      label: 'Features: slides',
      items: [
        {label: 'Importing slides', href: '/features/importing-slides'},
        {label: 'Block frontmatter', href: '/features/block-frontmatter'},
        {label: 'Default frontmatter', href: '/features/frontmatter-defaults'},
        {label: 'Slots', href: '/features/slots'},
        {label: 'Scoped styles', href: '/features/scoped-styles'},
        {label: 'Speaker notes', href: '/features/speaker-notes'},
        {label: 'Slide addresses', href: '/features/routing'},
        {label: 'Table of contents', href: '/features/table-of-contents'},
        {label: 'Icons', href: '/features/icons'},
        {label: 'Markdown extras', href: '/features/markdown-extras'},
        {label: 'Canvas size', href: '/features/canvas-size'},
        {label: 'Zoom', href: '/features/zoom'},
        {label: 'Transform', href: '/features/transform'},
        {label: 'Direction variants', href: '/features/direction-variants'},
        {label: 'Global layers', href: '/features/global-layers'},
        {label: 'Draggable elements', href: '/features/draggable'},
        {label: 'Marks', href: '/features/marks'},
        {label: 'Motion', href: '/features/motion'},
      ],
    },
    {
      label: 'Features: code and diagrams',
      items: [
        {label: 'Line highlighting', href: '/features/line-highlighting'},
        {label: 'Line numbers', href: '/features/line-numbers'},
        {label: 'Maximum height', href: '/features/max-height'},
        {label: 'Code groups', href: '/features/code-groups'},
        {label: 'Import snippets', href: '/features/import-snippets'},
        {label: 'Magic Move', href: '/features/magic-move'},
        {label: 'Twoslash', href: '/features/twoslash'},
        {label: 'Monaco editor', href: '/features/monaco-editor'},
        {label: 'Running code', href: '/features/monaco-run'},
        {label: 'Writing back to files', href: '/features/monaco-write'},
        {label: 'Math', href: '/features/math'},
        {label: 'Mermaid', href: '/features/mermaid'},
        {label: 'PlantUML', href: '/features/plantuml'},
      ],
    },
    {
      label: 'Features: presenting',
      items: [
        {label: 'Timer', href: '/features/timer'},
        {label: 'Remote access', href: '/features/remote-access'},
        {label: 'Side editor', href: '/features/side-editor'},
        {label: 'Drawing', href: '/features/drawing'},
        {label: 'Recording', href: '/features/recording'},
        {label: 'Context menu', href: '/features/context-menu'},
      ],
    },
    {
      label: 'Features: build and tools',
      items: [
        {label: 'PDF with the build', href: '/features/build-with-pdf'},
        {label: 'Bundle remote assets', href: '/features/remote-assets'},
        {label: 'Page head and SEO', href: '/features/seo-meta'},
        {label: 'Fonts', href: '/features/fonts'},
        {label: 'Offline and PWA', href: '/features/pwa'},
        {label: 'MCP server', href: '/features/mcp'},
        {label: 'Formatting', href: '/features/format'},
      ],
    },
    {
      label: 'Built-in',
      items: [
        {label: 'Layouts', href: '/built-in/layouts'},
        {label: 'Components', href: '/built-in/components'},
        {label: 'Directives', href: '/built-in/directives'},
        {label: 'Shortcuts', href: '/built-in/shortcuts'},
        {label: 'CLI reference', href: '/built-in/cli'},
        {label: 'Headmatter and frontmatter', href: '/built-in/headmatter'},
      ],
    },
    {
      label: 'Customize',
      items: [
        {label: 'Directory structure', href: '/customize/directory-structure'},
        {label: 'Themes and addons', href: '/customize/themes'},
        {label: 'Theme gallery', href: '/customize/theme-gallery'},
        {label: 'Writing a theme', href: '/customize/writing-a-theme'},
        {label: 'Layouts and components', href: '/customize/layouts-components'},
        {label: 'Setup hooks', href: '/customize/setup-hooks'},
      ],
    },
    {
      label: 'Migrating from Slidev',
      items: [
        {label: 'What differs', href: '/migrating/from-slidev'},
        {label: 'Not supported', href: '/migrating/not-supported'},
      ],
    },
    {
      label: 'Project',
      items: [
        {label: 'Contributing', href: '/project/contributing'},
        {label: 'Security', href: '/project/security'},
        {label: 'Credits', href: '/project/credits'},
      ],
    },
  ],
};

export default config;

/** Flattened list of all nav items, useful for command palette / search. */
export const navItems = config.nav.flatMap((section) =>
  section.items.map((item) => ({
    label: item.label,
    href: item.href,
    section: section.label,
  })),
);

/** Map of last URL segment to its human label, useful for breadcrumb. */
export const navLabels = Object.fromEntries(
  config.nav.flatMap((section) =>
    section.items.map((item) => [item.href.split('/').pop() ?? '', item.label]),
  ),
);
