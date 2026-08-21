import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import {ScrollerOptions} from 'primeng/api';
import { Panel } from 'primeng/panel';
import {ClassNames} from 'primeng/classnames';
import {StationModel} from '../station/model/station.model';
import {StationService} from '../station/service/station.service';
import {NotificationService} from '../../shared/notification/notification.service';
import {JsonDateConverter} from '../../shared/converter/json-date-converter';
import {HttpErrorResponse} from '@angular/common/http';

interface PopularRoute {
  from: string;
  to: string;
  duration: string;
  price: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, SelectModule, DatePickerModule, InputNumberModule, Panel, ClassNames
  ],
  template: `
    <section class="brand-gradient-bg" style="padding: 3rem 1.5rem 5rem; margin: -1rem -1rem 0 -1rem">
      <div style="max-width: 960px; margin: 0 auto; text-align: center;">
          <span class="header-brand-title hero-title">
            Book your next bus trip
          </span>
        <p class="hero-subtitle">
          Compare routes, pick your seat, travel with safety
        </p>
      </div>
    </section>

    <section style="max-width: 960px; margin: -3.5rem auto 0; padding: 0 1.5rem;">
      <p-card>
        <div class="search-grid">
          <div class="search-field">
            <label class="app-form-label" for="from">From</label>
            <p-select
              inputId="from"
              [options]="allStations"
              [(ngModel)]="selectedFrom"
              optionLabel="displayProperty"
              optionValue="id"
              placeholder="Departure city"
              [filter]="true"
              filterBy="displayProperty"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              [style]="{ width: '100%' }"
              [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
              required></p-select>
          </div>

          <div class="search-field">
            <label class="app-form-label" for="to">To</label>
            <p-select
              inputId="to"
              [options]="allStations"
              [(ngModel)]="selectedTo"
              optionLabel="displayProperty"
              optionValue="id"
              placeholder="Destination city"
              [filter]="true"
              filterBy="displayProperty"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              [style]="{ width: '100%' }"
              [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
              required></p-select>
          </div>

          <div class="search-field">
            <label class="app-form-label" for="date">Departure Date</label>
            <p-datepicker
              inputId="date"
              [(ngModel)]="travelDate"
              [showIcon]="true"
              [minDate]="today"
              dateFormat="dd M yy"
              [style]="{ width: '100%' }"
              class="w-full"
              required></p-datepicker>
          </div>

          <div class="search-field">
            <label class="app-form-label" for="passengers">Passengers</label>
            <p-inputnumber
              inputId="passengers"
              [(ngModel)]="passengers"
              [min]="1"
              [max]="8"
              [showButtons]="true"
              buttonLayout="horizontal"
              pClass="w-full"
              required>
            </p-inputnumber>
          </div>
        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
          <button
            pButton
            type="button"
            label="Search buses"
            class="p-button-brand-search"
            style="padding: 0.75rem 2.5rem;"
            [disabled]="!selectedFrom() || !selectedTo()"
            (click)="onSearch()"
          >Search
          </button>
        </div>
      </p-card>
    </section>

    <section style="max-width: 960px; margin: 3rem auto; padding: 0 1.5rem;">
      <p-panel header="Popular routes" [toggleable]="false" class="section-panel">
        <div class="routes-grid">
          @for (route of popularRoutes; track route.from + route.to) {
            <p-card class="ticket-card" style="cursor: pointer;" (click)="selectRoute(route)">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="font-weight: 700; color: var(--p-surface-800); font-size: 1rem;">
                    {{ route.from }} <span style="color: var(--p-surface-400);">&rarr;</span> {{ route.to }}
                  </div>
                  <div style="color: var(--p-surface-500); font-size: 0.8125rem; margin-top: 0.25rem;">
                    {{ route.duration }} &middot; Daily departures
                  </div>
                </div>
                <div class="brand-text-gradient" style="font-weight: 700; font-size: 1.125rem;">
                  {{ route.price | currency }}
                </div>
              </div>
            </p-card>
          }
        </div>
      </p-panel>
    </section>

    <section style="max-width: 960px; margin: 3rem auto 4rem; padding: 0 1.5rem;">
      <p-panel header="Why ride with us" [toggleable]="false" class="section-panel">
        <div class="perks-grid">
          <div class="perk">
            <div class="brand-avatar perk-icon">1</div>
            <div>
              <div class="perk-title">Pick your own seat</div>
              <div class="perk-copy">Choose from a live seat map before you pay.</div>
            </div>
          </div>
          <div class="perk">
            <div class="brand-avatar perk-icon">2</div>
            <div>
              <div class="perk-title">Free cancellation</div>
              <div class="perk-copy">Cancel up to 2 hours before departure.</div>
            </div>
          </div>
          <div class="perk">
            <div class="brand-avatar perk-icon">3</div>
            <div>
              <div class="perk-title">24/7 support</div>
              <div class="perk-copy">Reach a real person any time you need help.</div>
            </div>
          </div>
        </div>
      </p-panel>
    </section>
  `,
  styles: [`
    .hero-title {
      display: block;
      font-family: var(--p-typography-family, 'Segoe UI');
      font-size: 2.25rem;
      font-weight: 700;
      line-height: var(--p-typography-line-height, 1.2);
      margin-bottom: 0.5rem;
    }
    .hero-subtitle {
      font-family: var(--p-font-family, 'Segoe UI');
      font-weight: var(--p-font-weight, 400);
      color: rgba(255, 255, 255, 0.85);
      font-size: 1rem;
      margin: 0;
    }

    .section-panel :global(.p-panel-title) {
      font-family: var(--p-font-family);
      font-weight: 700;
      font-size: 1.35rem;
      color: var(--p-surface-800);
    }
    .section-panel :global(.p-panel-header) {
      background: transparent;
      border: none;
      padding-left: 0;
      padding-right: 0;
    }
    .section-panel :global(.p-panel-content) {
      padding-left: 0;
      padding-right: 0;
      padding-bottom: 0;
    }

    .perk-title {
      font-family: var(--p-font-family);
      font-weight: 700;
      color: var(--p-surface-800);
    }
    .perk-copy {
      font-family: var(--p-font-family);
      font-weight: var(--p-font-weight, 400);
      color: var(--p-surface-500);
      font-size: 0.875rem;
    }

    .search-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem 1.5rem;
    }
    @media (min-width: 768px) {
      .search-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .search-field {
      display: flex;
      flex-direction: column;
    }
    .search-field .app-form-label {
      margin-bottom: 0.5rem;
    }

    .routes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 640px) {
      .routes-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .perks-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    @media (min-width: 640px) {
      .perks-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .perk {
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
    }
    .perk-icon {
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9375rem;
    }
  `]
})
export class Home implements OnInit {
  today = new Date();
  private router = inject(Router);
  private stationService = inject(StationService);
  private notification = inject(NotificationService);

  stationScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.stationOnLazyLoad.bind(this)
  };

  popularRoutes: PopularRoute[] = [
    { from: 'İstanbul', to: 'Ankara', duration: '5h 30m', price: 24.99 },
    { from: 'İstanbul', to: 'İzmir', duration: '8h 15m', price: 29.99 },
    { from: 'Ankara', to: 'Antalya', duration: '7h 45m', price: 27.5 },
    { from: 'İzmir', to: 'Antalya', duration: '6h 10m', price: 22.0 }
  ];

  selectedFrom = signal<number | null>(null); //holds id
  selectedTo = signal<number | null>(null);
  travelDate: Date = new Date();
  passengers = 1;

  allStations: StationModel[] = [];
  private last = 50;

  ngOnInit(): void {
    // route data overrides the @Input default when navigated via router config???
    this.stationOnLazyLoad({first: 0, last: this.last});
  }

  stationOnLazyLoad(event: any) {
    this.stationService.getListStations(event.first, event.first + this.last).subscribe({
      next: data => {
        const fetchedStations = data.content.map((st: any) => ({
          ...st,
          displayProperty: `${st.city} - ${st.district}`
        }));

        // Merge newly fetched stations into allStations while removing duplicates by id
        const existingIds = new Set(this.allStations.map(s => s.id));
        const newStations = fetchedStations.filter((st: StationModel) => !existingIds.has(st.id));
        this.allStations = [...this.allStations, ...newStations];
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading stations');
      }
    });
  }

  onSearch(): void {
    const from = this.selectedFrom();
    const to = this.selectedTo();
    if (!from || !to) {
      return;
    }
    this.router.navigate(['/search'], {
      queryParams: {
        startStationId: from,
        endStationId: to,
        date: new JsonDateConverter().serializeToLocalDate(this.travelDate),
        passenger: this.passengers
      }
    });
  }

  selectRoute(route: PopularRoute): void {
    const from = this.allStations.find(c => c.city.toLowerCase() === route.from.toLowerCase());
    const to = this.allStations.find(c => c.city.toLowerCase() === route.to.toLowerCase());
    if (from) this.selectedFrom.set(from.id);
    if (to) this.selectedTo.set(to.id);
  }
}
