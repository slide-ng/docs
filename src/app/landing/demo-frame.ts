import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {appBase, withBase} from '../../base';
import {DECK_URL} from './deck';
import type {TyperPosition} from './typer';

/**
 * The frame of the landing demo: the built deck in an iframe of this site.
 *
 * It follows `position` the way a visitor would. A new slide is a change of the frame's address
 * (`#/3?clicks=0`, the deck uses hash addresses), and a click on the same slide is the
 * right arrow key sent to the deck. A click on the frame hands it to the visitor: `takeover` fires,
 * the cover goes away and the deck is theirs.
 */
@Component({
  selector: 'app-demo-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
      style="aspect-ratio: 16 / 9"
    >
      <iframe
        #frame
        [src]="src()"
        title="A slide.ng deck, built with slide.ng"
        class="absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] max-w-none border-0 transition-opacity duration-500"
        [class.opacity-0]="!visible()"
        allow="fullscreen"
        (load)="onLoad()"
      ></iframe>
      @if (!taken()) {
        <!-- The frame is a pixel larger on every side, so the deck's dark backdrop never shows at an edge. -->
        <button
          type="button"
          class="landing-cover absolute inset-0 flex h-full w-full cursor-pointer items-end justify-center bg-transparent pb-2 text-xs text-zinc-500 focus-visible:outline-2 focus-visible:outline-fuchsia-600"
          (click)="takeover.emit()"
        >
          <span
            class="landing-hint rounded-full bg-white/90 px-3 py-1 shadow-sm dark:bg-zinc-950/90"
          >
            {{ visible() ? 'Click to use the slides yourself' : 'The first slide appears here' }}
          </span>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .landing-hint {
      opacity: 0;
      transition: opacity 0.2s;
    }
    .landing-cover:hover .landing-hint,
    .landing-cover:focus-visible .landing-hint {
      opacity: 1;
    }
    @media (hover: none) {
      .landing-hint {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      iframe {
        transition: none;
      }
    }
  `,
})
export class DemoFrame {
  /** The slide (0-based, -1 for none yet) and click to show. */
  readonly position = input.required<TyperPosition>();
  /** The visitor clicked the frame. */
  readonly taken = input(false);
  readonly takeover = output();
  readonly loaded = signal(false);

  private readonly frame = viewChild.required<ElementRef<HTMLIFrameElement>>('frame');
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly visible = computed(() => this.position().slide >= 0);
  protected readonly src = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(withBase(appBase(), `${DECK_URL}#/1?clicks=0`)),
  );

  /** What the frame shows now, so only a change is sent. */
  private shown = {slide: 0, clicks: 0};

  constructor() {
    effect(() => {
      const pos = this.position();
      if (!this.loaded()) return;
      this.apply(pos);
    });
    // The deck follows the colour of the site, not only the system's.
    effect(() => {
      if (this.loaded()) this.mirrorColor();
    });
    if (typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => this.mirrorColor());
    observer.observe(this.document.documentElement, {attributes: true, attributeFilter: ['class']});
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  protected onLoad(): void {
    this.shown = {slide: 0, clicks: 0};
    this.loaded.set(true);
    this.mirrorColor();
    this.apply(this.position());
  }

  /** Same-origin frame, so the deck's window is reachable. Null if it is not (yet). */
  private deck(): Window | null {
    try {
      const win = this.frame().nativeElement.contentWindow;
      return win && win.document ? win : null;
    } catch {
      return null;
    }
  }

  private apply(pos: TyperPosition): void {
    const win = this.deck();
    if (!win) return;
    if (pos.slide < 0) {
      // Replay: back to the first slide, which waits behind the cover.
      if (this.shown.slide !== 0) win.location.hash = '/1?clicks=0';
      this.shown = {slide: 0, clicks: 0};
      return;
    }
    if (pos.slide !== this.shown.slide) {
      win.location.hash = `/${pos.slide + 1}?clicks=0`;
      this.shown = {slide: pos.slide, clicks: 0};
    }
    // The deck reads ?clicks= only when a slide comes up, so later clicks are key presses.
    while (this.shown.clicks < pos.clicks) {
      this.shown.clicks++;
      const key = new (win as Window & {KeyboardEvent: typeof KeyboardEvent}).KeyboardEvent(
        'keydown',
        {
          key: 'ArrowRight',
          bubbles: true,
        },
      );
      win.document.dispatchEvent(key);
    }
    if (pos.clicks < this.shown.clicks) this.shown.clicks = pos.clicks;
  }

  private mirrorColor(): void {
    const win = this.deck();
    if (!win) return;
    const dark = this.document.documentElement.classList.contains('dark');
    win.document.documentElement.classList.toggle('dark', dark);
    win.document.documentElement.classList.toggle('light', !dark);
  }

  /** Give the keyboard to the deck once the visitor has taken over. */
  focusDeck(): void {
    this.frame().nativeElement.focus();
    this.deck()?.focus();
  }
}
