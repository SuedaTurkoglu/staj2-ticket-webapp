import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PIcon } from '@primeicons/angular/p-icon';
import { Router } from '@angular/router';

interface Milestone {
  year: string;
  title: string;
  copy: string;
}

interface Value {
  icon: string;
  title: string;
  copy: string;
}

interface Stat {
  label: string;
  target: number;
  suffix: string;
  value: number;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, PIcon],
  template: `
    <div class="about-page">

      <section class="about-hero">
        <div class="about-hero-copy">
          <span class="about-eyebrow">Who we are</span>
          <h1 class="about-headline">
            Every seat<br />
            has a story.
          </h1>
          <p class="about-lede">
            We connect small towns and big cities with one simple promise:
            book a seat, know exactly where it is, and get there without
            surprises. No overselling, no guesswork, just a ticket
            that means what it says.
          </p>
          <div class="about-hero-actions">
            <button pButton class="p-button-brand about-cta" (click)="onSearch()">Find a route</button>
            <button class="p-button-search about-cta-ghost">How it works</button>
          </div>
        </div>

        <div class="about-hero-route" aria-hidden="true">
          <svg viewBox="0 0 420 320" class="route-svg">
            <path
              class="route-path"
              d="M 30 260 C 90 260, 70 120, 150 110 S 260 40, 320 60 S 400 40, 400 40"
              fill="none"
            />
            <circle class="route-stop" cx="30" cy="260" r="6"></circle>
            <circle class="route-stop" cx="150" cy="110" r="6"></circle>
            <circle class="route-stop" cx="320" cy="60" r="6"></circle>
            <circle class="route-stop" cx="400" cy="40" r="6"></circle>

            <g class="route-bus">
              <rect x="-14" y="-9" width="28" height="18" rx="4"></rect>
              <circle cx="-7" cy="10" r="3"></circle>
              <circle cx="7" cy="10" r="3"></circle>
            </g>
          </svg>
          <span class="route-ticket">Seat 14B &middot; Confirmed</span>
        </div>
      </section>

      <section class="about-stats" #statsSection>
        <div class="stat" *ngFor="let s of stats; trackBy: trackByLabel">
          <span class="stat-value">{{ s.value }}{{ s.suffix }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </section>

      <section class="about-values">
        <div class="about-section-head">
          <span class="about-eyebrow">What we hold onto</span>
          <h2 class="about-h2">The rules we don't bend</h2>
        </div>

        <div class="values-grid">
          <div
            class="value-card reveal"
            #revealItem
            *ngFor="let v of values"
          >
            <div class="value-icon">
              <svg [pIcon]="v.icon" ></svg>
            </div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.copy }}</p>
          </div>
        </div>
      </section>

      <section class="about-final-cta reveal" #revealItem>
        <h2>Ready when you are.</h2>
        <p>Pick a route, pick a seat, and let us handle the rest.</p>
        <button class="p-button-brand about-cta" (click)="onSearch()">Book your seat</button>
      </section>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');

    :host {
      --about-orange: #f76902;
      --about-blue: #1e22aa;
      display: block;
      font-family: var(--p-font-family, 'Segoe UI');
      color: var(--p-surface-800, #1f2937);
      overflow-x: hidden;
    }

    .about-headline,
    .about-h2,
    .stat-value {
      font-family: 'Space Grotesk', var(--p-font-family, 'Segoe UI');
    }

    .about-eyebrow {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--about-orange);
      margin-bottom: 0.75rem;
    }

    /* ---------- HERO ---------- */
    .about-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      padding: 4rem 2rem 3rem;
      flex-wrap: wrap;
    }

    .about-hero-copy {
      flex: 1 1 380px;
      max-width: 480px;
      animation: fadeUp 0.7s ease both;
    }

    .about-headline {
      font-size: clamp(2.25rem, 4vw, 3.25rem);
      font-weight: 700;
      line-height: 1.08;
      margin: 0 0 1.25rem;
      color: var(--p-surface-900, #111827);
    }

    .about-lede {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--p-surface-500, #6b7280);
      margin: 0 0 1.75rem;
    }

    .about-hero-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .about-cta {
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 0 !important;
    }

    .about-cta-ghost {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--about-blue);
      padding: 0.75rem 1rem;
    }

    .about-hero-route {
      position: relative;
      flex: 1 1 320px;
      max-width: 420px;
      animation: fadeUp 0.9s ease 0.15s both;
    }

    .route-svg {
      width: 100%;
      height: auto;
    }

    .route-path {
      stroke: var(--about-blue);
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 6 10;
      stroke-dashoffset: 0;
      opacity: 0.55;
    }

    .route-stop {
      fill: var(--about-orange);
      stroke: #ffffff;
      stroke-width: 2;
    }

    .route-bus {
      offset-path: path("M 30 260 C 90 260, 70 120, 150 110 S 260 40, 320 60 S 400 40, 400 40");
      offset-rotate: 0deg;
      animation: driveRoute 6s ease-in-out infinite;
    }

    .route-bus rect {
      fill: var(--about-orange);
    }
    .route-bus circle {
      fill: var(--p-surface-800, #1f2937);
    }

    .route-ticket {
      position: absolute;
      bottom: -0.5rem;
      right: 0.5rem;
      font-family: 'Courier New', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: var(--p-surface-0, #fff);
      border: 1px dashed var(--about-orange);
      border-radius: 6px;
      padding: 0.35rem 0.6rem;
      color: var(--about-blue);
    }

    @keyframes driveRoute {
      0%   { offset-distance: 0%; }
      50%  { offset-distance: 100%; }
      100% { offset-distance: 0%; }
    }

    /* ---------- STATS ---------- */
    .about-stats {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 1.5rem;
      padding: 2rem 1.5rem;
      margin: 1rem 2rem 3rem;
      background: linear-gradient(135deg, var(--about-blue) 0%, var(--about-orange) 100%);
      border-radius: 12px;
      box-shadow: 0 8px 20px -8px rgba(30, 34, 170, 0.4);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 110px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
    }

    .stat-label {
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 0.25rem;
      text-align: center;
    }

    /* ---------- SECTION HEAD ---------- */
    .about-section-head {
      text-align: center;
      max-width: 480px;
      margin: 0 auto 2.5rem;
    }

    .about-h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      color: var(--p-surface-900, #111827);
    }

    /* ---------- VALUES ---------- */
    .about-values {
      padding: 1rem 2rem 4rem;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      max-width: 960px;
      margin: 0 auto;
    }

    .value-card {
      border-left: 4px solid var(--about-orange);
      background: var(--p-surface-0, #fff);
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .value-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px -8px rgba(30, 34, 170, 0.25);
    }

    .value-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--p-primary-50, #fff0e6);
      color: var(--about-orange);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.875rem;
    }

    .value-card h3 {
      margin: 0 0 0.375rem;
      font-size: 1rem;
      color: var(--p-surface-800, #1f2937);
    }

    .value-card p {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.6;
      color: var(--p-surface-500, #6b7280);
    }

    /* ---------- FINAL CTA ---------- */
    .about-final-cta {
      text-align: center;
      padding: 3rem 2rem 5rem;
    }

    .about-final-cta h2 {
      font-family: 'Space Grotesk', var(--p-font-family, 'Segoe UI');
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
      color: var(--p-surface-900, #111827);
    }

    .about-final-cta p {
      margin: 0 0 1.5rem;
      color: var(--p-surface-500, #6b7280);
    }

    /* ---------- SCROLL REVEAL ---------- */
    .reveal {
      opacity: 0;
      transform: translateY(18px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .about-hero-copy,
      .about-hero-route,
      .reveal {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
      .route-bus {
        animation: none !important;
        offset-distance: 0% !important;
      }
    }

    @media (max-width: 640px) {
      .about-hero { padding: 2.5rem 1.25rem 2rem; }
      .about-values { padding-left: 1.25rem; padding-right: 1.25rem; }
    }
  `]
})
export class About implements AfterViewInit, OnDestroy {
  private router = inject(Router);

  milestones: Milestone[] = [
    {
      year: '2016',
      title: 'One route, one van',
      copy: 'We started with a single line between two towns nobody else wanted to serve.'
    },
    {
      year: '2019',
      title: 'Seat-level booking',
      copy: 'We replaced paper manifests with real seat maps, so no one gets bumped at the door.'
    },
    {
      year: '2022',
      title: '50 routes and counting',
      copy: 'A regional network took shape, connecting smaller cities to major hubs on real schedules.'
    },
    {
      year: '2025',
      title: 'Live tracking for every trip',
      copy: 'Every ticket now comes with a live map, so waiting for a bus stopped meaning guessing.'
    }
  ];

  values: Value[] = [
    {
      icon: 'verified',
      title: 'No overselling',
      copy: 'If we sell seat 14B, seat 14B is yours. We cap sales at capacity, always.'
    },
    {
      icon: 'clock',
      title: 'Honest schedules',
      copy: 'Departure times reflect real traffic patterns, not wishful timetables.'
    },
    {
      icon: 'map-marker',
      title: 'Know where you are',
      copy: 'Every trip is trackable, live, from the moment you board to the moment you arrive.'
    }
  ];

  stats: Stat[] = [
    { label: 'Cities connected', target: 62, suffix: '', value: 0 },
    { label: 'Daily departures', target: 180, suffix: '+', value: 0 },
    { label: 'On-time trips', target: 96, suffix: '%', value: 0 },
    { label: 'Riders last year', target: 2, suffix: 'M', value: 0 }
  ];

  @ViewChildren('revealItem') revealItems!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('statsSection') statsSection!: ElementRef<HTMLElement>;

  private observer?: IntersectionObserver;
  private statsAnimated = false;

  constructor(private cdr: ChangeDetectorRef) {}

  trackByLabel(_index: number, item: Stat) {
    return item.label;
  }

  ngAfterViewInit(): void {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const target = entry.target as HTMLElement;
          target.classList.add('in-view');

          if (target === this.statsSection?.nativeElement && !this.statsAnimated) {
            this.statsAnimated = true;
            this.animateStats(prefersReducedMotion);
          }
          this.observer?.unobserve(target);
        });
      },
      { threshold: 0.2 }
    );

    this.revealItems.forEach((item) => this.observer?.observe(item.nativeElement));

    if (this.statsSection?.nativeElement) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  private animateStats(skip: boolean): void {
    if (skip) {
      this.stats.forEach((s) => (s.value = s.target));
      this.cdr.markForCheck();
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.stats.forEach((s) => {
        s.value = Math.round(s.target * eased);
      });

      this.cdr.markForCheck();
      this.cdr.detectChanges();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  onSearch(): void {
    this.router.navigate(['/search']);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
