import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'ngmd-image',
  templateUrl: './image.html',
})
export class NgmdImage {
  readonly src = input.required<string>();
  readonly alt = input<string>('');
  readonly caption = input<string>('');
  readonly width = input<string>('');

  protected readonly maxWidth = computed(() => {
    const width = this.width().trim();
    return /^\d+(\.\d+)?$/.test(width) ? `${width}px` : width || null;
  });
}
