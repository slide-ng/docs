import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgmdCard, NgmdCardGrid, NgmdCodeBlock, NgmdDemo} from '../ui';

const SAMPLE = `---
layout: center
---

# Hello

Count is {{ c.n() }}.

<app-counter #c [start]="5" />

<div v-click>Appears on the first click</div>`;

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgmdCard, NgmdCardGrid, NgmdCodeBlock, NgmdDemo],
  template: `
    <section class="mx-auto max-w-4xl px-6 pt-16 pb-8 text-center">
      <img src="/logo-mark.svg" alt="" aria-hidden="true" class="mx-auto size-16" />
      <h1 class="mt-6 text-5xl font-bold tracking-tight">slide.ng</h1>
      <p class="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Presentations written in markdown, with real Angular template syntax inside. One file in, a
        static site out.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          routerLink="/getting-started/what-and-why"
          class="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Get started
        </a>
        <a
          routerLink="/guide/syntax"
          class="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          Read the guide
        </a>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-8">
      <div class="grid gap-6 md:grid-cols-2 items-start">
        <div>
          <p class="mb-2 text-sm font-medium text-zinc-500">slides.md</p>
          <ngmd-code-block language="md" [code]="sample"></ngmd-code-block>
        </div>
        <div>
          <p class="mb-2 text-sm font-medium text-zinc-500">A starter deck, built with slide.ng</p>
          <ngmd-demo src="/demos/starter/" title="The starter deck"></ngmd-demo>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-8">
      <ngmd-card-grid [columns]="3">
        <ngmd-card icon="layers" title="Slidev's format">
          The same file format, the same layout names and most of the same keys. Slides split on
          <code>---</code>, notes live in a comment.
        </ngmd-card>
        <ngmd-card icon="code" title="Angular inside">
          <code ngNonBindable>{{}}</code>, <code>&#64;if</code>, <code>&#64;for</code> and your own
          standalone components work in a slide. Each slide is compiled ahead of time.
        </ngmd-card>
        <ngmd-card icon="rocket" title="Static output">
          A site any web host can serve, an offline folder that opens from disk, and PDF, PNG, PPTX
          and Markdown export.
        </ngmd-card>
        <ngmd-card icon="terminal" title="Code, math, diagrams">
          Shiki highlighting with click steps, Magic Move, Twoslash, Monaco editors, KaTeX, Mermaid
          and PlantUML.
        </ngmd-card>
        <ngmd-card icon="compass" title="Presenter tools">
          A presenter view with notes and timer, drawing, a camera bubble, recording, and sync
          between windows and devices.
        </ngmd-card>
        <ngmd-card
          icon="palette"
          title="Themes and setup files"
          link="/customize/theme-gallery"
          cta="Gallery"
        >
          Four official themes, plus your own layouts, components and setup hooks.
        </ngmd-card>
      </ngmd-card-grid>
    </section>

    <section class="mx-auto max-w-2xl px-6 pb-20 pt-4 text-center text-sm text-zinc-500">
      slide.ng is early and not on npm yet. Read
      <a routerLink="/migrating/not-supported">what is not supported</a>
      before you start.
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export default class HomePage {
  protected readonly sample = SAMPLE;
  protected readonly braces = '{{ }}';
}
