import {Component, computed, inject, input} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {LucideDynamicIcon, LucideArrowRight, LucideArrowUpRight} from '@lucide/angular';

/**
 * Pill-shaped link. Internal hrefs route via `RouterLink`; external (http(s))
 * open in a new tab with `target="_blank"`. Hover lifts toward the
 * accent and reveals a trailing arrow (internal = right, external = up-right)
 * so the click affordance reads clearly. Without those cues the pill looks
 * like an inert badge.
 */
@Component({
  selector: 'ngmd-pill',
  imports: [RouterLink, LucideDynamicIcon],
  templateUrl: './pill.ngmd-pill.html',
})
export class NgmdPill {
  private readonly router = inject(Router);

  readonly href = input.required<string>();
  readonly title = input.required<string>();

  readonly isExternal = computed(() => /^(https?|mailto|tel):/.test(this.href()));
  protected readonly route = computed(() => this.router.parseUrl(this.href()));

  protected readonly internalIcon = LucideArrowRight;
  protected readonly externalIcon = LucideArrowUpRight;
}

@Component({
  selector: 'ngmd-pill-row',
  templateUrl: './pill.ngmd-pill-row.html',
})
export class NgmdPillRow {}
