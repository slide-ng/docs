import {Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import showcases from '../data/showcases.json';

export interface Showcase {
  slug: string;
  title: string;
  theme: string;
  blurb: string;
  tags: string[];
}

/** Tags worth a chip: the ones that more than one deck has. The search box finds the rest. */
const MIN_DECKS_PER_TAG = 2;

/** The tags of `decks` that at least `min` decks share, most used first. */
export function sharedTags(decks: readonly Showcase[], min = MIN_DECKS_PER_TAG) {
  const counts = new Map<string, number>();
  for (const deck of decks) {
    for (const tag of deck.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .filter(([, count]) => count >= min)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({tag, count}));
}

/** The decks that carry `tag` (when set) and whose text contains every word of `query`. */
export function filterShowcases(
  decks: readonly Showcase[],
  tag: string | null,
  query: string,
): Showcase[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return decks.filter((deck) => {
    if (tag && !deck.tags.includes(tag)) return false;
    const text = [deck.title, deck.theme, deck.blurb, ...deck.tags].join(' ').toLowerCase();
    return words.every((word) => text.includes(word));
  });
}

/**
 * The cards of the showcases page, with a search box and one chip per shared tag.
 *
 *   <ngmd-showcase-grid></ngmd-showcase-grid>
 *
 * The decks come from `src/app/data/showcases.json`, which `scripts/sync-showcases.mjs` writes.
 */
@Component({
  selector: 'ngmd-showcase-grid',
  imports: [RouterLink],
  host: {class: 'block my-6 not-prose'},
  template: `
    <div class="flex flex-col gap-3">
      <label class="flex flex-col gap-1 text-sm font-medium">
        <span>Search the decks</span>
        <input
          type="search"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          placeholder="Title, theme, topic"
          class="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-sm font-normal"
        />
      </label>
      <div class="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        <button
          type="button"
          [attr.aria-pressed]="tag() === null"
          (click)="tag.set(null)"
          [class]="chipClass(tag() === null)"
        >
          All
        </button>
        @for (item of tags; track item.tag) {
          <button
            type="button"
            [attr.aria-pressed]="tag() === item.tag"
            (click)="toggle(item.tag)"
            [class]="chipClass(tag() === item.tag)"
          >
            {{ item.tag }} <span class="opacity-60">{{ item.count }}</span>
          </button>
        }
      </div>
      <p class="m-0 text-sm text-brand-muted" role="status">
        {{ visible().length }} of {{ decks.length }} decks
      </p>
    </div>

    @if (visible().length > 0) {
      <ul class="mt-4 mb-0 p-0 grid grid-cols-1 gap-4 sm:grid-cols-2 list-none">
        @for (deck of visible(); track deck.slug) {
          <li class="m-0 p-0">
            <a
              [routerLink]="'/resources/showcases/' + deck.slug"
              class="h-full flex flex-col gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-5 text-inherit no-underline transition-colors hover:border-zinc-400 dark:hover:border-zinc-600"
            >
              <span class="flex items-start justify-between gap-3">
                <span class="text-base font-semibold text-zinc-900 dark:text-zinc-100">{{
                  deck.title
                }}</span>
                <span
                  class="shrink-0 rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--accent-strong)]"
                  >{{ deck.theme }}</span
                >
              </span>
              <span class="flex-1 text-sm text-brand-muted dark:text-brand-muted-dark">{{
                deck.blurb
              }}</span>
              <span class="flex flex-wrap gap-1.5">
                @for (t of deck.tags; track t) {
                  <span
                    class="rounded border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 text-xs text-brand-muted"
                    >{{ t }}</span
                  >
                }
              </span>
            </a>
          </li>
        }
      </ul>
    } @else {
      <p class="mt-4 text-sm text-brand-muted">No deck matches. Clear the search or pick All.</p>
    }
  `,
})
export class NgmdShowcaseGrid {
  readonly decks: readonly Showcase[] = showcases;
  readonly tags = sharedTags(this.decks);

  readonly tag = signal<string | null>(null);
  readonly query = signal('');
  readonly visible = computed(() => filterShowcases(this.decks, this.tag(), this.query()));

  toggle(tag: string): void {
    this.tag.update((current) => (current === tag ? null : tag));
  }

  chipClass(active: boolean): string {
    const base = 'rounded-full border px-3 py-1 text-sm transition-colors ';
    return (
      base +
      (active
        ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] font-medium'
        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600')
    );
  }
}
