import {Component, computed, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LucideDynamicIcon, LucideChevronRight, LucideHouse} from '@lucide/angular';
import {navItems} from '../../ngmd.config';
import {RouteUrlService} from '../services/route-url/route-url.service';

interface Crumb {
  label: string;
  href: string;
}

export function crumbLabel(href: string): string | null {
  const item = navItems.find((n) => n.href === href);
  if (item) return item.label;
  const sections = new Set(
    navItems.filter((n) => n.href.startsWith(href + '/')).map((n) => n.section),
  );
  return sections.size === 1 ? [...sections][0] : null;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, LucideDynamicIcon],
  templateUrl: './breadcrumb.html',
})
export class Breadcrumb {
  private readonly cleanUrl = inject(RouteUrlService).cleanUrl;
  readonly home = LucideHouse;
  readonly chevron = LucideChevronRight;

  readonly crumbs = computed<Crumb[]>(() => {
    const segments = this.cleanUrl()
      .split('/')
      .filter((s) => s.length > 0);
    return segments.map((segment, i) => {
      const href = '/' + segments.slice(0, i + 1).join('/');
      return {href, label: crumbLabel(href) ?? this.humanize(segment)};
    });
  });

  private humanize(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
