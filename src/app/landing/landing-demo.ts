import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {LucidePause, LucidePlay, LucideRotateCcw, LucideDynamicIcon} from '@lucide/angular';
import {DemoEditor} from './demo-editor';
import {DemoFrame} from './demo-frame';
import {DECK_CLICKS, DECK_MARKDOWN, slideEnds} from './deck';
import {Typer} from './typer';

/**
 * The live demo of the landing page: a markdown editor that types out `demos/landing/slides.md`,
 * and the built deck, which moves to each slide as soon as its markdown is complete.
 *
 * Typing starts when the demo comes into view. It can be paused and replayed, and it never runs
 * for visitors who prefer reduced motion: they get the whole text at once. A click on the frame
 * stops the typing and hands the deck to the visitor.
 */
@Component({
  selector: 'app-landing-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DemoEditor, DemoFrame, LucideDynamicIcon],
  template: `
    <div class="flex flex-col gap-3" #root>
      <div
        class="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div
          class="flex items-center gap-2 border-b border-zinc-200 px-3 py-1.5 dark:border-zinc-800"
        >
          <span class="font-mono text-xs text-zinc-500">./slides.md</span>
          <span class="ml-auto flex items-center gap-1">
            @if (typer.state() === 'playing' || typer.state() === 'paused') {
              <button
                type="button"
                class="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                [attr.aria-label]="typer.state() === 'paused' ? 'Resume typing' : 'Pause typing'"
                (click)="togglePause()"
              >
                <svg
                  [lucideIcon]="typer.state() === 'paused' ? playIcon : pauseIcon"
                  class="size-4"
                ></svg>
              </button>
            }
            <button
              type="button"
              class="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
              aria-label="Replay"
              (click)="replay()"
            >
              <svg [lucideIcon]="replayIcon" class="size-4"></svg>
            </button>
          </span>
        </div>
        <app-demo-editor
          class="h-48 sm:h-56"
          [text]="typer.text()"
          [caret]="typer.state() === 'playing' || typer.state() === 'paused'"
        />
      </div>

      <app-demo-frame
        #frame
        [position]="typer.position()"
        [taken]="taken()"
        (takeover)="takeOver()"
      />

      <p class="m-0 text-center text-sm text-zinc-500">
        The slides <span class="max-lg:hidden">on the right</span
        ><span class="lg:hidden">above</span> are real slide.ng output.
        @if (taken()) {
          <span>They are yours now. Replay to watch it again.</span>
        }
      </p>
    </div>
  `,
})
export class LandingDemo {
  protected readonly typer = new Typer({
    text: DECK_MARKDOWN,
    ends: slideEnds(DECK_MARKDOWN),
    clicks: DECK_CLICKS,
  });

  /** The visitor clicked the frame: the deck is theirs. */
  protected readonly taken = signal(false);

  protected readonly playIcon = LucidePlay;
  protected readonly pauseIcon = LucidePause;
  protected readonly replayIcon = LucideRotateCcw;

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly frame = viewChild.required(DemoFrame);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
      this.typer.destroy();
    });
    // Nothing is typed on the server, only in the browser once the demo can be seen.
    afterNextRender(() => {
      if (this.reducedMotion()) return this.typer.showAll();
      if (typeof IntersectionObserver === 'undefined') return this.typer.start();
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          this.observer?.disconnect();
          this.typer.start();
        },
        {threshold: 0.4},
      );
      this.observer.observe(this.root().nativeElement);
    });
  }

  private observer: IntersectionObserver | undefined;

  private reducedMotion(): boolean {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  protected togglePause(): void {
    if (this.typer.state() === 'paused') this.typer.resume();
    else this.typer.pause();
  }

  protected replay(): void {
    this.taken.set(false);
    if (this.reducedMotion()) {
      this.typer.showAll();
    } else {
      this.typer.start();
    }
  }

  protected takeOver(): void {
    this.observer?.disconnect();
    this.typer.stop();
    this.taken.set(true);
    // The frame has to lose its cover before it can take the keyboard.
    queueMicrotask(() => this.frame().focusDeck());
  }
}
