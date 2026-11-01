import { Component } from '@angular/core';
import { DemoSwitcher } from '../components/demo-switcher';

@Component({
  selector: 'demo-switcher-layer',
  imports: [DemoSwitcher],
  templateUrl: './slide-top.html',
})
export default class DemoSwitcherLayer {}
