import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {NgTemplateOutlet, ViewportScroller} from '@angular/common';
import {Router} from '@angular/router';
import {
  LucideDynamicIcon,
  LucideArrowRight,
  LucideBraces,
  LucideClock,
  LucideFileText,
  LucideHash,
  LucideSearch,
  LucideStar,
  LucideTrash,
  LucideX,
} from '@lucide/angular';
import type {SearchHit} from '../../types/search';
import {SearchService, type HistoryItem} from '../services/search/search.service';

/**
 * Cmd+K palette. The heavy lifting lives in `SearchService`; this component
 * is the open / close / navigation shell on top of it.
 *
 * Empty state shows recent visits from localStorage as plain buttons
 * (arrow keys move between them). Typing kicks the service (debounced) and
 * renders highlighted hits as a combobox listbox: arrows, Home/End and
 * Enter drive `aria-activedescendant`, pointer movement highlights a row,
 * click navigates and records the visit. Esc closes and focus returns to
 * whatever opened the palette.
 */
@Component({
  selector: 'app-command-palette',
  imports: [LucideDynamicIcon, NgTemplateOutlet],
  host: {'(document:keydown)': 'onKeydown($event)'},
  templateUrl: './command-palette.html',
})
export class CommandPalette {
  private readonly router = inject(Router);
  private readonly scroller = inject(ViewportScroller);
  protected readonly search = inject(SearchService);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');

  readonly searchIcon = LucideSearch;
  readonly arrowIcon = LucideArrowRight;
  readonly hashIcon = LucideHash;
  readonly fileIcon = LucideFileText;
  readonly symbolIcon = LucideBraces;
  readonly clockIcon = LucideClock;
  readonly trashIcon = LucideTrash;
  readonly starIcon = LucideStar;
  readonly closeIcon = LucideX;

  readonly listboxId = 'ngmd-search-results';
  readonly open = signal(false);
  /** Index of the highlighted result, shared by keyboard and pointer. */
  readonly active = signal(-1);

  /** Tracks which history row the pointer is over so the row, the star
   * toggle, and (when present) the result-side hover state share one
   * source of truth. URL not index, because favorites + recents render
   * as two lists with independent indices. */
  readonly hoverUrl = signal<string | null>(null);

  private returnFocus: HTMLElement | null = null;

  readonly showingHistory = computed(
    () => !this.search.query().trim() && this.search.history().length > 0,
  );

  readonly expanded = computed(() => !this.showingHistory() && this.search.results().length > 0);

  readonly status = computed(() => {
    if (this.showingHistory() || !this.search.query().trim() || this.search.loading()) return '';
    const count = this.search.results().length;
    if (!count) return 'No results found';
    return count === 1 ? '1 result' : `${count} results`;
  });

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.style.overflow = this.open() ? 'hidden' : '';
    });
    effect(() => {
      const results = this.search.results();
      this.active.set(results.length ? 0 : -1);
    });
    effect(() => this.input()?.nativeElement.focus());
    effect(() => {
      const i = this.active();
      if (i < 0 || typeof document === 'undefined') return;
      document.getElementById(this.optionId(i))?.scrollIntoView({block: 'nearest'});
    });
    // External components (404 catch-all, etc.) can pop the palette open
    // pre-filled by calling `search.requestOpen(query)`. The initial tick
    // value of 0 fires once at startup; ignore it so we don't auto-open.
    effect(() => {
      const tick = this.search.openTick();
      if (tick === 0) return;
      untracked(() => this.show());
    });
  }

  optionId(i: number): string {
    return `ngmd-search-option-${i}`;
  }

  iconFor(item: SearchHit) {
    if (item.kind === 'section') return this.hashIcon;
    if (item.kind === 'snippet') return this.fileIcon;
    if (item.kind === 'symbol') return this.symbolIcon;
    return this.arrowIcon;
  }

  onKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key?.toLowerCase() === 'k') {
      event.preventDefault();
      this.toggle();
      return;
    }
    if (this.open() && event.key === 'Escape') {
      event.preventDefault();
      this.close();
    }
  }

  toggle() {
    if (this.open()) {
      this.close();
      return;
    }
    this.search.query.set('');
    this.show();
  }

  close() {
    if (!this.open()) return;
    this.open.set(false);
    this.hoverUrl.set(null);
    this.returnFocus?.focus({preventScroll: true});
    this.returnFocus = null;
  }

  onInput(event: Event) {
    this.search.query.set((event.target as HTMLInputElement).value);
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.isComposing) return;
    if (this.showingHistory()) {
      const items = this.historyItems();
      if (event.key === 'ArrowDown' && items.length) items[0].focus();
      else if (event.key === 'ArrowUp' && items.length) items[items.length - 1].focus();
      else return;
      event.preventDefault();
      return;
    }
    const results = this.search.results();
    if (!results.length) return;
    const last = results.length - 1;
    const i = this.active();
    switch (event.key) {
      case 'ArrowDown':
        this.active.set(i >= last ? 0 : i + 1);
        break;
      case 'ArrowUp':
        this.active.set(i <= 0 ? last : i - 1);
        break;
      case 'Home':
        this.active.set(0);
        break;
      case 'End':
        this.active.set(last);
        break;
      case 'Enter':
        this.select(results[Math.max(i, 0)]);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  onDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.trapTab(event);
      return;
    }
    const target = event.target as HTMLElement;
    if (!target.hasAttribute('data-history-item')) return;
    const items = this.historyItems();
    const i = items.indexOf(target as HTMLButtonElement);
    let next: HTMLElement | undefined;
    if (event.key === 'ArrowDown') next = items[i + 1] ?? this.input()?.nativeElement;
    else if (event.key === 'ArrowUp') next = items[i - 1] ?? this.input()?.nativeElement;
    else if (event.key === 'Home') next = items[0];
    else if (event.key === 'End') next = items[items.length - 1];
    if (!next) return;
    event.preventDefault();
    next.focus();
  }

  select(hit: SearchHit) {
    this.search.recordVisit(hit);
    this.navigateTo(hit.url);
  }

  selectHistory(item: HistoryItem) {
    // Re-record so a re-visited recent moves to the top of the list.
    this.search.recordVisit({
      id: item.id,
      kind: 'page',
      url: item.url,
      labelHtml: item.labelHtml,
      subLabelHtml: item.subLabelHtml,
    });
    this.navigateTo(item.url);
  }

  toggleFavorite(url: string): void {
    this.search.toggleFavorite(url);
    this.focusInput();
  }

  clearRecents(): void {
    this.search.clearRecents();
    this.focusInput();
  }

  /** Drop a row and clear the hover highlight if it was on this URL.
   * Without this, a later row that happens to share the URL would render
   * pre-highlighted before the user moves the pointer over it. */
  removeAt(url: string): void {
    this.search.removeFromHistory(url);
    if (this.hoverUrl() === url) this.hoverUrl.set(null);
    this.focusInput();
  }

  private show(): void {
    if (!this.open() && typeof document !== 'undefined') {
      this.returnFocus = document.activeElement as HTMLElement | null;
    }
    this.open.set(true);
    this.focusInput();
  }

  private focusInput(): void {
    this.input()?.nativeElement.focus();
  }

  private historyItems(): HTMLButtonElement[] {
    const root = this.dialog()?.nativeElement;
    return root ? Array.from(root.querySelectorAll('button[data-history-item]')) : [];
  }

  private trapTab(event: KeyboardEvent): void {
    const root = this.dialog()?.nativeElement;
    if (!root) return;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>('input, button:not([disabled]), a[href]'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) return;
    const current = document.activeElement;
    if (event.shiftKey && (current === first || !root.contains(current))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || !root.contains(current))) {
      event.preventDefault();
      first.focus();
    }
  }

  private navigateTo(url: string): void {
    const [pathAndQuery, fragment] = url.split('#');
    const samePath = this.router.url.split('#')[0] === pathAndQuery;
    this.close();
    this.router.navigateByUrl(url).then(() => {
      if (fragment) this.scrollToWhenReady(fragment);
      else if (samePath) this.scroller.scrollToPosition([0, 0], {behavior: 'smooth'});
    });
  }

  private scrollToWhenReady(slug: string, attempt = 0): void {
    if (typeof document === 'undefined' || attempt > 30) return;
    if (!document.getElementById(slug)) {
      setTimeout(() => this.scrollToWhenReady(slug, attempt + 1), 50);
      return;
    }
    this.scroller.scrollToAnchor(slug, {behavior: 'smooth'});
  }
}
