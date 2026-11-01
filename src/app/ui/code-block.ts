import {Component, DestroyRef, effect, inject, input, signal} from '@angular/core';
import {DomSanitizer, type SafeHtml} from '@angular/platform-browser';
import {writeToClipboard} from '../utils/clipboard';

/**
 * Code block with a header bar and shiki syntax highlighting at runtime.
 * Author passes raw `code` + a `language`. Shiki is lazy-loaded on first
 * render so it does not weigh on the initial bundle.
 */
@Component({
  selector: 'ngmd-code-block',
  templateUrl: './code-block.html',
})
export class NgmdCodeBlock {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  readonly header = input<string>('');
  readonly language = input<string>('');
  readonly code = input<string>('');

  protected readonly highlighted = signal<SafeHtml | null>(null);
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    if (!(await writeToClipboard(this.code()))) return;
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }

  protected readonly codeClass = () => (this.language() ? `language-${this.language()}` : '');

  constructor() {
    let cancelled = false;
    this.destroyRef.onDestroy(() => (cancelled = true));

    effect(async () => {
      const code = this.code();
      const lang = this.language();
      if (!code || typeof window === 'undefined') return;

      try {
        const {codeToHtml} = await import('shiki');
        if (cancelled) return;
        const html = await codeToHtml(code, {
          lang: lang || 'text',
          themes: {light: 'github-light-default', dark: 'github-dark-default'},
          defaultColor: false,
        });
        if (!cancelled) {
          this.highlighted.set(this.sanitizer.bypassSecurityTrustHtml(html));
        }
      } catch {
        // Lang not bundled or shiki failed: fall through to the unstyled <pre>.
      }
    });
  }
}
