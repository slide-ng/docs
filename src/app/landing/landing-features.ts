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
  template: `
    <ul class="m-0 grid list-none gap-8 p-0 md:grid-cols-3">
      @for (feature of features; track feature.title) {
        <li>
          <h2 class="m-0 text-base font-semibold">{{ feature.title }}</h2>
          <p class="mt-2 mb-3 text-sm text-zinc-600 dark:text-zinc-400">
            {{ feature.text }}
          </p>
          <p class="m-0 flex flex-wrap gap-x-4 text-sm">
            @for (link of feature.links; track link.href) {
              <a [routerLink]="link.href" class="font-medium">{{ link.label }}</a>
            }
          </p>
        </li>
      }
    </ul>
  `,
})
export class LandingFeatures {
  protected readonly features = FEATURES;
}
