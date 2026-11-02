import {AfterViewInit, Component, DestroyRef, inject} from '@angular/core';
import {Router} from '@angular/router';
import {enhanceOnNavigation} from '../utils/enhance-on-navigation';

/**
 * Hydrates the placeholder divs emitted by the ngmd-video marked extension.
 * The extension outputs plain `<div data-...>` elements; this enhancer creates
 * the real <iframe> programmatically — bypassing any Angular [innerHTML]
 * sanitisation that may strip iframes in some configurations.
 */
@Component({
  selector: 'app-media-enhancer',
  templateUrl: './media-enhancer.html',
  styles: `
    :host {
      display: none;
    }
  `,
})
export class MediaEnhancer implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    enhanceOnNavigation(
      this.router,
      this.destroyRef,
      '.ngmd-video[data-video-src]:not([data-enhanced])',
      (el) => this.enhanceVideo(el),
    );
  }

  private enhanceVideo(el: HTMLElement): void {
    el.setAttribute('data-enhanced', 'true');
    const src = el.dataset['videoSrc'] ?? '';
    const title = el.dataset['videoTitle'] ?? 'Video player';
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.setAttribute('allow', 'accelerometer; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.loading = 'lazy';
    el.appendChild(iframe);
  }
}
