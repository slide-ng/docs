/**
 * A small step engine that types text into an editor: the same idea as the TypeIt script of
 * Slidev's home page, written by hand. A script is a list of steps (type, move, delete, pause,
 * exec). `flatten` turns it into timed operations, `replay` applies them at once, and `Player`
 * runs them with timers. Plain TypeScript with no imports, so Node can load it too (the script
 * that builds the slides of the demo uses it).
 */

export type Step =
  /** Insert `text` at the caret, one character at a time (all at once when `speed` is 0). */
  | {kind: 'type'; text: string; speed?: number; delay?: number}
  /** Move the caret to the start or the end, or by `to` characters (negative is left). */
  | {kind: 'move'; to: 'start' | 'end' | number; speed?: number; delay?: number}
  /** Delete `count` characters before the caret. */
  | {kind: 'delete'; count: number; speed?: number; delay?: number}
  /** Wait. */
  | {kind: 'pause'; ms: number}
  /** Call back with a label, for example to show another slide. */
  | {kind: 'exec'; label: string};

export const type = (text: string, o: {speed?: number; delay?: number} = {}): Step => ({
  kind: 'type',
  text,
  ...o,
});
export const move = (
  to: 'start' | 'end' | number,
  o: {speed?: number; delay?: number} = {},
): Step => ({kind: 'move', to, ...o});
export const del = (count: number, o: {speed?: number; delay?: number} = {}): Step => ({
  kind: 'delete',
  count,
  ...o,
});
export const pause = (ms: number): Step => ({kind: 'pause', ms});
export const exec = (label: string): Step => ({kind: 'exec', label});

export interface Op {
  /** Milliseconds to wait before this operation. */
  wait: number;
  /** What it does. */
  do:
    | {t: 'insert'; text: string}
    | {t: 'caret'; to: 'start' | 'end' | 'left' | 'right'}
    | {t: 'erase'}
    | {t: 'exec'; label: string}
    | {t: 'none'};
}

export interface Editor {
  text: string;
  /** Caret position, an index into `text` (in UTF-16 units, always between two characters). */
  caret: number;
}

export interface FlattenOptions {
  /** Time per character, in milliseconds. */
  speed?: number;
  /** Wait before the first step. */
  startDelay?: number;
}

/** Characters of `text`, with an emoji (a surrogate pair) as one. */
const chars = (text: string): string[] => Array.from(text);

/**
 * A repeatable stand-in for the random speed of a person typing: 75% to 125% of `speed`,
 * from a fixed sequence, so a test with fake timers sees the same times every run.
 */
function jitter(speed: number, n: number): number {
  return Math.round(speed * (0.75 + (((n * 37) % 11) / 10) * 0.5));
}

export function flatten(steps: readonly Step[], options: FlattenOptions = {}): Op[] {
  const base = options.speed ?? 50;
  const ops: Op[] = [];
  let n = 0;
  let carry = options.startDelay ?? 0; // waiting time to add before the next operation
  const push = (wait: number, op: Op['do']) => {
    ops.push({wait: wait + carry, do: op});
    carry = 0;
  };
  for (const step of steps) {
    if (step.kind === 'pause') {
      carry += step.ms;
      continue;
    }
    if (step.kind === 'exec') {
      push(0, {t: 'exec', label: step.label});
      continue;
    }
    const speed = step.speed ?? base;
    carry += step.delay ?? 0;
    if (step.kind === 'type') {
      if (speed === 0) {
        if (step.text) push(0, {t: 'insert', text: step.text});
      } else {
        for (const c of chars(step.text)) push(jitter(speed, n++), {t: 'insert', text: c});
      }
    } else if (step.kind === 'move') {
      if (typeof step.to === 'string') {
        push(speed === 0 ? 0 : jitter(speed, n++), {t: 'caret', to: step.to});
      } else {
        for (let i = 0; i < Math.abs(step.to); i++) {
          push(speed === 0 ? 0 : jitter(speed, n++), {
            t: 'caret',
            to: step.to < 0 ? 'left' : 'right',
          });
        }
      }
    } else {
      for (let i = 0; i < step.count; i++) {
        push(speed === 0 ? 0 : jitter(speed, n++), {t: 'erase'});
      }
    }
  }
  return ops;
}

/** Apply one operation to the editor. Returns the label of an `exec`. */
export function apply(editor: Editor, op: Op['do']): string | undefined {
  const {text, caret} = editor;
  switch (op.t) {
    case 'insert':
      editor.text = text.slice(0, caret) + op.text + text.slice(caret);
      editor.caret = caret + op.text.length;
      break;
    case 'caret':
      if (op.to === 'start') editor.caret = 0;
      else if (op.to === 'end') editor.caret = text.length;
      else if (op.to === 'left') editor.caret = caret - lastLength(text.slice(0, caret));
      else editor.caret = caret + (chars(text.slice(caret))[0]?.length ?? 0);
      break;
    case 'erase': {
      const len = lastLength(text.slice(0, caret));
      editor.text = text.slice(0, caret - len) + text.slice(caret);
      editor.caret = caret - len;
      break;
    }
    case 'exec':
      return op.label;
    case 'none':
      break;
  }
  return undefined;
}

function lastLength(before: string): number {
  const all = chars(before);
  return all.length ? all[all.length - 1].length : 0;
}

/** Run a script at once. `onExec` gets each label with the text and caret at that moment. */
export function replay(
  steps: readonly Step[],
  onExec?: (label: string, editor: Readonly<Editor>) => void,
): Editor {
  const editor: Editor = {text: '', caret: 0};
  for (const op of flatten(steps)) {
    const label = apply(editor, op.do);
    if (label !== undefined) onExec?.(label, editor);
  }
  return editor;
}

export type PlayerState = 'idle' | 'playing' | 'paused' | 'done';

export interface PlayerOptions extends FlattenOptions {
  /** Called after every change to the text or the caret. */
  onChange?: (editor: Readonly<Editor>) => void;
  onExec?: (label: string, editor: Readonly<Editor>) => void;
  onState?: (state: PlayerState) => void;
  /** Time from the last character to `done`. */
  completeDelay?: number;
}

/** Plays a script with timers: start, pause, resume, stop, and `showAll` for no motion at all. */
export class Player {
  readonly editor: Editor = {text: '', caret: 0};
  private _state: PlayerState = 'idle';
  private readonly ops: Op[];
  private index = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  private readonly options: PlayerOptions;

  constructor(steps: readonly Step[], options: PlayerOptions = {}) {
    this.options = options;
    this.ops = flatten(steps, options);
  }

  get state(): PlayerState {
    return this._state;
  }

  /** From the beginning. A running or finished player starts over. */
  start(): void {
    this.cancel();
    this.reset();
    this.setState('playing');
    this.schedule();
  }

  pause(): void {
    if (this._state !== 'playing') return;
    this.cancel();
    this.setState('paused');
  }

  resume(): void {
    if (this._state !== 'paused') return;
    this.setState('playing');
    this.schedule();
  }

  /** Stop where it is. The text stays. */
  stop(): void {
    this.cancel();
    if (this._state === 'playing' || this._state === 'paused') this.setState('idle');
  }

  /** The whole script at once: the end state, without any waiting. */
  showAll(): void {
    this.cancel();
    this.reset();
    for (const op of this.ops) this.run(op);
    this.index = this.ops.length;
    this.setState('done');
  }

  destroy(): void {
    this.cancel();
  }

  private reset(): void {
    this.index = 0;
    this.editor.text = '';
    this.editor.caret = 0;
    this.options.onChange?.(this.editor);
  }

  private run(op: Op): void {
    const label = apply(this.editor, op.do);
    if (label !== undefined) this.options.onExec?.(label, this.editor);
    else this.options.onChange?.(this.editor);
  }

  private schedule(): void {
    if (this.index >= this.ops.length) {
      this.timer = setTimeout(() => this.setState('done'), this.options.completeDelay ?? 300);
      return;
    }
    const op = this.ops[this.index];
    this.timer = setTimeout(() => {
      this.index++;
      this.run(op);
      this.schedule();
    }, op.wait);
  }

  private cancel(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private setState(state: PlayerState): void {
    this._state = state;
    this.options.onState?.(state);
  }
}
