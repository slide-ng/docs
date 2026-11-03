import {DOCUMENT} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {Title} from '@angular/platform-browser';
import {SeoService, jsonLd} from './seo.service';

const ROOT = 'https://slide-ng.dev';

describe('jsonLd', () => {
  it('describes the home page as the website', () => {
    expect(jsonLd('/', ROOT, 'x', 'd')).toMatchObject({'@type': 'WebSite', url: `${ROOT}/`});
  });

  it('gives a docs page an article and a breadcrumb trail of real pages', () => {
    const {'@graph': graph} = jsonLd('/guide/syntax', ROOT, 'x', 'd') as {
      '@graph': {'@type': string; headline?: string; itemListElement?: {item: string}[]}[];
    };
    const list = graph.find((n) => n['@type'] === 'BreadcrumbList');
    expect(list?.itemListElement?.map((i) => i.item)).toEqual([`${ROOT}/`, `${ROOT}/guide/syntax`]);
    expect(graph.find((n) => n['@type'] === 'TechArticle')?.headline).toBe('Syntax');
  });

  it('does not call a showcase an article', () => {
    const {'@graph': graph} = jsonLd('/resources/showcases/ship-it', ROOT, 'x', 'd') as {
      '@graph': {'@type': string; itemListElement?: unknown[]}[];
    };
    expect(graph.map((n) => n['@type'])).toEqual(['BreadcrumbList']);
    expect(graph[0].itemListElement).toHaveLength(3);
  });
});

describe('SeoService', () => {
  const head = () => TestBed.inject(DOCUMENT).head;

  it('writes the tags of a page and removes the page-only ones on a missing page', () => {
    TestBed.inject(Title).setTitle('Syntax | slide.ng');
    const seo = TestBed.inject(SeoService);

    seo.apply('/guide/syntax');
    expect(head().querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${ROOT}/guide/syntax`,
    );
    expect(head().querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'How a slides.md file is read, slide by slide.',
    );
    expect(head().querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Syntax | slide.ng',
    );
    expect(head().querySelector('script[type="application/ld+json"]')).not.toBeNull();

    seo.apply('/zz-nowhere');
    expect(head().querySelector('link[rel="canonical"]')).toBeNull();
    expect(head().querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
