import {TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import showcases from '../data/showcases.json';
import {NgmdShowcaseGrid, filterShowcases, sharedTags, type Showcase} from './showcase-grid';

const decks: Showcase[] = [
  {slug: 'a', title: 'Alpha', theme: 'moss', blurb: 'About signals.', tags: ['angular', 'signals']},
  {slug: 'b', title: 'Beta', theme: 'paper', blurb: 'About forms.', tags: ['angular', 'forms']},
  {slug: 'c', title: 'Gamma', theme: 'paper', blurb: 'Math with KaTeX.', tags: ['math']},
];

describe('showcase filters', () => {
  it('lists the tags that more than one deck has, most used first', () => {
    expect(sharedTags(decks)).toEqual([{tag: 'angular', count: 2}]);
    expect(sharedTags(decks, 1).map((t) => t.tag)).toEqual(['angular', 'forms', 'math', 'signals']);
  });

  it('filters by tag and by every word of the search', () => {
    expect(filterShowcases(decks, null, '').map((d) => d.slug)).toEqual(['a', 'b', 'c']);
    expect(filterShowcases(decks, 'angular', '').map((d) => d.slug)).toEqual(['a', 'b']);
    expect(filterShowcases(decks, 'angular', 'forms').map((d) => d.slug)).toEqual(['b']);
    expect(filterShowcases(decks, null, 'PAPER katex').map((d) => d.slug)).toEqual(['c']);
    expect(filterShowcases(decks, 'math', 'signals')).toEqual([]);
  });
});

describe('NgmdShowcaseGrid', () => {
  beforeEach(() => TestBed.configureTestingModule({providers: [provideRouter([])]}));

  async function render() {
    const fixture = TestBed.createComponent(NgmdShowcaseGrid);
    await fixture.whenStable();
    return fixture;
  }

  it('shows a card for every deck, linked to its page', async () => {
    const el: HTMLElement = (await render()).nativeElement;
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('ul a'));
    expect(links).toHaveLength(showcases.length);
    expect(links[0].getAttribute('href')).toBe(`/resources/showcases/${showcases[0].slug}`);
    expect(links[0].textContent).toContain(showcases[0].title);
    expect(links[0].textContent).toContain(showcases[0].theme);
    expect(links[0].textContent).toContain(showcases[0].blurb);
  });

  it('narrows the cards with a tag chip and with the search box', async () => {
    const fixture = await render();
    const el: HTMLElement = fixture.nativeElement;
    const chip = Array.from(el.querySelectorAll<HTMLButtonElement>('[role="group"] button')).find(
      (b) => b.textContent?.trim().startsWith('mermaid'),
    )!;
    chip.click();
    await fixture.whenStable();
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    const expected = showcases.filter((d) => d.tags.includes('mermaid')).length;
    expect(el.querySelectorAll('ul a')).toHaveLength(expected);

    chip.click();
    await fixture.whenStable();
    expect(el.querySelectorAll('ul a')).toHaveLength(showcases.length);

    const input = el.querySelector<HTMLInputElement>('input[type="search"]')!;
    input.value = 'zzzz-no-such-deck';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(el.querySelectorAll('ul a')).toHaveLength(0);
    expect(el.textContent).toContain('No deck matches');
  });
});
