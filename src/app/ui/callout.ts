import {Component, input} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

type CalloutType = 'info' | 'tip' | 'success' | 'warning' | 'danger';

// Per-side borders below: avoids Tailwind's `border-color` shorthand
// (set by `border + border-zinc-200`) competing with `border-l-*` and
// wiping the stripe colour under the `dark:` cascade.
const BOX =
  'px-5 py-4 rounded-lg border-y border-r border-t-zinc-200 border-r-zinc-200 border-b-zinc-200 dark:border-t-zinc-800 dark:border-r-zinc-800 dark:border-b-zinc-800 bg-zinc-50 dark:bg-zinc-900 border-l-[3px]';

@Component({
  selector: 'ngmd-callout',
  imports: [NgTemplateOutlet],
  templateUrl: './callout.html',
})
export class NgmdCallout {
  readonly type = input<CalloutType>('info');
  readonly title = input<string>('');
  protected readonly box = BOX;
}
