import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Card} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {DividerModule} from 'primeng/divider';
import {ClassNames} from 'primeng/classnames';
import {DepartureService} from '../../service/departure.service';
import {StyleClass} from 'primeng/styleclass';
import {StationService} from '../../../station/service/station.service';
import {StationModel} from '../../../station/model/station.model';
import {ScrollerOptions} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {InputNumber} from 'primeng/inputnumber';
import { Search } from '@primeicons/angular/search';
import { ArrowRightArrowLeft } from '@primeicons/angular/arrow-right-arrow-left';
import { Calendar } from '@primeicons/angular/calendar';
import { MapMarker } from '@primeicons/angular/map-marker';
import { SearchMinus } from '@primeicons/angular/search-minus';
import { SlicePipe } from '@angular/common';
import {DepartureCardModel} from '../../model/departure-card.model';

interface SeatRow {
  left: number[];
  right: number[];
}

interface EasyDateOption {
  label: string;
  dayAfter: number;
}

@Component({
  selector: 'app-departure-search',
  standalone: true,
  imports: [CommonModule, Card, SlicePipe, Search, ArrowRightArrowLeft, Calendar, MapMarker, SearchMinus, ReactiveFormsModule, ButtonDirective, DatePickerModule, DividerModule, SelectModule, ClassNames, StyleClass, InputNumber],
  template: `
    <div style="max-width: 1000px; margin: 0 auto; padding: 1.5rem;">

      <div class="view-page-header">
        <div>
          <span class="view-page-title">Find Your Ticket</span>
          <p class="view-page-subtitle">Search for route schedules and book your ticket</p>
        </div>
      </div>

      <p-card pClass="view-card" pStyleClass="mb-4" style="z-index: 1">
        <form [formGroup]="formGroupDeparture" (ngSubmit)="onSearch()">
          <div class="search-row">

            <div class="view-edit-field" style="flex: 2 1 200px;">
              <label class="app-form-label">From</label>
              <p-select
                formControlName="startStationId"
                [options]="stationList"
                optionLabel="displayProperty"
                optionValue="id"
                [filter]="true"
                filterBy="displayProperty"
                filterMatchMode="contains"
                [resetFilterOnHide]="true"
                pStyleClass="w-full"
                placeholder="Select From"
                [style]="{ width: '100%', marginTop: '-1rem'}"
                [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
                required
              >
              </p-select>
            </div>

            <div class="swap-button-container">
              <button
                pButton
                type="button"
                class="p-button-outlined swap-btn"
                (click)="swapStations()"
                aria-label="Swap Stations"
              >
                <svg data-p-icon="arrow-right-arrow-left" stroke="currentColor">
                </svg>
              </button>
            </div>

            <div class="view-edit-field" style="flex: 2 1 200px;">
              <label class="app-form-label">To</label>
              <p-select
                formControlName="endStationId"
                [options]="stationList"
                optionLabel="displayProperty"
                optionValue="id"
                [filter]="true"
                filterBy="displayProperty"
                filterMatchMode="contains"
                [resetFilterOnHide]="true"
                pStyleClass="w-full"
                placeholder="Select Destination"
                [style]="{ width: '100%', marginTop: '-1rem' }"
                [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
                required
              >
              </p-select>
            </div>

            <div class="view-edit-field" style="flex: 1.2 1 160px">
              <label class="app-form-label">Date</label>
              <p-datepicker
                [showIcon]="true"
                [minDate]="today"
                dateFormat="dd M yy"
                [style]="{ width: '100%', marginTop: '-1rem' }"
                pStyleClass="w-full"
                formControlName="date">
              </p-datepicker>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 0 -3rem 0.2rem -0.7rem">
              @for (option of easyDateOptions; track option.dayAfter) {
                <button
                  pButton
                  type="button"
                  class="easy-date-btn"
                  [class.active]="isEasyDateActive(option.dayAfter)"
                  (click)="setEasyDate(option.dayAfter)"
                >{{ option.label }}</button>
              }
            </div>

            <div class="view-edit-field" style="flex: 0.8 1 130px;">
              <label class="app-form-label">Passengers</label>
              <p-inputnumber
                formControlName="passenger"
                [min]="1"
                [max]="8"
                [showButtons]="true"
                [style]="{ width: '70%', marginTop: '-1rem' }"
                pStyleClass="w-full"
                required>
              </p-inputnumber>
            </div>

            <button
              pButton
              type="submit"
              class="p-button-brand"
              style="margin-bottom: 0.15rem; margin-left: -1rem"
              [disabled]="formGroupDeparture.invalid || loading()"
            >Search
              <svg data-p-icon="search"/>
            </button>
          </div>

        </form>
      </p-card>

      @if (hasSearched()) {
        <div class="mt-4">
          <div class="view-page-header" style="margin-bottom: 1rem;">
            <span class="view-card-title"
                  style="margin-top: 1rem">Available Departures ({{ searchResultWithProperties?.length }})</span>
          </div>

          @if (searchResultWithProperties.length > 0) {
            <div class="view-grid">
              @for (dep of searchResultWithProperties; track dep.departureId) {
                <p-card pStyleClass="ticket-card view-card">
                  <div class="view-card-row">

                    <div class="view-card-header">
                      <div class="view-card-date mt-1">
                        <svg data-p-icon="calendar"></svg>
                        <span>{{ dep.queryStartDate }}</span>
                      </div>
                      <div class="view-card-date mt-1">
                        <svg data-p-icon="map-marker"/>
                        <span>{{ dep.startStationName }} &rarr; {{ dep.endStationName }}</span>
                      </div>
                    </div>

                    <div class="dep-timeline" style="margin-left: 1rem">
                      <div class="dep-timeline-point dep-start">
                        <span class="dep-time">{{ dep.queryStartTime | slice:0:-3 }}</span>
                        <span class="dep-station">{{ dep.queryStartStationName }}</span>
                      </div>

                      <div class="dep-timeline-line">
                        <span class="dep-duration">
                          {{ dep.queryDuration >= 60 ? (dep.queryDuration/60).toFixed(0) + ' hour ' : '' }}{{ dep.queryDuration%60 }} min
                        </span>
                        <span class="dep-distance">
                          {{ dep.queryDistance }} KM
                        </span>
                      </div>

                      <div class="dep-timeline-point dep-end">
                        <span class="dep-time">{{ dep.queryEndTime | slice:0:-3 }}</span>
                        <span class="dep-station">{{ dep.queryEndStationName }}</span>
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 1.5rem; justify-content: space-between; margin-top: 0.75rem;">
                      <div style="margin-right: 1.5rem">
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--p-primary-500);">
                          \${{ dep.queryPrice }}
                        </div>
                        <div style="font-size: 0.75rem; color: var(--p-surface-500);">
                          {{ dep.seatLeft }} seat left
                        </div>
                      </div>

                      <button
                        pButton
                        class="p-button-card-search"
                        (click)="toggleSeats(dep.departureId)"
                      >{{ isExpanded(dep.departureId) ? '▲ Hide Seats' : '▼ Seats' }}
                      </button>
                    </div>
                  </div>


                  <div class="seat-panel" [class.expanded]="isExpanded(dep.departureId)">
                    <p-divider></p-divider>

                    <div class="seat-diagram-legend">
                      <span><i class="bus-seat" style="height: 1.5rem; width: 1.5rem; margin-bottom: -0.5rem"></i> Available</span>
                      <span><i class="bus-seat selected" style="height: 1.5rem; width: 1.5rem; margin-bottom: -0.5rem"></i> Selected</span>
                      <span><i class="bus-seat occupied" style="height: 1.5rem; width: 1.5rem; margin-bottom: -0.5rem"></i> Occupied</span>
                    </div>

                    <div class="bus-layout">
                      <div class="bus-front">
                        <span>Driver</span>
                      </div>

                      @for (row of getSeatRows(dep); track $index) {
                        <div class="bus-row">
                          <div class="bus-seat-group">
                            @for (seat of row.left; track seat) {
                              <span
                                class="bus-seat"
                                [class.selected]="isSeatSelected(dep.departureId, seat)"
                                [class.occupied]="isSeatOccupied(dep, seat)"
                                (click)="selectSeat(dep, seat)"
                              >{{ seat }}</span>
                            }
                          </div>
                          <div class="bus-aisle"></div>
                          <div class="bus-seat-group">
                            @for (seat of row.right; track seat) {
                              <span
                                class="bus-seat"
                                [class.selected]="isSeatSelected(dep.departureId, seat)"
                                [class.occupied]="isSeatOccupied(dep, seat)"
                                (click)="selectSeat(dep, seat)"
                              >{{ seat }}</span>
                            }
                          </div>
                        </div>
                      }
                    </div>

                    <div class="seat-summary">
                      <span>{{ selectedSeatsCount(dep.departureId) }} seat(s) selected</span>
                      <button
                        pButton
                        type="button"
                        class="p-button-brand"
                        style="margin-bottom: 0"
                        [disabled]="selectedSeatsCount(dep.departureId) === 0"
                        (click)="onCheckout(dep)"
                      >Continue to Checkout
                      </button>
                    </div>
                  </div>

                </p-card>
              }
            </div>
          } @else {
            <p-card pClass="view-card">
              <div class="view-empty">
                <svg data-p-icon="search-minus"/>
                <p>No departures found for the selected route and date</p>
              </div>
            </p-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .search-row {
      display: flex;
      flex-wrap: nowrap; /* keeps everything on one line */
      align-items: flex-end;
      gap: 1rem;
    }

    .seat-diagram-legend {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      font-size: 0.8125rem;
      color: var(--p-surface-500);
      margin: 0.5rem 0 1.25rem;
    }

    .swap-btn {
      width: 2rem;
      height: 2rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 -0.7rem 0 -0.7rem;
      border-radius: 15px;
    }

    .swap-button-container {
      flex: 0 0 auto;
      display: flex;
      align-items: flex-end;
      padding-bottom: 0.5rem;
    }

    .dep-timeline {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 0.5rem;
      flex: 1 1 240px;
      min-width: 40px;
      max-width: 535px;
    }

    .dep-timeline-point {
      display: flex;
      flex-direction: column;
      min-width: 64px;
    }

    .dep-timeline-point.dep-end {
      align-items: flex-end;
      text-align: right;
    }

    .dep-time {
      font-family: var(--p-font-family, 'Segoe UI');
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #5358e3 0%, #ff5c33 80%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .dep-station {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--p-surface-600);
    }

    .dep-timeline-line {
      position: relative;
      flex: 1;
      height: 2px;
      border-top: 2px dashed var(--p-surface-300);
      margin: 0 0.5rem;
    }

    .dep-duration {
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--p-surface-0, #fff);
      padding: 0 0.5rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--p-primary-500);
      white-space: nowrap;
    }

    .dep-distance {
      display: block;
      margin-top: 0.4rem;
      text-align: center;
      font-size: 0.7rem;
      font-weight: 500;
      background: var(--p-surface-0, #fff);
      color: var(--p-surface-500);
    }

    .easy-date-btn {
      background: var(--p-surface-0, #fff);
      border: 1px solid var(--p-surface-200, #e5e7eb);
      color: var(--p-surface-600, #4b5563);
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.4rem 0.9rem;
      height: 1rem;
      width: 3rem;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .easy-date-btn:hover {
      border-color: var(--about-orange, #f76902);
      color: var(--about-orange, #f76902);
    }

    .easy-date-btn.active {
      background: var(--about-orange, #f76902);
      border-color: var(--about-orange, #f76902);
      color: #ffffff;
    }
  `]
})

export class DepartureSearch implements OnInit {
  today = new Date;
  departureService = inject(DepartureService);
  stationService = inject(StationService);
  router = inject(Router);
  private notification = inject(NotificationService);
  private route = inject(ActivatedRoute);

  hasSearched = signal(false);
  loading = signal(false);

  filteredSearchList: DepartureCardModel[] = [];
  searchResultWithProperties: DepartureCardModel[] = [];
  stationList?: StationModel[];
  private last = 50;

  easyDateOptions: EasyDateOption[] = [
    { label: 'Today', dayAfter: 0 },
    { label: 'Tmrw', dayAfter: 1 },
  ];

  stationScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.stationOnLazyLoad.bind(this)
  };

  ngOnInit(): void {
    this.stationOnLazyLoad({first: 0, last: this.last});
    this.readQueryParamsAndSearch();
  }

  private readQueryParamsAndSearch(): void {
    this.route.queryParams.subscribe(params => {
      const startStationId = params['startStationId'] ? Number(params['startStationId']) : null;
      const endStationId = params['endStationId'] ? Number(params['endStationId']) : null;
      const dateStr = params['date'];
      const passenger = params['passenger'] ? Number(params['passenger']) : 1;

      if (startStationId && endStationId) {
        let parsedDate = new Date();
        if (dateStr) {
          const parts = dateStr.split('-'); //date is formatted as iso format (yyyy-MM-dd)
          if (parts.length === 3) {
            parsedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          }
        }

        this.formGroupDeparture.patchValue({
          startStationId: startStationId,
          endStationId: endStationId,
          date: parsedDate,
          passenger: passenger
        });

        if (this.formGroupDeparture.valid) {
          this.onSearch();
        }
      }
    });
  }

  stationOnLazyLoad(event: any) {
    this.stationService.getListStations(event.first, event.first + this.last).subscribe({
      next: data => {
        this.stationList = data.content;
        for (let st of this.stationList) {
          (st as any).displayProperty = `${st.city} - ${st.district}`;
        }
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading station list');
      }
    });
  }

  stationValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get('startStationId')?.value;
      const end = formGroup.get('endStationId')?.value;
      return (start && end && start > 0 && end > 0 && start === end) ?
        { stationsIdentical: true } : null; //null and identical check
    };
  }

  formGroupDeparture = new FormGroup({
    date: new FormControl(new Date(), { nonNullable: true, validators: [Validators.required] }),
    startStationId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    endStationId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    passenger: new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(8)] })
  }, {validators: this.stationValidator()});

  onSearch(): void {
    this.loading.set(true);

    this.departureService.getListFilteredDepartures(this.formGroupDeparture.value.startStationId as number,
      this.formGroupDeparture.value.endStationId as number, this.formGroupDeparture.value.date as any,
      this.formGroupDeparture.value.passenger as number)
      .subscribe({next: (dep) => {
          this.filteredSearchList = dep;

          (dep.length >= 1) ? this.notification.showSuccess('Success', `Found ${dep.length} ${dep.length<=1 ? 'departure' : 'departures'}`)
                            : this.notification.showInfo('Info', `Could not found any departures`);

          this.listDepartures();

        }, error: (err: HttpErrorResponse) => {
            this.loading.set(false);
            this.hasSearched.set(false);

            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while searching for departures');
         }
      });

  }

  listDepartures() {
    this.hasSearched.set(true);
    this.loading.set(false);
    this.searchResultWithProperties = this.filteredSearchList;
  }

  swapStations(): void {
    const fromId = this.formGroupDeparture.get('startStationId')?.value;
    const toId = this.formGroupDeparture.get('endStationId')?.value;

    this.formGroupDeparture.patchValue({
      startStationId: toId,
      endStationId: fromId
    });
  }

  //easy date button
  setEasyDate(days: number): void {
    this.formGroupDeparture.patchValue({ date:
        new Date(Date.UTC(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() + days, 0, 0, 0)) });
  }

  isEasyDateActive(days: number): boolean {
    const selected = this.formGroupDeparture.get('date')?.value;
    if (!selected) { return false; }

    const target = new Date();
    target.setDate(target.getDate() + days);

    return selected.getFullYear() === target.getFullYear()
      && selected.getMonth() === target.getMonth()
      && selected.getDate() === target.getDate();
  }

  // seat logic
  private expandedDepartureIds = new Set<number>(); // keeps the expanded departures
  private seatRowsCache = new Map<number, SeatRow[]>();
  private selectedSeats = new Map<number, Set<number>>(); // keeps the seats that are selected by the user
  capacity: number = 40; //40 unless override

  toggleSeats(departureId: number): void { // toggles the current situation of the departure card
    if (this.expandedDepartureIds.has(departureId)) {
      this.expandedDepartureIds.delete(departureId);
    } else {
      this.expandedDepartureIds.add(departureId);
    }
  }

  isExpanded(departureId: number): boolean {
    return this.expandedDepartureIds.has(departureId);
  }

  getSeatRows(dep: DepartureCardModel): SeatRow[] { //creates cache to not load the list everytime
    if (!this.seatRowsCache.has(dep.departureId)) {
      this.seatRowsCache.set(dep.departureId, []); //placeholder??????

      this.seatRowsCache.set(dep.departureId, this.buildSeatRows(dep.busCapacity ? dep.busCapacity : this.capacity))
    }
    return this.seatRowsCache.get(dep.departureId)!;
  }

  private buildSeatRows(capacity: number): SeatRow[] {
    const rows: SeatRow[] = [];
    let seatNum = 1;

    while (seatNum <= capacity) { //create all the seats as 2x2 left-right rows
      const left: number[] = [];
      const right: number[] = [];

      for (let i = 0; i<2 && seatNum <= capacity; i++, seatNum++) {
        left.push(seatNum);
      }
      for (let i = 0; i<2 && seatNum <= capacity; i++, seatNum++) {
        right.push(seatNum);
      }

      rows.push({ left, right });
    }
    return rows;
  }

  selectSeat(dep: DepartureCardModel, seatNum: number): void {
    if (this.isSeatOccupied(dep, seatNum)) {
      return;
    }

    if (!this.selectedSeats.has(dep.departureId)) { //if seat not selected yet, add the set
      this.selectedSeats.set(dep.departureId, new Set<number>());
    }

    const seats = this.selectedSeats.get(dep.departureId)!; //type is number, not undefined
    if (seats.has(seatNum)) { //if seat is selected, delete, else add to selected
      seats.delete(seatNum);
    } else {
      seats.add(seatNum);
    }
  }

  isSeatSelected(depId: number, seatNum: number): boolean {
    return this.selectedSeats.get(depId)?.has(seatNum) ?? false;
  }

  isSeatOccupied(dep: DepartureCardModel, seatNum: number) {
    return dep.seatMap[seatNum]; //referenced as record
  }

  selectedSeatsCount(depId: number): number {
    return this.selectedSeats.get(depId)?.size ?? 0;
  }

  protected onCheckout(dep: DepartureCardModel) {
    const seats = this.selectedSeats.get(dep.departureId);
    if (!seats || seats.size === 0) { return; }

    this.router.navigate(['/checkout'], {
      queryParams: {
        seatList: Array.from(seats).join(','), //send as seperated values
        departureId: dep.departureId,
        startStationId: this.formGroupDeparture.value.startStationId,
        endStationId: this.formGroupDeparture.value.endStationId,
        startName: dep.queryStartStationName,
        endName: dep.queryEndStationName,
        startTime: dep.queryStartTime,
        endTime: dep.queryEndTime,
        startDate: dep.queryStartDate
        //add user specific id here so that it cannot be accessible randomly
      }
    });

  }


}
