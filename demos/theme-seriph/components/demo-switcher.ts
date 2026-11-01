import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RENDER_CONTEXT, SLIDE_NO } from 'slide-ng/lib/slide-context';
import { THEMES, demoUrl, detectSite } from './demo-switcher-urls';

@Component({
  selector: 'demo-switcher',
  templateUrl: './demo-switcher.html',
  styles: `
    :host {
      --ds-bg: #ffffff;
      --ds-fg: #1f2328;
      --ds-border: #6e7781;
      --ds-hover: #e6e8eb;
      --ds-ring: #0b69da;
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 50;
      pointer-events: auto;
      font:
        600 12px/1 system-ui,
        sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      :host {
        --ds-bg: #1f2328;
        --ds-fg: #f0f3f6;
        --ds-border: #9198a1;
        --ds-hover: #373e47;
        --ds-ring: #58a6ff;
      }
    }
    @media print {
      :host {
        display: none;
      }
    }
    .demo-switcher-pill,
    .demo-switcher-item {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      border: 1px solid var(--ds-border);
      background: var(--ds-bg);
      color: var(--ds-fg);
      font: inherit;
      cursor: pointer;
    }
    .demo-switcher-pill {
      height: 24px;
      padding: 0 8px 0 10px;
      border-radius: 12px;
    }
    .demo-switcher-pill svg {
      width: 10px;
      height: 10px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .demo-switcher-menu {
      display: flex;
      flex-direction: column;
      margin-top: 4px;
      min-width: 120px;
      padding: 3px;
      border: 1px solid var(--ds-border);
      border-radius: 6px;
      background: var(--ds-bg);
    }
    .demo-switcher-item {
      width: 100%;
      padding: 6px 8px;
      border: 0;
      border-radius: 4px;
      text-align: left;
    }
    .demo-switcher-item[aria-current='true'] {
      text-decoration: underline;
    }
    .demo-switcher-pill:hover,
    .demo-switcher-item:hover {
      background: var(--ds-hover);
    }
    .demo-switcher-pill:focus-visible,
    .demo-switcher-item:focus-visible {
      outline: 2px solid var(--ds-ring);
      outline-offset: 2px;
    }
  `,
})
export class DemoSwitcher {
  protected themes = THEMES;
  protected site = detectSite(location.pathname);
  protected shown = inject(RENDER_CONTEXT) === 'slide';
  protected open = signal(false);
  private slideNo = inject(SLIDE_NO);
  private host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  // Keys and clicks stay here: the deck would turn them into slide changes.
  @HostListener('keydown', ['$event'])
  @HostListener('click', ['$event'])
  @HostListener('pointerdown', ['$event'])
  protected keep(e: Event) {
    e.stopPropagation();
  }

  @HostListener('document:pointerdown', ['$event'])
  protected outside(e: Event) {
    if (this.open() && !this.host.contains(e.target as Node)) this.open.set(false);
  }

  protected toggle() {
    if (this.open()) this.close(false);
    else this.show(0);
  }

  protected onButtonKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open()) {
      e.preventDefault();
      this.close(true);
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.show(e.key === 'ArrowUp' ? -1 : 0);
    }
  }

  protected onMenuKey(e: KeyboardEvent) {
    const items = this.items();
    const at = items.indexOf(document.activeElement as HTMLElement);
    const move = (i: number) => {
      e.preventDefault();
      items[(i + items.length) % items.length]?.focus();
    };
    if (e.key === 'ArrowDown') move(at + 1);
    else if (e.key === 'ArrowUp') move(at - 1);
    else if (e.key === 'Home') move(0);
    else if (e.key === 'End') move(-1);
    else if (e.key === 'Escape') {
      e.preventDefault();
      this.close(true);
    } else if (e.key === 'Tab') this.open.set(false);
  }

  protected choose(name: string) {
    if (!this.site) return;
    window.location.assign(demoUrl(this.site, name, this.slideNo));
  }

  private items() {
    return Array.from(this.host.querySelectorAll<HTMLElement>('.demo-switcher-item'));
  }

  // `from` is 0 for the current theme's entry, -1 for the last one.
  private show(from: number) {
    this.open.set(true);
    setTimeout(() => {
      const items = this.items();
      const current = items.findIndex((i) => i.getAttribute('aria-current') === 'true');
      items[from < 0 ? items.length - 1 : Math.max(current, 0)]?.focus();
    });
  }

  private close(refocus: boolean) {
    this.open.set(false);
    if (refocus) this.host.querySelector<HTMLElement>('.demo-switcher-pill')?.focus();
  }
}
