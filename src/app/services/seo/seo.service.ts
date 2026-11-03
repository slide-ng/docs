import {DOCUMENT, Injectable, inject} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {pageMeta} from 'virtual:ngmd/page-meta';
import {appBase, publicUrl} from '../../../base';
import siteConfig from '../../../ngmd.config';
import {crumbsFor} from '../../components/breadcrumb';

const LD_ID = 'ngmd-ld';

/**
 * Writes what crawlers read from the head of a page: the description, the
 * canonical URL, the Open Graph and Twitter tags and the JSON-LD. Runs on every
 * navigation, so the prerendered HTML has them and client navigation keeps them
 * right. A path without a page (the 404) gets no canonical URL and no JSON-LD.
 */
@Injectable({providedIn: 'root'})
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly root = publicUrl(siteConfig.site.url, appBase());

  apply(path: string): void {
    const page = pageMeta[path];
    const title = this.title.getTitle();
    const description = page?.description ?? siteConfig.site.description;
    const url = `${this.root}${encodeURI(path)}`;
    const home = path === '/';

    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.meta.updateTag({name: 'twitter:description', content: description});
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({property: 'og:type', content: page && !home ? 'article' : 'website'});
    this.meta.updateTag({property: 'og:url', content: page ? url : `${this.root}/`});

    this.setCanonical(page ? url : null);
    this.setJsonLd(page ? jsonLd(path, this.root, title, description) : null);
  }

  private setCanonical(url: string | null): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: object | null): void {
    let script = this.document.getElementById(LD_ID);
    if (!data) {
      script?.remove();
      return;
    }
    if (!script) {
      script = this.document.createElement('script');
      script.id = LD_ID;
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    // `<` cannot close the script block once it is escaped.
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
  }
}

/** The structured data of a page. Docs pages are articles; `/resources` lists decks and is not. */
export function jsonLd(path: string, root: string, title: string, description: string): object {
  const {name} = siteConfig.site;
  const website = {'@type': 'WebSite', name, url: `${root}/`};
  if (path === '/') return {'@context': 'https://schema.org', ...website, description};

  const page = pageMeta[path];
  const crumbs = crumbsFor(path).filter((crumb) => crumb.isPage);
  const trail = [{label: 'Home', href: '/'}, ...crumbs];
  const graph: object[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: trail.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.label,
        item: `${root}${encodeURI(crumb.href)}`,
      })),
    },
  ];
  if (!path.startsWith('/resources/')) {
    graph.push({
      '@type': 'TechArticle',
      headline: page?.title ?? title,
      description,
      url: `${root}${encodeURI(path)}`,
      image: `${root}/og.png`,
      dateModified: page?.lastUpdated && `${page.lastUpdated}T00:00:00Z`,
      inLanguage: 'en',
      isPartOf: website,
    });
  }
  return {'@context': 'https://schema.org', '@graph': graph};
}
