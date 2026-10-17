import { Component } from '@angular/core';
import { DemoSwitcher } from '../components/demo-switcher';

@Component({
  selector: 'demo-switcher-layer',
  imports: [DemoSwitcher],
  template: `<demo-switcher />`,
})
export default class DemoSwitcherLayer {}
