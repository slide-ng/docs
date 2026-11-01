import {Component, computed, inject} from '@angular/core';
import {LucideDynamicIcon, LucideCode, LucidePencil} from '@lucide/angular';
import {pageMeta} from 'virtual:ngmd/page-meta';
import {RouteUrlService} from '../services/route-url/route-url.service';

/**
 * Top-right floating icon row showing two GitHub links per route:
 *   - Edit (pencil) → opens the source `.md` / `.page.ts` in GitHub's editor
 *   - Source (`<>`) → opens the same file in GitHub's blob viewer
 *
 * Both URLs derive from the `editUrl` baked at build time by the page-meta
 * Vite plugin. The blob view is the edit URL with `/edit/` swapped for
 * `/blob/`, which is the canonical GitHub pattern.
 */
@Component({
  selector: 'app-source-actions',
  imports: [LucideDynamicIcon],
  templateUrl: './source-actions.html',
})
export class SourceActions {
  private readonly cleanUrl = inject(RouteUrlService).cleanUrl;

  readonly editIcon = LucidePencil;
  readonly sourceIcon = LucideCode;

  protected readonly editUrl = computed(() => pageMeta[this.cleanUrl()]?.editUrl ?? '');
  protected readonly sourceUrl = computed(() => this.editUrl().replace('/edit/', '/blob/'));
}
