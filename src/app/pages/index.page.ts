import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {GithubIcon} from '../ui/github-icon';
import {LandingDemo} from '../landing/landing-demo';
import {LandingFeatures} from '../landing/landing-features';

/**
 * The home page. It has no docs sidebar (the app shell hides it on `/`): the name, the tagline
 * and two buttons on the left, the live demo on the right, three highlights below.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, GithubIcon, LandingDemo, LandingFeatures],
  template: `
    <div class="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:py-16 xl:px-12">
      <section
        class="grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12"
      >
        <div class="flex flex-col items-center text-center">
          <img src="logo-mark.svg" alt="" aria-hidden="true" class="size-24 sm:size-28" />
          <h1
            class="mt-6 mb-0 font-[Geist_Mono,ui-monospace,monospace] text-5xl font-bold tracking-tight sm:text-6xl"
          >
            slide.ng
          </h1>
          <p class="mt-4 mb-0 text-xl text-zinc-600 sm:text-2xl dark:text-zinc-400">
            Presentation slides for Angular developers
          </p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              routerLink="/getting-started/install"
              class="landing-button rounded-xl bg-fuchsia-700 px-6 py-3 text-lg font-bold !text-white no-underline hover:bg-fuchsia-800"
            >
              Get Started
            </a>
            <a
              routerLink="/getting-started/what-and-why"
              class="landing-button rounded-xl bg-zinc-800 px-6 py-3 text-lg font-bold !text-white no-underline hover:bg-zinc-600 dark:bg-zinc-200 dark:!text-zinc-900 dark:hover:bg-zinc-400"
            >
              Why
            </a>
          </div>
          <p class="mt-6 flex items-center gap-4 text-sm text-zinc-500">
            <a
              [href]="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-zinc-500 no-underline hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <svg ngmdGithubIcon class="size-4"></svg>
              GitHub
            </a>
            <a
              routerLink="/welcome"
              class="text-zinc-500 no-underline hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Introduction
            </a>
          </p>
        </div>

        <app-landing-demo />
      </section>

      <section class="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800 lg:mt-20">
        <app-landing-features />
      </section>

      <p class="mt-12 mb-0 text-center text-sm text-zinc-500">
        slide.ng is early and not on npm yet. Read
        <a routerLink="/migrating/not-supported">what is not supported</a>
        before you start.
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export default class HomePage {
  protected readonly githubUrl = 'https://github.com/slide-ng/slide.ng';
}
