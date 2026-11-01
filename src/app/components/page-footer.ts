import {Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LucideDynamicIcon, LucideArrowLeft, LucideArrowRight} from '@lucide/angular';
import {navItems} from '../../ngmd.config';
import {RouteUrlService} from '../services/route-url/route-url.service';

const RELATED_MAX = 4;

/**
 * Bottom-of-page frame shown under every docs route: a "More in <section>"
 * grid of section siblings (capped at four, excluding the current page
 * and the prev/next pair below it), then the previous / next nav. The
 * "Edit on GitHub" link lives in `<app-source-actions>` at the top of
 * the article; the last-updated stamp is retired.
 */
@Component({
  selector: 'app-page-footer',
  imports: [RouterLink, LucideDynamicIcon],
  templateUrl: './page-footer.html',
})
export class PageFooter {
  private readonly cleanUrl = inject(RouteUrlService).cleanUrl;

  readonly prevIcon = LucideArrowLeft;
  readonly nextIcon = LucideArrowRight;

  private readonly index = computed(() => navItems.findIndex((n) => n.href === this.cleanUrl()));
  readonly prev = computed(() => {
    const i = this.index();
    return i > 0 ? navItems[i - 1] : null;
  });
  readonly next = computed(() => {
    const i = this.index();
    return i >= 0 && i < navItems.length - 1 ? navItems[i + 1] : null;
  });

  /** Name of the nav section the current page sits inside, or `null` if
   * the page isn't in `ngmd.config.ts > nav`. */
  readonly currentSection = computed(() => {
    const i = this.index();
    return i >= 0 ? navItems[i].section : null;
  });

  /** Up to `RELATED_MAX` other pages in the same section, excluding the
   * current page and the prev / next pair (those already render below).
   * If the section has only the current + prev + next, the panel is
   * empty — better that than showing the same links twice. */
  readonly related = computed(() => {
    const section = this.currentSection();
    if (!section) return [];
    const current = this.cleanUrl();
    const prevHref = this.prev()?.href;
    const nextHref = this.next()?.href;
    return navItems
      .filter(
        (item) =>
          item.section === section &&
          item.href !== current &&
          item.href !== prevHref &&
          item.href !== nextHref,
      )
      .slice(0, RELATED_MAX);
  });
}
