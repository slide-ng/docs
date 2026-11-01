import {Component, computed, inject} from '@angular/core';
import {
  LucideDynamicIcon,
  LucideArchive,
  LucideExternalLink,
  LucideRocket,
  LucideTriangleAlert,
} from '@lucide/angular';
import {VersionService} from '../services/version/version.service';

/**
 * Banner rendered above every documentation route when THIS deployment
 * isn't the production current. Reads `versions.self` (the entry for
 * this deployment) and `versions.current` (the entry whose status is
 * `'current'`) and points visitors at the latter when they're stuck on
 * a `next` / `rc` / `deprecated` deployment.
 *
 * No DOM when versions config is absent, when self matches the current,
 * or when there's no current entry to link to. The banner is opt-out via
 * config: drop the registry and nothing renders.
 */
@Component({
  selector: 'app-content-banners',
  imports: [LucideDynamicIcon],
  templateUrl: './content-banners.html',
})
export class ContentBanners {
  private readonly versions = inject(VersionService);

  readonly externalIcon = LucideExternalLink;

  readonly banner = computed(() => {
    const self = this.versions.self();
    const current = this.versions.current();
    if (!self || !current) return null;
    if (self.status === 'current') return null;

    const currentUrl = current.url;
    const currentLabel = current.label;

    if (self.status === 'next') {
      return {
        title: "You're reading the next-release docs.",
        prefix: 'The current stable is',
        currentUrl,
        currentLabel,
        icon: LucideRocket,
        containerClass: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40',
        iconClass: 'text-amber-600',
        bodyClass: 'text-amber-700 dark:text-amber-300',
      };
    }
    if (self.status === 'rc') {
      return {
        title: "You're reading a release candidate.",
        prefix: 'The current stable is',
        currentUrl,
        currentLabel,
        icon: LucideTriangleAlert,
        containerClass: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40',
        iconClass: 'text-amber-600',
        bodyClass: 'text-amber-700 dark:text-amber-300',
      };
    }
    return {
      title: `This is ${self.label}, no longer the current release.`,
      prefix: 'The current stable is',
      currentUrl,
      currentLabel,
      icon: LucideArchive,
      containerClass: 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900',
      iconClass: 'text-brand-muted',
      bodyClass: 'text-brand-muted dark:text-brand-muted-dark',
    };
  });
}
