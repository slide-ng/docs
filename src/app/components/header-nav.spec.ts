import {signal} from '@angular/core';
import {TestBed, type ComponentFixture} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import config, {type NavItem} from '../../ngmd.config';
import {RouteUrlService} from '../services/route-url/route-url.service';
import {HeaderNav, isInside} from './header-nav';

const items: NavItem[] = [
  {label: 'Docs', href: '/welcome'},
  {
    label: 'Resources',
    href: '/resources/showcases',
    children: [
      {label: 'Showcases', href: '/resources/showcases'},
      {label: 'Theme Gallery', href: '/customize/theme-gallery'},
      {label: 'Release Notes', href: 'https://example.com/CHANGELOG.md'},
    ],
  },
];

const url = signal('/welcome');

async function create(layout: 'bar' | 'list' = 'bar'): Promise<ComponentFixture<HeaderNav>> {
  const fixture = TestBed.createComponent(HeaderNav);
  fixture.componentRef.setInput('items', items);
  fixture.componentRef.setInput('layout', layout);
  document.body.appendChild(fixture.nativeElement);
  await fixture.whenStable();
  return fixture;
}

const trigger = (el: HTMLElement) => el.querySelector<HTMLButtonElement>('button[aria-expanded]')!;
const menuItems = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]'));
const key = (target: Element, name: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', {key: name, bubbles: true, cancelable: true}));

describe('HeaderNav', () => {
  beforeEach(() => {
    url.set('/welcome');
    TestBed.configureTestingModule({
      providers: [provideRouter([]), {provide: RouteUrlService, useValue: {cleanUrl: url}}],
    });
  });

  afterEach(() => document.body.replaceChildren());

  it('keeps flat items as links and gives a group a menu button', async () => {
    const el: HTMLElement = (await create()).nativeElement;
    expect(el.querySelector('a[href="/welcome"]')).not.toBeNull();
    const button = trigger(el);
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('[role="menu"]')).toBeNull();
  });

  it('opens on click and toggles closed on a second click', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).click();
    await fixture.whenStable();
    expect(trigger(el).getAttribute('aria-expanded')).toBe('true');
    expect(menuItems(el).map((a) => a.textContent?.trim())).toEqual([
      'Showcases',
      'Theme Gallery',
      'Release Notes (opens in a new tab)',
    ]);
    expect(trigger(el).getAttribute('aria-controls')).toBe(el.querySelector('[role="menu"]')!.id);
    trigger(el).click();
    await fixture.whenStable();
    expect(el.querySelector('[role="menu"]')).toBeNull();
  });

  it('opens on mouse hover, closes after leaving, and ignores touch', async () => {
    {
      const fixture = await create();
      const el: HTMLElement = fixture.nativeElement;
      const wrapper = trigger(el).parentElement!;
      const pointer = (type: string, pointerType: string) => {
        const event = new Event(type, {bubbles: false});
        Object.defineProperty(event, 'pointerType', {value: pointerType});
        wrapper.dispatchEvent(event);
      };
      pointer('pointerenter', 'touch');
      await fixture.whenStable();
      expect(el.querySelector('[role="menu"]')).toBeNull();

      pointer('pointerenter', 'mouse');
      await fixture.whenStable();
      expect(el.querySelector('[role="menu"]')).not.toBeNull();

      pointer('pointerleave', 'mouse');
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fixture.whenStable();
      expect(el.querySelector('[role="menu"]')).toBeNull();
    }
  });

  it('keeps a menu that was clicked open when the mouse leaves', async () => {
    {
      const fixture = await create();
      const el: HTMLElement = fixture.nativeElement;
      trigger(el).click();
      await fixture.whenStable();
      const leave = new Event('pointerleave');
      Object.defineProperty(leave, 'pointerType', {value: 'mouse'});
      trigger(el).parentElement!.dispatchEvent(leave);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fixture.whenStable();
      expect(el.querySelector('[role="menu"]')).not.toBeNull();
    }
  });

  it('moves with the arrow keys, Home and End, and wraps around', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).focus();
    key(trigger(el), 'ArrowDown');
    await fixture.whenStable();
    const entries = menuItems(el);
    expect(document.activeElement).toBe(entries[0]);
    key(entries[0], 'ArrowDown');
    expect(document.activeElement).toBe(entries[1]);
    key(entries[1], 'End');
    expect(document.activeElement).toBe(entries[2]);
    key(entries[2], 'ArrowDown');
    expect(document.activeElement).toBe(entries[0]);
    key(entries[0], 'ArrowUp');
    expect(document.activeElement).toBe(entries[2]);
    key(entries[2], 'Home');
    expect(document.activeElement).toBe(entries[0]);
  });

  it('opens on the last entry with ArrowUp', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).focus();
    key(trigger(el), 'ArrowUp');
    await fixture.whenStable();
    expect(document.activeElement).toBe(menuItems(el)[2]);
  });

  it('closes on Escape and returns focus to the button', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).click();
    await fixture.whenStable();
    menuItems(el)[1].focus();
    document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    await fixture.whenStable();
    expect(el.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger(el));
  });

  it('closes on a click outside and when focus leaves', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).click();
    await fixture.whenStable();
    document.body.click();
    await fixture.whenStable();
    expect(el.querySelector('[role="menu"]')).toBeNull();

    trigger(el).click();
    await fixture.whenStable();
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    menuItems(el)[0].focus();
    outside.focus();
    await fixture.whenStable();
    expect(el.querySelector('[role="menu"]')).toBeNull();
  });

  it('opens an external entry in a new tab, with a hidden note for screen readers', async () => {
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    trigger(el).click();
    await fixture.whenStable();
    const external = el.querySelector<HTMLAnchorElement>(
      'a[href="https://example.com/CHANGELOG.md"]',
    )!;
    expect(external.target).toBe('_blank');
    expect(external.rel).toContain('noopener');
    expect(external.querySelector('svg')).not.toBeNull();
    expect(external.querySelector('.sr-only')?.textContent).toContain('new tab');
  });

  it('marks the entry whose route the page is in, and its button', async () => {
    url.set('/resources/showcases/ship-it');
    const fixture = await create();
    const el: HTMLElement = fixture.nativeElement;
    expect(trigger(el).className).toContain('--accent-strong');
    trigger(el).click();
    await fixture.whenStable();
    const current = menuItems(el).filter((a) => a.getAttribute('aria-current') === 'page');
    expect(current.map((a) => a.textContent?.trim())).toEqual(['Showcases']);

    url.set('/customize/theme-gallery');
    await fixture.whenStable();
    expect(
      menuItems(el)
        .filter((a) => a.getAttribute('aria-current') === 'page')
        .map((a) => a.textContent?.trim()),
    ).toEqual(['Theme Gallery']);

    url.set('/guide/syntax');
    await fixture.whenStable();
    expect(trigger(el).className).not.toContain('--accent-strong');
  });

  it('lists the children as an indented group in the drawer, with no button', async () => {
    const fixture = await create('list');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('button')).toBeNull();
    const group = el.querySelector('ul')!;
    expect(group.className).toContain('ml-');
    expect(Array.from(group.querySelectorAll('a')).map((a) => a.textContent?.trim())).toEqual([
      'Showcases',
      'Theme Gallery',
      'Release Notes (opens in a new tab)',
    ]);
  });
});

describe('isInside', () => {
  it('matches the page and the pages below it, not look-alikes or external links', () => {
    expect(isInside('/resources/showcases', '/resources/showcases')).toBe(true);
    expect(isInside('/resources/showcases/x', '/resources/showcases')).toBe(true);
    expect(isInside('/resources/showcases-old', '/resources/showcases')).toBe(false);
    expect(isInside('/anything', 'https://example.com/anything')).toBe(false);
  });
});

describe('site config', () => {
  it('has a Resources dropdown with five entries and the matching sidebar section', () => {
    const group = config.headerNav!.find((i) => i.label === 'Resources')!;
    expect(group.children!.map((c) => c.label)).toEqual([
      'Showcases',
      'Theme Gallery',
      'Starter',
      'Live Demos',
      'Release Notes',
    ]);
    const section = config.nav.find((s) => s.label === 'Resources')!;
    expect(section.items.map((i) => i.href)).toEqual(
      group.children!.filter((c) => c.href.startsWith('/')).map((c) => c.href),
    );
  });
});
