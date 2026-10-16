import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  input,
  viewChild,
} from '@angular/core';
import {fenceStates, highlightLine, type Token, type TokenKind} from './highlight';

const KIND_CLASS: Record<TokenKind, string> = {
  plain: '',
  punct: 'text-zinc-400 dark:text-zinc-500',
  heading: 'font-semibold text-fuchsia-700 dark:text-fuchsia-300',
  key: 'text-sky-700 dark:text-sky-300',
  tag: 'text-emerald-700 dark:text-emerald-300',
  code: 'text-amber-700 dark:text-amber-300',
};

/**
 * The editor panel of the landing demo: a read-only view of `slides.md` as it is typed. The
 * caret stays at the end, and the panel scrolls to keep it in sight.
 */
@Component({
  selector: 'app-demo-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #scroller
      class="landing-editor h-full overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 text-zinc-800 dark:text-zinc-200"
      role="region"
      aria-label="The markdown of the deck, typed out"
      tabindex="0"
    >
      <pre
        class="m-0 whitespace-pre-wrap break-words font-[inherit]"
      ><code>@for (line of lines(); track $index; let last = $last) {<span class="block min-h-6">@for (token of line; track $index) {<span [class]="kind[token.kind]">{{ token.text }}</span>}@if (last && caret()) {<span class="landing-caret" aria-hidden="true"></span>}</span>}</code></pre>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .landing-caret {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      margin-left: 1px;
      vertical-align: text-bottom;
      background: currentColor;
      animation: landing-blink 1.1s steps(1) infinite;
    }
    @keyframes landing-blink {
      50% {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .landing-caret {
        animation: none;
      }
    }
  `,
})
export class DemoEditor {
  /** The text typed so far. */
  readonly text = input.required<string>();
  /** Show the caret. */
  readonly caret = input(true);

  protected readonly kind = KIND_CLASS;
  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');

  protected readonly lines = computed<Token[][]>(() => {
    const lines = this.text().split('\n');
    const fences = fenceStates(lines);
    return lines.map((line, i) => highlightLine(line, fences[i]));
  });

  constructor() {
    // After the new text is in the page, so the last line is in view.
    afterRenderEffect(() => {
      this.text();
      const el = this.scroller().nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }
}
