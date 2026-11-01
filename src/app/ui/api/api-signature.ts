import {Component, computed, input} from '@angular/core';

/**
 * Renders a single-line code signature for an API symbol. Lightweight by
 * design: no Shiki, no Monaco. Symbol pages can stack several signatures
 * (overloads), and the full file source is always one click away via the
 * "view source" link the page template renders separately.
 */
@Component({
  selector: 'app-api-signature',
  templateUrl: './api-signature.html',
})
export class ApiSignature {
  readonly text = input.required<string>();
  readonly display = computed(() => this.text().trim());
}
