import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LandingDemo} from '../landing/landing-demo';

/**
 * The home page, laid out like Slidev's: no docs sidebar (the app shell hides it on `/`), a left
 * column with the logo, the tagline and two buttons, and the live demo on the right. On screens
 * narrower than `xl` the two stack.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, LandingDemo],
  templateUrl: './index.page.html',
  styles: `
    :host {
      display: block;
    }
    .landing-button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }
  `,
})
export default class HomePage {}
