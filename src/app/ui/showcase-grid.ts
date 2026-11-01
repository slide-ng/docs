import {Component, ElementRef, computed, inject, signal} from '@angular/core';
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
  templateUrl: './showcase-grid.html',
})
export class NgmdShowcaseGrid {
  constructor() {
    // The page lists the decks as links inside this tag for readers without scripts.
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.replaceChildren();
  }

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
