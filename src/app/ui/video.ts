import {Component, computed, inject, input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ngmd-video',
  templateUrl: './video.html',
})
export class NgmdVideo {
  private readonly sanitizer = inject(DomSanitizer);

  readonly src = input.required<string>();
  readonly title = input<string>('Video player');

  readonly safeUrl = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl()));

  private readonly embedUrl = computed(() => {
    const src = this.src();
    if (src.startsWith('https://www.youtube.com/embed/')) return src;
    const yt = src.match(/youtube\.com\/watch\?v=([\w-]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const ytShort = src.match(/youtu\.be\/([\w-]+)/);
    if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;
    const vm = src.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
    return 'about:blank';
  });
}
