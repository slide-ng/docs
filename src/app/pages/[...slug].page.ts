import {AsyncPipe} from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  computed,
  effect,
  inject,
  resource,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Title} from '@angular/platform-browser';
import {Router, RouterLink} from '@angular/router';
import {injectContent, MarkdownComponent} from '@analogjs/content';
import {LucideDynamicIcon, LucideArrowRight, LucideSearch} from '@lucide/angular';
import {LayoutMode} from '../layout-mode.service';
import {SearchService} from '../services/search/search.service';
import {RouteUrlService} from '../services/route-url/route-url.service';
import siteConfig from '../../ngmd.config';

/**
 * Catch-all route for every markdown page.
 *
 * Mirrors the adev pattern: one shared component renders every prose route.
 * `injectContent()` reads the `slug` route param (which the `[...slug]`
 * convention populates with the full nested path) and looks up the matching
 * `src/content/<slug>.md`. Pages that need bespoke layouts (the landing
 * page, the components gallery) keep their named `.page.ts` and Angular's
 * router prefers the more specific match.
 *
 * NgmdUi components render via `@angular/elements`-registered Custom
 * Elements (see `register-elements.ts`). That bypasses Angular's component
 * compiler (which doesn't walk `[innerHTML]`) and lets the browser upgrade
 * `<ngmd-callout>` etc. tags inside the markdown body directly. The schema
 * below tells the template parser to tolerate the unknown selectors so we
 * don't have to maintain a duplicate `NgmdUi` imports array.
 *
 * Doubles as the 404 page: when no markdown matches the requested URL,
 * `injectContent` returns the sentinel below as the body, the docs chrome
 * is hidden, and the 404 UI is rendered with a "Search the docs" CTA that
 * opens the Cmd+K palette pre-filled with a term inferred from the URL.
 */

const NOT_FOUND = '__ngmd-not-found__';

@Component({
  selector: 'app-doc',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [AsyncPipe, MarkdownComponent, RouterLink, LucideDynamicIcon],
  templateUrl: './[...slug].page.html',
})
export default class DocPage implements OnDestroy {
  private readonly layout = inject(LayoutMode);
  private readonly router = inject(Router);
  private readonly search = inject(SearchService);
  private readonly route = inject(RouteUrlService);
  private readonly title = inject(Title);
  private readonly cleanUrl = this.route.cleanUrl;
  protected readonly notFound = NOT_FOUND;

  readonly searchIcon = LucideSearch;
  readonly arrowIcon = LucideArrowRight;

  readonly content$ = injectContent<{title: string}>('slug', NOT_FOUND);
  private readonly doc = toSignal(this.content$);
  private readonly missing = computed(() => this.doc()?.content === NOT_FOUND);

  /** Alpha-only tokens from the failed URL's last segment, joined with
   * spaces. `/concepts/component32` → `component`, `/foo-bar` → `foo bar`,
   * `/123` → `` (palette opens empty, which is honest). */
  private readonly suggestionTerm = computed(() => {
    if (!this.missing()) return '';
    const segment = this.cleanUrl().split('/').filter(Boolean).pop() ?? '';
    return (segment.match(/[a-zA-Z]+/g) ?? []).join(' ').toLowerCase();
  });

  /** One-shot search keyed on the inferred term. Bypasses the palette's
   * reactive resource so this lookup doesn't leak into the user's normal
   * search session. */
  private readonly suggestionsResource = resource({
    params: () => this.suggestionTerm() || undefined,
    loader: async ({params}) => (params ? this.search.searchOnce(params) : []),
  });

  /** Single best guess for the failed URL, or `null` when Orama has
   * nothing remotely matching. Better to show no card than a bad one. */
  protected readonly suggestion = computed(() => this.suggestionsResource.value()?.[0] ?? null);

  constructor() {
    effect(() => {
      const missing = this.doc()?.content === NOT_FOUND;
      this.layout.chromeHidden.set(missing);
      if (missing) this.title.setTitle(`Page not found | ${siteConfig.site.name}`);
    });
  }

  protected searchInPalette(): void {
    this.search.requestOpen(this.suggestionTerm());
  }

  /** Strip the search-provider `<mark>` highlights for plain-text display.
   * The 404 card doesn't render the highlight markup; the palette does. */
  protected stripMarkup(html: string): string {
    return html.replace(/<\/?[^>]+>/g, '');
  }

  /** Navigate to the suggestion. Hit URLs carry the fragment inline
   * (e.g. `/concepts/theming#accent-tokens`); RouterLink doesn't pick the
   * fragment out for us, so route via the Router. */
  protected gotoHit(hit: {
    id: string;
    url: string;
    kind: string;
    labelHtml: string;
    subLabelHtml: string;
  }): void {
    this.search.recordVisit({
      id: hit.id,
      kind: hit.kind as 'page' | 'section' | 'snippet',
      url: hit.url,
      labelHtml: hit.labelHtml,
      subLabelHtml: hit.subLabelHtml,
    });
    this.router.navigateByUrl(hit.url);
  }

  ngOnDestroy(): void {
    this.layout.chromeHidden.set(false);
  }
}
