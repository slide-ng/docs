import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  inject,
  input,
  QueryList,
  signal,
} from '@angular/core';
import {watchHostAttribute} from '../utils/watch-host-attribute';

@Component({
  selector: 'ngmd-step',
  templateUrl: './workflow.ngmd-step.html',
})
export class NgmdStep {
  readonly title = input<string>('');
  readonly index = signal(0);

  constructor() {
    // When this step is used inside a `<ngmd-workflow>` rendered from a
    // markdown body, the workflow can't see this step via `ContentChildren`
    // because each `<ngmd-step>` is its own Custom Element host. The
    // workflow instead sets a `data-step-index` attribute on each child
    // element; we read it here on setup and on every later change.
    // Component-pages (where ContentChildren works) still call `index.set(i)`
    // directly; the attribute path is a no-op for them.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const stop = watchHostAttribute(host, 'data-step-index', (value) => {
      if (value === null) return;
      const n = parseInt(value, 10);
      if (!Number.isNaN(n)) this.index.set(n);
    });
    inject(DestroyRef).onDestroy(stop);
  }
}

@Component({
  selector: 'ngmd-workflow',
  templateUrl: './workflow.ngmd-workflow.html',
})
export class NgmdWorkflow implements AfterContentInit, AfterViewInit {
  @ContentChildren(NgmdStep) private readonly steps!: QueryList<NgmdStep>;
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  ngAfterContentInit(): void {
    // Component-pages path: ContentChildren finds Angular instances
    // directly because the projected children are real Angular components
    // (no Custom Element boundary in the way).
    this.steps.forEach((step, i) => step.index.set(i));
  }

  ngAfterViewInit(): void {
    // Markdown path: child `<ngmd-step>` elements are Custom Elements that
    // ContentChildren can't see through. Walk the DOM and set
    // `data-step-index="N"` on each one; the step's MutationObserver picks
    // the new value up and updates its signal. Safe to run in both contexts:
    // for component pages this is a redundant attribute set that the step
    // ignores (its signal is already the right value).
    if (typeof document === 'undefined') return;
    const els = this.host.nativeElement.querySelectorAll<HTMLElement>('ngmd-step');
    els.forEach((el, i) => el.setAttribute('data-step-index', String(i)));
  }
}
