import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {
  LucideDynamicIcon,
  LucideMenu,
  LucideMoon,
  LucideHeart,
  LucideSearch,
  LucideSun,
  LucideSunMoon,
  LucideX,
} from '@lucide/angular';
import {GithubIcon} from './ui/github-icon';
import {DiscordIcon} from './ui/discord-icon';
import {ThemeService} from './theme';
import {LayoutMode} from './layout-mode.service';
import {RouteUrlService} from './services/route-url/route-url.service';
import {onNavigation} from './utils/enhance-on-navigation';
import {fetchStars, formatStars, repoFromUrl, type StarStorage} from './utils/github-stars';
import siteConfig from '../ngmd.config';
import {CommandPalette} from './components/command-palette';
import {HeaderNav} from './components/header-nav';
import {Sidebar} from './components/sidebar';
import {Breadcrumb} from './components/breadcrumb';
import {Toc} from './components/toc';
import {CodeCopy} from './components/code-copy';
import {ExternalLinks} from './components/external-links';
import {HeadingAnchors} from './components/heading-anchors';
import {CodeGroup} from './components/code-group';
import {PageFooter} from './components/page-footer';
import {SourceActions} from './components/source-actions';
import {MediaEnhancer} from './components/media-enhancer';
import {SiteFooter} from './components/site-footer';
import {Toaster} from './components/toaster';
import {VersionSwitcher} from './components/version-switcher';
import {ContentBanners} from './components/content-banners';

@Component({
  selector: 'app-root',
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
  imports: [
    RouterLink,
    RouterOutlet,
    LucideDynamicIcon,
    GithubIcon,
    DiscordIcon,
    CommandPalette,
    HeaderNav,
    Sidebar,
    Breadcrumb,
    Toc,
    CodeCopy,
    ExternalLinks,
    HeadingAnchors,
    CodeGroup,
    MediaEnhancer,
    PageFooter,
    SourceActions,
    SiteFooter,
    Toaster,
    VersionSwitcher,
    ContentBanners,
  ],
  templateUrl: './app.html',
})
export class App implements OnInit {
  readonly theme = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly layout = inject(LayoutMode);
  private readonly routeUrl = inject(RouteUrlService);
  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly drawer = viewChild<ElementRef<HTMLElement>>('drawer');

  readonly menuIcon = LucideMenu;
  readonly closeIcon = LucideX;
  readonly searchIcon = LucideSearch;
  readonly heartIcon = LucideHeart;
  readonly sunIcon = LucideSun;
  readonly moonIcon = LucideMoon;
  readonly autoIcon = LucideSunMoon;

  readonly siteName = siteConfig.site.name;
  readonly githubUrl = siteConfig.site.githubUrl;
  readonly discordUrl = siteConfig.site.links?.discord;
  readonly sponsorUrl = siteConfig.site.links?.sponsor;
  readonly headerNav = siteConfig.headerNav ?? [];

  readonly drawerOpen = signal(false);
  readonly stars = signal('');

  private starStorage(): StarStorage {
    try {
      return window.localStorage;
    } catch {
      return {getItem: () => null, setItem: () => undefined};
    }
  }

  constructor() {
    effect(() =>
      this.document.documentElement.classList.toggle('max-lg:overflow-hidden', this.drawerOpen()),
    );
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (desktop.matches) this.drawerOpen.set(false);
    };
    const repo = repoFromUrl(this.githubUrl);
    if (repo) {
      void fetchStars(repo, this.starStorage()).then((count) =>
        this.stars.set(count === null ? '' : formatStars(count)),
      );
    }
    desktop.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => desktop.removeEventListener('change', onChange));
  }

  private readonly isDocsRoute = computed(() => {
    const url = this.routeUrl.cleanUrl();
    return url !== '/' && url !== '' && !this.layout.chromeHidden();
  });
  readonly showSidebar = this.isDocsRoute;
  readonly showBreadcrumb = this.isDocsRoute;
  readonly showToc = this.isDocsRoute;
  readonly showFooter = this.isDocsRoute;

  toggleDrawer(): void {
    if (this.drawerOpen()) {
      this.closeDrawer();
      return;
    }
    this.drawerOpen.set(true);
    afterNextRender(
      () => this.drawer()?.nativeElement.querySelector<HTMLElement>('a[href], button')?.focus(),
      {injector: this.injector},
    );
  }

  closeDrawer(): void {
    if (!this.drawerOpen()) return;
    this.drawerOpen.set(false);
    this.menuButton()?.nativeElement.focus();
  }

  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.drawerOpen()) return;
    if (event.key === 'Escape') {
      this.closeDrawer();
      return;
    }
    const menuButton = this.menuButton()?.nativeElement;
    const drawer = this.drawer()?.nativeElement;
    if (event.key !== 'Tab' || !menuButton || !drawer) return;
    const focusable = [
      menuButton,
      ...drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ];
    const index = focusable.indexOf(this.document.activeElement as HTMLElement);
    const step = event.shiftKey ? -1 : 1;
    const next = index === -1 ? (event.shiftKey ? focusable.length - 1 : 0) : index + step;
    event.preventDefault();
    focusable[(next + focusable.length) % focusable.length].focus();
  }

  ngOnInit(): void {
    this.theme.initFromStorage();
    onNavigation(this.router, this.destroyRef, () => {
      this.drawerOpen.set(false);
      if (typeof window === 'undefined' || window.location.hash) return;
      setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 0);
    });
  }
}
