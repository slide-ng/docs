import {Component, computed, ElementRef, inject, signal, viewChild} from '@angular/core';
import {
  LucideDynamicIcon,
  LucideCheck,
  LucideChevronDown,
  LucideExternalLink,
} from '@lucide/angular';
import type {VersionStatus} from '../../ngmd.config';
import {VersionService} from '../services/version/version.service';

/**
 * Header dropdown of every documentation version.
 *
 * Renders only when `versions` config is set with more than one entry.
 * Trigger reads the active deployment's label; the dropdown lists every
 * entry with its lifecycle chip. The active row is visually marked with
 * a check icon and does nothing on click. Every other row is a plain
 * `<a href target="_blank">` to the entry's deployment URL.
 *
 * Mirrors the adev / PrimeNG model: no internal route navigation, no
 * URL parsing. The live site only renders one version of the docs; the
 * switcher is a registry of external sibling deployments.
 */
@Component({
  selector: 'app-version-switcher',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'onEscape()',
    '(focusout)': 'onFocusOut($event)',
  },
  imports: [LucideDynamicIcon],
  templateUrl: './version-switcher.html',
})
export class VersionSwitcher {
  private readonly versions = inject(VersionService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  readonly chevronIcon = LucideChevronDown;
  readonly checkIcon = LucideCheck;
  readonly externalIcon = LucideExternalLink;

  readonly open = signal(false);
  /** Hide when the registry is empty or has only one entry. With one
   *  version there's nothing to switch to. */
  readonly visible = computed(() => this.versions.list().length > 1);
  readonly list = computed(() => this.versions.list());

  readonly selfLabel = computed(() => this.versions.self()?.label ?? '');
  readonly triggerLabel = computed(
    () => this.versions.self()?.label ?? this.list()[0]?.label ?? '',
  );

  toggle(): void {
    this.open.update((v) => !v);
  }

  chipLabel(status: VersionStatus): string {
    if (status === 'current') return 'Latest';
    if (status === 'next') return 'Next';
    if (status === 'rc') return 'RC';
    return 'Deprecated';
  }

  chipClasses(status: VersionStatus): string {
    if (status === 'current') {
      return 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]';
    }
    if (status === 'next' || status === 'rc') {
      return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    }
    return 'bg-zinc-100 dark:bg-zinc-800 text-brand-muted dark:text-brand-muted-dark';
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && !this.host.nativeElement.contains(next)) this.open.set(false);
  }

  protected onEscape(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.trigger()?.nativeElement.focus();
  }
}
