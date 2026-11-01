import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'ngmd-hero',
  templateUrl: './hero.html',
})
export class NgmdHero {
  readonly title = input.required<string>();
  readonly logo = input<string>();
  readonly gradient = input(false, {
    transform: (v: boolean | string) => v === '' || v === true || v === 'true',
  });

  readonly bgClass = computed(() =>
    this.gradient()
      ? 'border border-zinc-200 dark:border-zinc-800'
      : 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800',
  );

  readonly titleClass = computed(() =>
    this.gradient() ? 'bg-clip-text text-transparent' : 'text-zinc-900 dark:text-zinc-100',
  );

  readonly bodyClass = computed(() => 'text-zinc-700 dark:text-brand-muted-dark');
}
