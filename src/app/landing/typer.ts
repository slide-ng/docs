import {signal} from '@angular/core';

export type TyperState = 'idle' | 'playing' | 'paused' | 'done' | 'stopped';

export interface TyperOptions {
  /** The text to type. */
  text: string;
  /** For each slide, the offset at which its markdown is complete. */
  ends: readonly number[];
  /** Clicks to step through on each slide, once the slide is complete. */
  clicks: readonly number[];
  /** Base time per character, in milliseconds. Each character varies by up to 10. */
  charDelay?: number;
}

/** Where the frame should be: the last slide that is complete, and the click on it. */
export interface TyperPosition {
  slide: number;
  clicks: number;
}

type Step =
  | {kind: 'type'; to: number}
  | {kind: 'show'; slide: number}
  | {kind: 'click'}
  | {kind: 'wait'; ms: number};

/**
 * Types a text out one character at a time, and reports the slide each part of it makes
 * complete. Written by hand with `setTimeout`: it can be paused and resumed, stopped, and
 * replayed. With `showAll()` the whole text appears at once, for visitors who ask for less motion.
 */
export class Typer {
  readonly text = signal('');
  readonly state = signal<TyperState>('idle');
  /** `slide` is -1 until the first slide is complete. */
  readonly position = signal<TyperPosition>({slide: -1, clicks: 0});

  private readonly charDelay: number;
  private readonly steps: Step[];
  private step = 0;
  private typed = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly options: TyperOptions) {
    this.charDelay = options.charDelay ?? 40;
    this.steps = buildSteps(options);
  }

  /** Start from the beginning. */
  start(): void {
    this.clearTimer();
    this.step = 0;
    this.typed = 0;
    this.text.set('');
    this.position.set({slide: -1, clicks: 0});
    this.state.set('playing');
    this.schedule(900);
  }

  pause(): void {
    if (this.state() !== 'playing') return;
    this.clearTimer();
    this.state.set('paused');
  }

  resume(): void {
    if (this.state() !== 'paused') return;
    this.state.set('playing');
    this.schedule(0);
  }

  /** The visitor took over: stop typing and keep what is there. */
  stop(): void {
    this.clearTimer();
    if (this.state() !== 'done') this.state.set('stopped');
  }

  /** The whole text at once, with the frame on the first slide. */
  showAll(): void {
    this.clearTimer();
    this.text.set(this.options.text);
    this.position.set({slide: 0, clicks: 0});
    this.state.set('done');
  }

  destroy(): void {
    this.clearTimer();
  }

  private schedule(ms: number): void {
    this.clearTimer();
    this.timer = setTimeout(() => this.tick(), ms);
  }

  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private tick(): void {
    const step = this.steps[this.step];
    if (!step) {
      this.state.set('done');
      return;
    }
    switch (step.kind) {
      case 'type': {
        if (this.typed < step.to) {
          const char = this.options.text[this.typed++];
          this.text.set(this.options.text.slice(0, this.typed));
          if (this.typed >= step.to) this.step++;
          this.schedule(this.delayAfter(char));
          return;
        }
        this.step++;
        return this.tick();
      }
      case 'show':
        this.position.set({slide: step.slide, clicks: 0});
        break;
      case 'click':
        this.position.update((p) => ({...p, clicks: p.clicks + 1}));
        break;
      case 'wait':
        this.step++;
        this.schedule(step.ms);
        return;
    }
    this.step++;
    this.schedule(0);
  }

  /** 40 to 50 ms for a character, a little longer after a line break. */
  private delayAfter(char: string): number {
    const jitter = (char.charCodeAt(0) * 7) % 11;
    return this.charDelay + jitter + (char === '\n' ? 90 : 0);
  }
}

/** Type up to each end, show the slide, step its clicks, pause, and go on. */
function buildSteps({ends, clicks}: TyperOptions): Step[] {
  const steps: Step[] = [];
  ends.forEach((end, slide) => {
    steps.push({kind: 'type', to: end}, {kind: 'wait', ms: 500}, {kind: 'show', slide});
    for (let i = 0; i < (clicks[slide] ?? 0); i++) {
      steps.push({kind: 'wait', ms: 900}, {kind: 'click'});
    }
    steps.push({kind: 'wait', ms: 1100});
  });
  return steps;
}
