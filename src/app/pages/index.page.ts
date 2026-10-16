import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {LandingDemo} from '../landing/landing-demo';
import {LandingFeatures} from '../landing/landing-features';

/**
 * The home page, laid out like Slidev's: no docs sidebar (the app shell hides it on `/`), a left
 * column with the logo, the tagline and two buttons, and the live demo on the right. On screens
 * narrower than `xl` the two stack. Three highlights follow below.
 */
@Component({
  selector: 'app-home',
  imports: [RouterLink, LandingDemo, LandingFeatures],
  template: `
    <div
      class="mx-auto min-h-[80vh] max-w-[100vw] gap-4 px-8 py-5 xl:grid xl:max-w-[112.5rem] xl:grid-cols-[3fr_4fr] xl:px-20"
    >
      <div class="flex min-h-[37.5rem] flex-col items-center justify-center max-xl:min-h-[28rem]">
        <h1 class="sr-only">slide.ng</h1>
        <img
          src="logo-mark.svg"
          alt=""
          aria-hidden="true"
          width="160"
          height="160"
          class="w-36 xl:w-44"
        />
        <img
          src="logo-title-light.svg"
          alt=""
          aria-hidden="true"
          width="400"
          height="112"
          class="mt-4 w-72 xl:w-96 dark:hidden"
        />
        <img
          src="logo-title-dark.svg"
          alt=""
          aria-hidden="true"
          width="400"
          height="112"
          class="mt-4 hidden w-72 xl:w-96 dark:block"
        />
        <p class="m-0 mt-3 text-balance text-center text-2xl text-brand-muted sm:text-3xl">
          Presentation slides for Angular developers
        </p>
        <div class="mt-5 flex justify-center gap-3 p-4">
          <a
            routerLink="/getting-started/install"
            class="landing-button h-max rounded-xl bg-brand-deep px-5 py-3 text-xl font-bold !text-zinc-50 no-underline hover:bg-brand-dark"
          >
            Get Started
          </a>
          <a
            routerLink="/getting-started/what-and-why"
            class="landing-button h-max rounded-xl bg-zinc-950 px-5 py-3 text-xl font-bold !text-zinc-50 no-underline hover:bg-brand-deep dark:bg-zinc-100 dark:!text-zinc-950 dark:hover:!text-zinc-50"
          >
            Why
          </a>
        </div>
      </div>

      <div class="flex">
        <app-landing-demo class="m-auto w-full" />
      </div>
    </div>

    <section
      class="mx-auto mt-10 max-w-6xl border-t border-zinc-200 px-8 pt-10 dark:border-zinc-800"
    >
      <app-landing-features />
    </section>

    <p class="mt-12 mb-10 text-center text-sm text-brand-muted">
      slide.ng is early and not on npm yet. Read
      <a routerLink="/migrating/not-supported">what is not supported</a>
      before you start.
    </p>
  `,
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
