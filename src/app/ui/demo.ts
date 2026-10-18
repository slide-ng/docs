import {isPlatformBrowser} from '@angular/common';
import {Component, PLATFORM_ID, computed, effect, inject, input, signal} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {appBase, withBase} from '../../base';

/** Origins besides this site that `<ngmd-demo>` may embed. Exact origins, https only. */
export const DEMO_ORIGINS: readonly string[] = ['https://slide-ng.github.io'];

/**
 * The address a demo frame may load, or `null`. A path of this site (`/demos/...`) gets the site
 * base; an `https` address on one of `DEMO_ORIGINS` is kept as it is. Everything else is refused.
 */
export function resolveDemoSrc(src: string, base: string): string | null {
  const value = src.trim();
  if (/^\/(?!\/)[\w./~-]*$/.test(value) && !value.includes('..')) return withBase(base, value);
  if (!/^https:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    const allowed = DEMO_ORIGINS.includes(url.origin) && !url.username && !url.password;
    return allowed ? url.href : null;
  } catch {
    return null;
  }
}

type DemoState = 'checking' | 'ready' | 'unavailable';

/**
 * Embeds a built slide deck in an iframe, with a link that opens it full size in a new tab.
 *
 *   <ngmd-demo src="/demos/starter/" title="The starter deck"></ngmd-demo>
 *   <ngmd-demo src="https://slide-ng.github.io/showcases/ship-it/" title="Ship it"
 *     source="https://github.com/slide-ng/showcases/tree/main/decks/ship-it"></ngmd-demo>
 *
 * Only paths on this site and addresses on `DEMO_ORIGINS` are embedded; anything else renders an
 * empty frame. The frame of another origin is sandboxed and is asked for first: when that answers
 * with an error, a note and an "Open on GitHub" link (`source`) take the place of the frame.
 * `ratio` is the frame's aspect ratio (default `16 / 9`, the shape of a slide).
 */
@Component({
  selector: 'ngmd-demo',
  template: `
    <figure class="m-0">
      <div
        class="relative w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        [style.aspect-ratio]="ratio()"
      >
        @switch (state()) {
          @case ('ready') {
            <iframe
              [src]="safeUrl()"
              [title]="title()"
              class="absolute inset-0 w-full h-full border-0"
              allow="fullscreen; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads allow-presentation"
              loading="lazy"
              (error)="state.set('unavailable')"
            ></iframe>
          }
          @case ('checking') {
            <p
              class="absolute inset-0 m-0 flex items-center justify-center text-sm text-brand-muted"
            >
              Loading the deck...
            </p>
          }
          @default {
            <div
              role="status"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center text-sm text-brand-muted"
            >
              <span>The live deck is not available right now.</span>
              @if (source()) {
                <a [href]="source()" target="_blank" rel="noopener noreferrer" class="font-medium">
                  Open on GitHub
                </a>
              }
            </div>
          }
        }
      </div>
      <figcaption class="mt-2 flex items-center justify-between gap-4 text-sm text-brand-muted">
        <span>{{ title() }}</span>
        @if (state() !== 'unavailable') {
          <a [href]="path()" target="_blank" rel="noopener noreferrer" class="shrink-0">
            Open full size
          </a>
        }
      </figcaption>
    </figure>
  `,
})
export class NgmdDemo {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private probe = 0;

  readonly src = input.required<string>();
  readonly title = input<string>('Live demo');
  readonly ratio = input<string>('16 / 9');
  /** Where to read the deck when its live frame cannot load, for example its folder on GitHub. */
  readonly source = input<string>('');

  /** The address to load, or `about:blank` when it is not allowed. */
  protected readonly path = computed(() => resolveDemoSrc(this.src(), appBase()) ?? 'about:blank');

  protected readonly safeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.path()),
  );

  protected readonly state = signal<DemoState>('ready');

  constructor() {
    effect(() => {
      const path = this.path();
      const token = ++this.probe;
      if (!/^https:/.test(path)) {
        this.state.set('ready');
        return;
      }
      this.state.set('checking');
      if (!this.browser || typeof fetch !== 'function') return;
      // The host answers with an error page for a deck that is not published; the frame itself
      // would show that page, so ask first. A request that fails outright still tries the frame.
      fetch(path, {method: 'HEAD'}).then(
        (response) => {
          if (token === this.probe) this.state.set(response.ok ? 'ready' : 'unavailable');
        },
        () => {
          if (token === this.probe) this.state.set('ready');
        },
      );
    });
  }
}
