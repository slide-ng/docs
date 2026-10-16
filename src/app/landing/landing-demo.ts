import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideDynamicIcon,
  LucideRotateCcw,
} from '@lucide/angular';
import {appBase, withBase} from '../../base';
import {CHOREOGRAPHY, LAST_STAGE, TYPING} from './choreography';
import {editorLines} from './highlight';
import {Player, type PlayerState} from './steps';

/** The size the slides are designed at. The card scales it down to its width, as Slidev's does. */
const SLIDE_WIDTH = 980;
const SLIDE_HEIGHT = (980 * 9) / 16;

/** Where the built deck of stages is served, relative to the site root. */
const DECK_URL = '/demos/landing/';

/**
 * The demo of the home page, built like Slidev's: an editor window that types a deck, and a slide
 * card over its bottom right corner that shows the real slides as they take shape.
 *
 * The editor types `demos/landing/slides.md` (`choreography.ts`). The card is two pages side by side
 * in a track that slides from one to the other. Each page is the built deck (`public/demos/landing/`,
 * one slide for every moment) in a frame of the design size, scaled to the card. The choreography
 * says which slide each page shows.
 */
@Component({
  selector: 'app-landing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideDynamicIcon],
  template: `
    <div #root role="group" aria-label="A deck typed as markdown, and its slides next to it">
      <div class="demo-editor">
        <div class="filename">./slides.md</div>
        <button
          type="button"
          class="replay"
          title="Replay"
          aria-label="Replay the demo"
          (click)="play()"
        >
          <svg [lucideIcon]="replayIcon" class="size-4" aria-hidden="true"></svg>
        </button>
        <div class="code">
          <pre
            class="text"
          ><code>@for (line of lines(); track $index) {<span class="line">@for (seg of line; track $index) {@if (seg.kind === 'caret') {<span class="caret" aria-hidden="true"></span>} @else {<span [class]="'t-' + seg.kind">{{ seg.text }}</span>}}</span>}</code></pre>
        </div>
      </div>

      <div #card class="slide-card">
        <div class="ratio"></div>
        <div class="slide-fill">
          <div class="track" [class.page-2]="page() === 1">
            @for (n of pages; track n) {
              <div class="page">
                <div
                  class="slide-content"
                  [style.width.px]="slideWidth"
                  [style.height.px]="slideHeight"
                  [style.transform]="transform()"
                >
                  <iframe
                    #frame
                    class="frame"
                    [class.shown]="shown(n)"
                    [src]="src"
                    [title]="'Page ' + (n + 1) + ' of the deck, built with slide.ng'"
                    tabindex="-1"
                    (load)="onLoad(n)"
                  ></iframe>
                </div>
              </div>
            }
          </div>
          <div class="chevrons">
            <button
              type="button"
              class="chevron"
              aria-label="Previous page"
              [disabled]="page() === 0"
              (click)="page.set(0)"
            >
              <svg [lucideIcon]="leftIcon" class="size-5" aria-hidden="true"></svg>
            </button>
            <button
              type="button"
              class="chevron"
              aria-label="Next page"
              [disabled]="page() === 1"
              (click)="page.set(1)"
            >
              <svg [lucideIcon]="rightIcon" class="size-5" aria-hidden="true"></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      --demo-bg: #f1ebe1;
      --demo-fg: #16131a;
      --demo-muted: #4f4b55;
      --demo-slide: #fbf8f3;
      --demo-edge: rgba(22, 19, 26, 0.06);
      --demo-edge-strong: rgba(22, 19, 26, 0.18);
      --demo-key: #8f300a;
      --demo-rule: #67626e;
      --demo-offset-x: 1.25rem;
      --demo-offset-y: 2.5rem;
      /* The same two shadows as the editor and the card of Slidev's demo. */
      --demo-shadow:
        0 0 0 1px var(--demo-edge), 0 0 30px 1px color-mix(in srgb, #16131a 15%, transparent);
    }
    :host-context(.dark) {
      --demo-bg: #211d27;
      --demo-fg: #fbf8f3;
      --demo-muted: #c9c4cf;
      --demo-slide: #16131a;
      --demo-edge: rgba(251, 248, 243, 0.1);
      --demo-edge-strong: rgba(251, 248, 243, 0.3);
      --demo-key: #ef6430;
      --demo-rule: #a39ea9;
      --demo-shadow:
        0 0 0 1px var(--demo-edge), 0 0 30px 1px color-mix(in srgb, #000 40%, transparent);
    }
    @media (min-width: 640px) {
      :host {
        --demo-offset-x: 5rem;
        --demo-offset-y: 5rem;
      }
    }

    /* Room for the card's offset to the right, so the pair stays centred and inside the page. */
    [role='group'] {
      width: 100%;
      max-width: 50rem;
      margin-inline: auto;
      padding-right: var(--demo-offset-x);
    }

    .demo-editor {
      position: relative;
      box-sizing: border-box;
      min-height: 450px;
      margin-top: 25px;
      padding: 10px;
      border-radius: 7px;
      font-size: 1em;
      line-height: 1.2em;
      background: var(--demo-bg);
      color: var(--demo-fg);
      box-shadow: var(--demo-shadow);
    }
    :host-context(.dark) .demo-editor {
      border: 1px solid var(--demo-edge);
    }
    /* The three dots of a window, drawn with one shadowed circle as in Slidev's. */
    .demo-editor::after {
      content: '';
      position: absolute;
      top: 12px;
      left: 10px;
      width: 12px;
      height: 12px;
      background: #f95c5b;
      border-radius: 100%;
      box-shadow:
        0 0 0 1px #da3d42,
        22px 0 0 0 #fabe3b,
        22px 0 0 1px #ecb03e,
        44px 0 0 0 #38cd46,
        44px 0 0 1px #2eae32;
    }
    .filename {
      text-align: center;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: var(--demo-muted);
    }
    .code {
      padding: 0.25rem 1rem;
    }
    .text {
      margin: 0;
      padding: 0;
      background: transparent;
      text-align: left;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
      font-size: 1em;
      line-height: 1.2em;
    }
    .text code {
      font: inherit;
      background: none;
      padding: 0;
      border: 0;
      color: inherit;
    }
    .line {
      display: block;
      min-height: 1.2em;
    }
    .t-rule {
      color: var(--demo-rule);
    }
    .t-key,
    .t-mark {
      color: var(--demo-key);
    }
    .t-heading {
      font-weight: 700;
    }
    .caret {
      display: inline-block;
      width: 0;
      height: 1.1em;
      margin-left: -1px;
      border-left: 2px solid var(--demo-fg);
      vertical-align: text-bottom;
      animation: caret-blink 1s steps(1) infinite;
    }
    @keyframes caret-blink {
      50% {
        opacity: 0;
      }
    }
    .replay {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border: 0;
      border-radius: 0.375rem;
      background: transparent;
      color: var(--demo-muted);
      cursor: pointer;
    }
    .replay:hover {
      background: var(--demo-edge);
      color: var(--demo-fg);
    }
    .replay:focus-visible,
    .chevron:focus-visible {
      outline: 2px solid var(--demo-key);
      outline-offset: 2px;
    }

    .slide-card {
      position: relative;
      margin-top: 1rem;
      border-radius: 7px;
      background: var(--demo-slide);
      box-shadow: var(--demo-shadow);
      overflow: hidden;
      transform: translate(var(--demo-offset-x), calc(var(--demo-offset-y) * -1));
    }
    :host-context(.dark) .slide-card {
      border: 1px solid var(--demo-edge);
    }
    .ratio {
      aspect-ratio: 16 / 9;
    }
    .slide-fill {
      position: absolute;
      inset: 0;
    }
    .track {
      display: flex;
      width: 200%;
      height: 100%;
      transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .track.page-2 {
      transform: translateX(-50%);
    }
    .page {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .slide-content {
      position: absolute;
      left: 50%;
      top: 50%;
      overflow: hidden;
    }
    .frame {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      pointer-events: none;
      opacity: 0;
      background: transparent;
    }
    .frame.shown {
      opacity: 1;
    }
    .chevrons {
      position: absolute;
      left: 0.5rem;
      bottom: 0.25rem;
      display: flex;
      gap: 0.125rem;
    }
    .chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: 0;
      border-radius: 0.375rem;
      background: rgba(22, 19, 26, 0.78);
      color: #fbf8f3;
      cursor: pointer;
    }
    .chevron:hover:not(:disabled) {
      background: #16131a;
    }
    .chevron:disabled {
      opacity: 0.4;
      cursor: default;
    }
    :host-context(.dark) .chevron {
      background: rgba(251, 248, 243, 0.2);
    }
    @media (prefers-reduced-motion: reduce) {
      .track {
        transition: none;
      }
      .caret {
        animation: none;
      }
    }
  `,
})
export class LandingDemo {
  protected readonly slideWidth = SLIDE_WIDTH;
  protected readonly slideHeight = SLIDE_HEIGHT;
  protected readonly pages = [0, 1];
  protected readonly leftIcon = LucideChevronLeft;
  protected readonly rightIcon = LucideChevronRight;
  protected readonly replayIcon = LucideRotateCcw;

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly card = viewChild.required<ElementRef<HTMLElement>>('card');
  protected readonly src = inject(DomSanitizer).bypassSecurityTrustResourceUrl(
    withBase(appBase(), `${DECK_URL}#/1`),
  );

  /** What the editor shows. */
  protected readonly text = signal('');
  protected readonly caret = signal(0);
  protected readonly state = signal<PlayerState>('idle');
  /** The page of the card: 0 or 1. */
  protected readonly page = signal(0);
  /** The slide each page shows: -1 for none yet. Page 1 is stages 0 to 4, page 2 is 5 to 9. */
  protected readonly stage = signal<[number, number]>([-1, -1]);
  /** The card's width over the design width. */
  protected readonly scale = signal(720 / SLIDE_WIDTH);
  protected readonly loaded = signal<[boolean, boolean]>([false, false]);

  protected readonly lines = computed(() => editorLines(this.text(), this.caret()));
  protected readonly transform = computed(() => `translate(-50%, -50%) scale(${this.scale()})`);

  private readonly player = new Player(CHOREOGRAPHY, {
    ...TYPING,
    onChange: (editor) => {
      this.text.set(editor.text);
      this.caret.set(editor.caret);
    },
    onExec: (label, editor) => {
      this.text.set(editor.text);
      this.caret.set(editor.caret);
      this.exec(label);
    },
    onState: (state) => {
      this.state.set(state);
    },
  });

  private observer: IntersectionObserver | undefined;
  private resizer: ResizeObserver | undefined;
  private started = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.player.destroy();
      this.observer?.disconnect();
      this.resizer?.disconnect();
    });
    // The frames follow the stage: a change of the address of the deck, which is a hash router.
    effect(() => {
      const [first, second] = this.stage();
      const [loadedFirst, loadedSecond] = this.loaded();
      if (loadedFirst && first >= 0) this.go(0, first);
      if (loadedSecond && second >= 0) this.go(1, second);
    });
    afterNextRender(() => this.init());
  }

  protected shown(page: number): boolean {
    return this.stage()[page] >= 0 && this.loaded()[page];
  }

  private init(): void {
    // Nothing is typed while the page is prerendered.
    if (!isPlatformBrowser(this.platformId)) return;
    // Draw the cover image before it is needed, so it is there when the slide turns to it.
    const preload = new Image();
    preload.src = withBase(appBase(), `${DECK_URL}demo-cover.svg`);

    this.resizer = new ResizeObserver(() => this.measure());
    this.resizer.observe(this.card().nativeElement);
    this.measure();
    // The deck inside the frames follows the colour of the site.
    new MutationObserver(() => this.mirrorColor()).observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (this.reducedMotion()) {
      this.showAll();
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      this.play();
      return;
    }
    // Typing starts when the demo is in view, stops while it is not, and goes on when it is again.
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !this.started) {
          this.started = true;
          this.play();
        } else if (visible) {
          this.player.resume();
        } else {
          this.player.pause();
        }
      },
      {threshold: 0.3},
    );
    this.observer.observe(this.root().nativeElement);
  }

  protected play(): void {
    this.started = true;
    this.page.set(0);
    this.stage.set([-1, -1]);
    if (this.reducedMotion()) {
      this.showAll();
      return;
    }
    this.player.start();
  }

  /** The end state at once: all the text, the cover on page 1, no motion. */
  private showAll(): void {
    this.player.showAll();
  }

  private exec(label: string): void {
    const [kind, value] = label.split(':');
    const n = Number(value);
    if (kind === 'page') {
      this.page.set(n);
    } else if (kind === 'stage') {
      const next: [number, number] = [...this.stage()];
      next[n <= LAST_STAGE[0] ? 0 : 1] = n;
      this.stage.set(next);
    }
  }

  protected onLoad(page: number): void {
    const next: [boolean, boolean] = [...this.loaded()];
    next[page] = true;
    this.loaded.set(next);
    this.mirrorColor();
  }

  private frame(page: number): HTMLIFrameElement | null {
    return (
      (this.card().nativeElement.querySelectorAll('iframe')[page] as
        HTMLIFrameElement | undefined) ?? null
    );
  }

  /** Same-origin frame, so the deck's window is reachable. Null if it is not (yet). */
  private deck(page: number): Window | null {
    try {
      const win = this.frame(page)?.contentWindow;
      return win && win.document ? win : null;
    } catch {
      return null;
    }
  }

  private go(page: number, stage: number): void {
    const win = this.deck(page);
    const hash = `#/${stage + 1}`;
    // The deck adds `?clicks=0` to the address it is at, so the slide is compared by its start.
    if (win && win.location.hash.split('?')[0] !== hash) win.location.hash = hash;
  }

  private mirrorColor(): void {
    const dark = this.document.documentElement.classList.contains('dark');
    for (const page of [0, 1]) {
      const win = this.deck(page);
      if (!win) continue;
      win.document.documentElement.classList.toggle('dark', dark);
      win.document.documentElement.classList.toggle('light', !dark);
    }
  }

  private measure(): void {
    const width = this.card().nativeElement.clientWidth;
    if (width > 0) this.scale.set(width / SLIDE_WIDTH);
  }

  private reducedMotion(): boolean {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
