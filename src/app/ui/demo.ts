import {Component, computed, inject, input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {appBase, withBase} from '../../base';

/**
 * Embeds a built slide deck (or any page of this site's own `public/` folder) in an iframe,
 * with a link that opens it full size in a new tab.
 *
 *   <ngmd-demo src="/demos/starter/" title="The starter deck"></ngmd-demo>
 *
 * Only paths on this site are embedded (`/demos/...`); anything else renders an empty frame.
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
        <iframe
          [src]="safeUrl()"
          [title]="title()"
          class="absolute inset-0 w-full h-full border-0"
          allow="fullscreen; clipboard-write"
          loading="lazy"
        ></iframe>
      </div>
      <figcaption class="mt-2 flex items-center justify-between gap-4 text-sm text-brand-muted">
        <span>{{ title() }}</span>
        <a [href]="path()" target="_blank" rel="noopener noreferrer" class="shrink-0">
          Open full size
        </a>
      </figcaption>
    </figure>
  `,
})
export class NgmdDemo {
  private readonly sanitizer = inject(DomSanitizer);

  readonly src = input.required<string>();
  readonly title = input<string>('Live demo');
  readonly ratio = input<string>('16 / 9');

  /** The path, or `about:blank` when it does not point inside this site. */
  protected readonly path = computed(() => {
    const src = this.src().trim();
    return /^\/(?!\/)[\w./~-]*$/.test(src) && !src.includes('..')
      ? withBase(appBase(), src)
      : 'about:blank';
  });

  protected readonly safeUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.path()),
  );
}
