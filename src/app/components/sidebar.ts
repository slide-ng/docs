import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Injectable,
  Injector,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {LucideDynamicIcon, LucideChevronDown, LucideHeart} from '@lucide/angular';
import config from '../../ngmd.config';
import {BADGE_VARIANTS, type BadgeVariant} from '../../types/badge';
import {onNavigation} from '../utils/enhance-on-navigation';
import {RouteUrlService} from '../services/route-url/route-url.service';

@Injectable({providedIn: 'root'})
export class SidebarState {
  readonly openSections = signal<ReadonlySet<string>>(new Set(config.nav.map((s) => s.label)));

  toggle(label: string): void {
    this.openSections.update((set) => {
      const next = new Set(set);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  reveal(href: string): void {
    const section = config.nav.find((s) => s.items.some((i) => i.href === href));
    if (!section || this.openSections().has(section.label)) return;
    this.toggle(section.label);
  }
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './sidebar.html',
})
export class Sidebar implements AfterViewInit {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly state = inject(SidebarState);
  private readonly cleanUrl = inject(RouteUrlService).cleanUrl;

  readonly sections = config.nav;
  readonly chevron = LucideChevronDown;
  readonly heart = LucideHeart;
  readonly sponsorUrl = config.site.links?.sponsor;

  isOpen(label: string): boolean {
    return this.state.openSections().has(label);
  }

  toggle(label: string): void {
    this.state.toggle(label);
  }

  statusClass(status: BadgeVariant): string {
    return BADGE_VARIANTS[status];
  }

  ngAfterViewInit(): void {
    // Scroll the active row into view on initial mount and after every
    // navigation. Matters most on the mobile drawer (long sections push
    // the current page well below the fold) and on long Stack sections
    // in the desktop sidebar.
    this.scrollActiveIntoView();
    onNavigation(this.router, this.destroyRef, () => this.scrollActiveIntoView());
  }

  private scrollActiveIntoView(): void {
    if (typeof document === 'undefined') return;
    this.state.reveal(this.cleanUrl());
    afterNextRender(() => this.scrollToActive(), {injector: this.injector});
  }

  private scrollToActive(): void {
    const active = this.host.nativeElement.querySelector<HTMLElement>('a[aria-current="page"]');
    active?.scrollIntoView({block: 'nearest', behavior: 'instant'});
  }
}
