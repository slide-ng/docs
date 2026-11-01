import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink} from '@angular/router';

interface Feature {
  title: string;
  text: string;
  links: {label: string; href: string}[];
}

const FEATURES: Feature[] = [
  {
    title: 'Markdown in, Angular out',
    text: 'One slides.md becomes an Angular app. Templates, @if and your own components work inside a slide.',
    links: [{label: 'Angular in markdown', href: '/guide/angular-templates'}],
  },
  {
    title: 'Presenter mode and export',
    text: 'A presenter view with notes and a timer, and export to PDF, PNG or PPTX.',
    links: [
      {label: 'Presenter mode', href: '/guide/presenter-mode'},
      {label: 'Export', href: '/guide/export'},
    ],
  },
  {
    title: 'Works offline',
    text: 'Build an offline folder that opens from disk, with no server and no network.',
    links: [{label: 'Presenting offline', href: '/guide/offline'}],
  },
];

/** Three plain highlights under the hero, each with a link to its guide page. */
@Component({
  selector: 'app-landing-features',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './landing-features.html',
})
export class LandingFeatures {
  protected readonly features = FEATURES;
}
