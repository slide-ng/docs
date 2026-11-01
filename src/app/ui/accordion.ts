import {Component, effect, input, signal} from '@angular/core';
import {LucideDynamicIcon, LucideChevronDown} from '@lucide/angular';

let idCounter = 0;

/**
 * Disclosure / accordion item. Signal-driven open/close state, full ARIA
 * (`aria-expanded`, `aria-controls`, region role + `aria-labelledby`).
 *
 * Chevron: single down-arrow icon, rotated 180deg on open. 200ms ease.
 *
 * Body: outer wrapper is a CSS grid container animating `grid-template-rows`
 * from `0fr` (closed) to `1fr` (open) over 280ms. Inner wrapper has
 * `overflow: hidden` + `min-height: 0` so the row fr basis drives height.
 * Works in Chrome 117+, Safari 17.4+, Firefox 121+.
 *
 * `prefers-reduced-motion` zeroes all transitions.
 */
@Component({
  selector: 'ngmd-accordion-item',
  imports: [LucideDynamicIcon],
  templateUrl: './accordion.ngmd-accordion-item.html',
})
export class NgmdAccordionItem {
  protected readonly chevronIcon = LucideChevronDown;

  readonly title = input.required<string>();
  /** Optional brand logo / icon URL rendered as a 16×16 prefix to the title. */
  readonly image = input<string>('');
  readonly open = input(false, {
    transform: (v: boolean | string) => v === '' || v === true || v === 'true',
  });

  private readonly id = ++idCounter;
  protected readonly buttonId = `ngmd-acc-btn-${this.id}`;
  protected readonly regionId = `ngmd-acc-region-${this.id}`;

  protected readonly expanded = signal(false);

  constructor() {
    effect(() => this.expanded.set(this.open()));
  }

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }
}

@Component({
  selector: 'ngmd-accordion',
  templateUrl: './accordion.ngmd-accordion.html',
})
export class NgmdAccordion {}
