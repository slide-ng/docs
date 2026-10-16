import { Component, input } from '@angular/core';

// #region greeting
@Component({
  selector: 'app-user',
  template: `<h2>Hello, {{ name() }}</h2>`,
})
export class User {
  name = input.required<string>();
}
// #endregion greeting

export const DEFAULT_NAME = 'Ada';
