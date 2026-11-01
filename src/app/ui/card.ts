import {Component, computed, inject, input} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {
  LucideDynamicIcon,
  type LucideIcon,
  LucideBook,
  LucideBox,
  LucideCodeXml,
  LucideCompass,
  LucideFileText,
  LucideLayers,
  LucideLightbulb,
  LucidePalette,
  LucideRocket,
  LucideSearch,
  LucideSettings,
  LucideShield,
  LucideSparkles,
  LucideTerminal,
  LucideWrench,
  LucideZap,
} from '@lucide/angular';

/**
 * Curated icon set, keyed by short name. Author passes one via the `icon`
 * attribute on `<ngmd-card icon="book" .../>` and that name is looked up
 * here. Names are short and topical; the set is intentionally small so the
 * authoring surface stays memorable and the bundle stays light. Unknown
 * names render no icon, with no error.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  book: LucideBook,
  box: LucideBox,
  code: LucideCodeXml,
  compass: LucideCompass,
  file: LucideFileText,
  layers: LucideLayers,
  lightbulb: LucideLightbulb,
  palette: LucidePalette,
  rocket: LucideRocket,
  search: LucideSearch,
  settings: LucideSettings,
  shield: LucideShield,
  sparkles: LucideSparkles,
  terminal: LucideTerminal,
  wrench: LucideWrench,
  zap: LucideZap,
};

@Component({
  selector: 'ngmd-card',
  imports: [NgTemplateOutlet, RouterLink, LucideDynamicIcon],
  host: {
    // `display: block` so the host occupies its grid cell properly. `h-full`
    // so when laid out inside `<ngmd-card-grid>` (which uses
    // `align-items: stretch` from CSS Grid) the inner bordered div can
    // grow to match the tallest sibling card via the `h-full` on it below.
    class: 'block h-full my-4',
  },
  templateUrl: './card.html',
})
export class NgmdCard {
  private readonly router = inject(Router);
  readonly title = input<string>('');
  readonly link = input<string>('');
  readonly cta = input<string>('');

  // External = anything with a scheme (http, https, mailto, tel). RouterLink
  // would interpret these as relative routes and fail to navigate.
  readonly isExternal = computed(() => /^(https?|mailto|tel):/.test(this.link()));
  protected readonly route = computed(() => this.router.parseUrl(this.link()));
  readonly icon = input<string>('');
  /**
   * Optional image URL (brand logo etc.). Takes priority over `icon` when
   * both are set. Useful for technology cards where the real brand SVG
   * matters more than a generic Lucide glyph.
   */
  readonly image = input<string>('');
  readonly avatar = input(false, {
    transform: (v: boolean | string) => v === '' || v === true || v === 'true',
  });

  protected readonly iconImg = computed(() => ICON_MAP[this.icon()] ?? null);
}
