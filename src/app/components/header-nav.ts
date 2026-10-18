import {
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  afterNextRender,
  inject,
  input,
  signal,
} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LucideArrowUpRight, LucideChevronDown, LucideDynamicIcon} from '@lucide/angular';
import type {NavItem} from '../../ngmd.config';
import {RouteUrlService} from '../services/route-url/route-url.service';

/** True for a link that leaves this site. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** True when `url` is `href` itself or a page below it. External links never match. */
export function isInside(url: string, href: string): boolean {
  if (isExternalHref(href)) return false;
  return url === href || url.startsWith(href.replace(/\/$/, '') + '/');
}

const HOVER_CLOSE_DELAY = 150;

/**
 * Header links. A plain item is a link; an item with `children` is a dropdown.
 *
 * `layout="bar"` is the desktop row: the dropdown opens on click, on hover with a mouse, and with
 * the arrow keys; Home and End jump to the first and last entry; Escape closes it and returns
 * focus to the button; a click outside closes it. `layout="list"` is the mobile drawer: the
 * children are an indented group, always visible.
 */
@Component({
  selector: 'app-header-nav',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
    '(focusout)': 'onFocusOut($event)',
  },
  imports: [RouterLink, LucideDynamicIcon],
  template: `
    @if (layout() === 'bar') {
      <nav aria-label="Main" class="hidden sm:flex items-center gap-1 text-sm">
        @for (item of items(); track item.label) {
          @if (item.children?.length) {
            <div
              class="relative"
              (pointerenter)="onPointerEnter($event, item)"
              (pointerleave)="onPointerLeave($event, item)"
            >
              <button
                type="button"
                [attr.data-nav-trigger]="item.label"
                [attr.aria-expanded]="openLabel() === item.label"
                aria-haspopup="menu"
                [attr.aria-controls]="menuId(item)"
                (click)="onTriggerClick($event, item)"
                (keydown)="onTriggerKey($event, item)"
                class="inline-flex items-center gap-1 rounded px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                [class]="
                  isGroupActive(item)
                    ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]'
                    : ''
                "
              >
                {{ item.label }}
                <svg
                  [lucideIcon]="chevronIcon"
                  class="size-3.5 opacity-60 transition-transform"
                  [class.rotate-180]="openLabel() === item.label"
                  aria-hidden="true"
                ></svg>
              </button>
              @if (openLabel() === item.label) {
                <div class="absolute left-0 top-full z-40 pt-1.5">
                  <ul
                    role="menu"
                    [id]="menuId(item)"
                    [attr.aria-label]="item.label"
                    (keydown)="onMenuKey($event, item)"
                    class="min-w-52 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-1 shadow-lg"
                  >
                    @for (child of item.children; track child.href) {
                      <li role="none">
                        @if (isExternal(child.href)) {
                          <a
                            role="menuitem"
                            tabindex="-1"
                            [href]="child.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            (click)="closeMenu()"
                            class="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                          >
                            {{ child.label }}
                            <svg
                              [lucideIcon]="externalIcon"
                              class="size-3.5 text-zinc-400"
                              aria-hidden="true"
                            ></svg>
                            <span class="sr-only">(opens in a new tab)</span>
                          </a>
                        } @else {
                          <a
                            role="menuitem"
                            tabindex="-1"
                            [routerLink]="child.href"
                            (click)="closeMenu()"
                            class="flex items-center justify-between gap-3 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            [class]="
                              isActive(child)
                                ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] font-medium'
                                : ''
                            "
                            [attr.aria-current]="isActive(child) ? 'page' : null"
                          >
                            {{ child.label }}
                          </a>
                        }
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>
          } @else if (isExternal(item.href)) {
            <a
              [href]="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {{ item.label }}
            </a>
          } @else {
            <a
              [routerLink]="item.href"
              class="rounded px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {{ item.label }}
            </a>
          }
        }
      </nav>
    } @else {
      <nav aria-label="Main" class="flex flex-col gap-1 text-sm">
        @for (item of items(); track item.label) {
          @if (item.children?.length) {
            <p class="px-3 pt-1.5 font-bold text-zinc-900 dark:text-zinc-100">{{ item.label }}</p>
            <ul class="ml-4 flex flex-col gap-1 border-l border-zinc-200 dark:border-zinc-800 pl-2">
              @for (child of item.children; track child.href) {
                <li>
                  @if (isExternal(child.href)) {
                    <a
                      [href]="child.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-zinc-700 dark:text-brand-muted-dark hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent-strong)]"
                    >
                      {{ child.label }}
                      <svg
                        [lucideIcon]="externalIcon"
                        class="size-3.5 text-zinc-400"
                        aria-hidden="true"
                      ></svg>
                      <span class="sr-only">(opens in a new tab)</span>
                    </a>
                  } @else {
                    <a
                      [routerLink]="child.href"
                      class="flex items-center rounded-md px-3 py-1.5 text-zinc-700 dark:text-brand-muted-dark hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent-strong)]"
                      [class]="
                        isActive(child)
                          ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] font-medium'
                          : ''
                      "
                      [attr.aria-current]="isActive(child) ? 'page' : null"
                    >
                      {{ child.label }}
                    </a>
                  }
                </li>
              }
            </ul>
          } @else if (isExternal(item.href)) {
            <a
              [href]="item.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-md px-3 py-1.5 font-bold text-zinc-900 dark:text-zinc-100 hover:bg-[color:var(--accent-soft)]"
            >
              {{ item.label }}
            </a>
          } @else {
            <a
              [routerLink]="item.href"
              class="rounded-md px-3 py-1.5 font-bold text-zinc-900 dark:text-zinc-100 hover:bg-[color:var(--accent-soft)]"
            >
              {{ item.label }}
            </a>
          }
        }
      </nav>
    }
  `,
})
export class HeaderNav implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly url = inject(RouteUrlService).cleanUrl;
  private hoverTimer: ReturnType<typeof setTimeout> | undefined;

  readonly items = input.required<readonly NavItem[]>();
  readonly layout = input<'bar' | 'list'>('bar');

  readonly chevronIcon = LucideChevronDown;
  readonly externalIcon = LucideArrowUpRight;

  /** Label of the open dropdown, or null. */
  readonly openLabel = signal<string | null>(null);
  /** True once the dropdown was opened by a click, so moving the mouse away keeps it open. */
  private readonly pinned = signal(false);

  isExternal = isExternalHref;

  menuId(item: NavItem): string {
    return 'ngmd-nav-' + item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  isActive(item: NavItem): boolean {
    return isInside(this.url(), item.href);
  }

  isGroupActive(item: NavItem): boolean {
    return (item.children ?? []).some((child) => this.isActive(child));
  }

  closeMenu(): void {
    this.clearTimer();
    this.openLabel.set(null);
    this.pinned.set(false);
  }

  onPointerEnter(event: Event, item: NavItem): void {
    if ((event as PointerEvent).pointerType !== 'mouse') return;
    this.clearTimer();
    if (this.openLabel() !== item.label) {
      this.openLabel.set(item.label);
      this.pinned.set(false);
    }
  }

  onPointerLeave(event: Event, item: NavItem): void {
    if ((event as PointerEvent).pointerType !== 'mouse') return;
    if (this.openLabel() !== item.label || this.pinned()) return;
    this.clearTimer();
    this.hoverTimer = setTimeout(() => this.closeMenu(), HOVER_CLOSE_DELAY);
  }

  onTriggerClick(event: MouseEvent, item: NavItem): void {
    this.clearTimer();
    if (this.openLabel() === item.label && this.pinned()) {
      this.closeMenu();
      return;
    }
    this.openLabel.set(item.label);
    this.pinned.set(true);
    // A click made with the keyboard (Enter or Space) has no pointer: move into the menu.
    if (event.detail === 0) this.focusItem(item, 0);
  }

  onTriggerKey(event: KeyboardEvent, item: NavItem): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    this.clearTimer();
    this.openLabel.set(item.label);
    this.pinned.set(true);
    this.focusItem(item, event.key === 'ArrowDown' ? 0 : -1);
  }

  onMenuKey(event: KeyboardEvent, item: NavItem): void {
    const entries = this.menuItems(item);
    if (entries.length === 0) return;
    const index = entries.indexOf(document.activeElement as HTMLElement);
    let next: number;
    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % entries.length;
        break;
      case 'ArrowUp':
        next = (index - 1 + entries.length) % entries.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = entries.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    entries[next].focus();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.openLabel() === null) return;
    if (!this.host.nativeElement.contains(event.target as Node)) this.closeMenu();
  }

  protected onFocusOut(event: FocusEvent): void {
    if (this.openLabel() === null) return;
    const next = event.relatedTarget as Node | null;
    if (next && !this.host.nativeElement.contains(next)) this.closeMenu();
  }

  protected onEscape(): void {
    const label = this.openLabel();
    if (label === null) return;
    const hadFocus = this.host.nativeElement.contains(document.activeElement);
    this.closeMenu();
    if (hadFocus) this.trigger(label)?.focus();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.hoverTimer !== undefined) clearTimeout(this.hoverTimer);
    this.hoverTimer = undefined;
  }

  private trigger(label: string): HTMLElement | null {
    return this.host.nativeElement.querySelector(`[data-nav-trigger="${CSS.escape(label)}"]`);
  }

  private menuItems(item: NavItem): HTMLElement[] {
    const menu = this.host.nativeElement.querySelector(`#${CSS.escape(this.menuId(item))}`);
    return menu ? Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
  }

  private focusItem(item: NavItem, index: number): void {
    afterNextRender(
      () => {
        const entries = this.menuItems(item);
        (index < 0 ? entries[entries.length - 1] : entries[index])?.focus();
      },
      {injector: this.injector},
    );
  }
}
