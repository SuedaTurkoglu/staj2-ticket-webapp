import {Component, computed, inject, Input, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Calendar } from '@primeicons/angular/calendar';
import { Inbox } from '@primeicons/angular/inbox';
import { Receipt } from '@primeicons/angular/receipt';
import { MapMarker } from '@primeicons/angular/map-marker';
import { Car } from '@primeicons/angular/car';
import { DepartureService } from '../../service/departure.service';
import { DepartureModel } from '../../model/departure.model';
import { ClassNames } from 'primeng/classnames';
import { StationModel } from '../../../station/model/station.model';
import { ButtonDirective } from 'primeng/button';
import { StationService } from '../../../station/service/station.service';
import { Select } from 'primeng/select';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {DatePicker} from 'primeng/datepicker';
import {StyleClass} from 'primeng/styleclass';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {AuthService} from '../../../user/service/auth.service';

@Component({
  selector: 'app-departure-view',
  standalone: true,
  providers: [ConfirmationService],
  imports: [DataViewModule, CardModule, TagModule, DatePipe, FormsModule, InputText, Inbox, Calendar, Receipt, Car, MapMarker, ClassNames, ButtonDirective, Select, ConfirmDialog, DatePicker, StyleClass, ReactiveFormsModule],
  styles: [`
    .view-card-edit-container {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
      align-items: flex-start;
    }

    .view-card-edit-container .view-card-edit-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .view-card-edit-container .station-edit-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Departures</span>
        <p class="view-page-subtitle">{{totalElements}} elements found<br>
          {{ filteredDepartures.length }} departure{{ filteredDepartures.length === 1 ? '' : 's' }} shown</p>
      </div>

      <div class="view-search" style="margin-right: 2rem;">
        <input
          pInputText
          type="text"
          placeholder="Search by city or district..."
          [(ngModel)]="searchTerm"
        />
      </div>
    </div>

    <p-dataview
      [value]="filteredDepartures"
      [paginator]="true"
      [rows]="12"
      [totalRecords]="totalElements"
      [lazy]="true"
      (onLazyLoad)="onPageChange($event)"
      [loading]="loading()"
    >
      <ng-template #list let-items>
        <div class="view-grid">
          @for (departure of items; track departure.id) {
            <p-card pClass="view-card">

              <div class="flex justify-end gap-2 pt-2">
                @if (canManage() && editingDepartureId !== departure.id  && departure.date > (today | date: 'yyyy-MM-dd')!) {
                  <button
                    pButton
                    class="p-button-view-card-edit"
                    type="button"
                    (click)="startEdit(departure)"
                    [disabled]="editingDepartureId !== null"
                  >
                    Edit
                  </button>
                  <button
                    pButton
                    class="p-button-view-card-delete"
                    type="button"
                    (click)="requestDelete($event, departure)"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="editingDepartureId !== null"
                  >
                    Delete
                  </button>
                  <p-confirmdialog id="dialog" [visible]="showConfirm" (onHide)="showConfirm = false">
                    <svg data-p-icon="exclamation-triangle"/>
                  </p-confirmdialog>
                }
              </div>

              @if (editingDepartureId == departure.id) {
                <div class="view-card-edit-container">
                  <div class="view-card-body view-card-edit-body">
                    <div class="view-edit-field">
                      <label>Date</label>
                      <p-datepicker
                        #dateInput="ngModel"
                        [minDate]="today"
                        [placeholder]="today.toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: '2-digit'})"
                        [showIcon]="true"
                        dateFormat="dd M yy"
                        [style]="{ width: '100%' }"
                        pStyleClass="w-full"
                        [(ngModel)]="editedDeparture.date"
                        required
                      />
                    </div>
                    @if ((dateInput.value === '' || dateInput.invalid) && (dateInput.dirty || dateInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter in date format</p>
                    }
                    <div class="view-edit-field">
                      <label>Time</label>
                      <input
                        #timeInput="ngModel"
                        pInputText
                        type="text"
                        [(ngModel)]="editedDeparture.time"
                        [pattern]="/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/"
                      />
                    </div>
                    @if ((timeInput.value === '' || timeInput.invalid) && (timeInput.dirty || timeInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter in time format</p>
                    }
                    <div class="view-edit-field">
                      <label>Base Price</label>
                      <input
                        #basePriceInput="ngModel"
                        pInputText
                        type="number"
                        min="1"
                        [(ngModel)]="editedDeparture.basePrice"
                      />
                    </div>
                    @if ((basePriceInput.invalid || basePriceInput.value === null) && (basePriceInput.dirty || basePriceInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter the base price</p>
                    }
                    <div class="view-edit-field">
                      <label>Price Per Km</label>
                      <input
                        #pricePerKmInput="ngModel"
                        pInputText
                        type="number"
                        min="1"
                        [(ngModel)]="editedDeparture.pricePerKm"
                      />
                    </div>
                    @if ((pricePerKmInput.invalid || pricePerKmInput.value === null) && (pricePerKmInput.dirty || pricePerKmInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter the price per km</p>
                    }
                  </div>

                  <div class="view-card-body view-card-edit-body">
                    <label class="app-form-label">Stations (in order)</label>

                    @for (stationId of editedStationList; track $index) {
                      <div class="station-edit-row">
                        <span class="station-order-badge">{{ $index + 1 }}</span>

                        <p-select
                          [options]="allStations"
                          optionLabel="displayProperty"
                          optionValue="id"
                          [filter]="true"
                          filterBy="displayProperty"
                          filterMatchMode="contains"
                          [resetFilterOnHide]="true"
                          [placeholder]="$index === 0 ? 'Start station' : ($index === editedStationList.length - 1 ? 'End station' : 'Stop ' + ($index + 1))"
                          [(ngModel)]="editedStationList[$index]"
                          [style]="{width: '15rem'}"
                          [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
                          appendTo="body"
                          required
                        />

                        @if (editedStationList.length > 2) {
                          <button
                            pButton
                            type="button"
                            class="p-button-secondary-blue"
                            size="small"
                            [style]="{fontSize:'0.7rem', marginBottom: '0'}"
                            [disabled]="editedStationList.length <= 2"
                            (click)="removeStationField($index)"
                          >Remove</button>
                        }
                      </div>
                    }

                    <button
                      pButton
                      size="small"
                      type="button"
                      class="p-button-add"
                      (click)="addStationField()"
                    >Add</button>
                  </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                  <button pButton class="p-button-view-card-cancel" type="button"
                          (click)="cancelEdit()"
                          [disabled]="savingDepartureId === departure.id"
                  >
                    Cancel
                  </button>
                  <button pButton class="p-button-view-card-save" type="button"
                          (click)="saveDeparture(departure)"
                          [disabled]="savingDepartureId === departure.id || dateInput.invalid || dateInput.value === ''
                                        || timeInput.invalid || timeInput.value === ''
                                        || basePriceInput.invalid || basePriceInput.value === null
                                        || pricePerKmInput.invalid || pricePerKmInput.value === null "
                  >
                    {{ savingDepartureId === departure.id ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              } @else{
                <div class="view-card-row">
                  <div class="view-card-header">
                    <div class="view-avatar-icon">
                      <svg data-p-icon="car"/>
                      <svg data-p-icon="map-marker"/>
                    </div>
                    <div>
                      <div class="view-card-title">Departure #{{ departure.id }}</div>
                      <div class="view-card-date">
                        <svg data-p-icon="calendar"/>
                        Planned Start Date: {{ departure.date | date: 'mediumDate' }}<br>
                        Start Time: {{ departure.time }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="view-card-body">
                    <div class="view-stat">
                      <svg data-p-icon="receipt"/>
                      <span>Bus Id: {{departure.busId}} Driver Id: {{departure.driverId}}</span>
                    </div>
                    <p-tag class="view-tag" severity="info">
                      Base Price: {{departure.basePrice}}<br>Price Per Km: {{departure.pricePerKm}}
                    </p-tag>
                </div>

                <div class="view-card-details">
                  <div class="view-stat">
                    <span>List of Stations: {{ stationStats(departure.id) }}</span>
                  </div>
                </div>
              }

            </p-card>
          }
        </div>
      </ng-template>

      <ng-template #empty>
        <div class="view-empty">
          <svg data-p-icon="inbox"/>
          <p>No departures to show yet.</p>
        </div>
      </ng-template>
    </p-dataview>
  `
})
export class DepartureView implements OnInit {
  @Input() viewMode: 'admin' | 'driver' = 'admin';

  today = new Date();
  private departureService = inject(DepartureService);
  private stationService = inject(StationService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  loading = signal(false);
  searchTerm = '';
  totalElements = 0;
  private last = 50;
  departureWithStationList?: DepartureModel[];

  editingDepartureId: number | null = null;
  editedDeparture: Partial<DepartureModel> = {};
  savingDepartureId: number | null = null;
  departureStationInfo = new Map<number, string>();

  allStations: StationModel[] = [];
  editedStationList: number[] = [];
  stationScrollerOptions = { delay: 200, showLoader: true, lazy: true, onLazyLoad: this.stationOnLazyLoad.bind(this) };

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  canManage = computed(() => this.viewMode === 'admin');

  ngOnInit(): void {
    // route data overrides the @Input default when navigated via router config???
    this.viewMode = this.route.snapshot.data['viewMode'] ?? this.viewMode;
    this.stationOnLazyLoad({first: 0, last: this.last});
  }

  onPageChange(event: any) {
    this.loadDepartures(event.first, event.first + this.last);
  }

  private loadDepartures(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    const request$ = this.viewMode === 'driver'
      ? this.departureService.getAllMyDepartures(pageFirst, pageLast)
      : this.departureService.getListDepartures(pageFirst, pageLast);

    request$.subscribe({
      next: (data) => {
        this.departureWithStationList = data.content;
        this.totalElements = data.totalElements;
        this.departureWithStationList.forEach(d => this.stationListToString(d.id, d.stationList));
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading departures');
        this.loading.set(false);
      }
    });
  }

  private stationListToString(depId: number, stationList: StationModel[]): void {
    if (!stationList || !stationList.length) {
      this.departureStationInfo.set(depId, "No stations assigned");
      return;
    }

    this.departureStationInfo.set(depId, stationList
      .map((s, index) => {
        return s ? `${index + 1}) ${s.city} - ${s.district}` : `Loading #${index}...`;
      })
      .join(' ➔ '));
  }

  stationValidator(stationList: StationModel[]): boolean {
    const seen = new Set<any>();
    return stationList.some((data: any) => {
      if (seen.has(data)) return true;
      seen.add(data);
      return false;
    });
  }

  stationStats(depId: number): string {
    return this.departureStationInfo.get(depId) ?? '';
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

  get filteredDepartures(): DepartureModel[] {
    if (!this.departureWithStationList) { return []; }
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.departureWithStationList;
    }
    return this.departureWithStationList.filter(departure =>
      departure.stationList?.some(data =>
        data.city.toLowerCase().includes(term) || data.district.toLowerCase().includes(term))
    );
  }

  requestDelete(event: any, departure: DepartureModel) {
    if (!this.canManage()) return;

    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Cannot delete departure if related ticket exists. Do you want to proceed?',
      header: 'Confirmation',
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },

      accept: () => {
        this.departureService.deleteDeparture(departure.id).subscribe({next: () => {
            this.router.navigate(["/departure-view"]);
            this.notification.showSuccess('Success', `Departure deleted succesfully, please refresh the page`);
        }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while deleting departure');
        }});
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

  startEdit(departure: DepartureModel): void {
    if (!this.canManage()) return;

    this.editingDepartureId = departure.id;
    this.editedDeparture = { ...departure, date: (departure.date) }; //to show the current value on the screen

    const existingIds = new Set(this.allStations.map(s => s.id));
    departure.stationList.forEach(st => {
      if (!existingIds.has(st.id)) {
        this.allStations.push({
          ...st,
          displayProperty: `${st.city} - ${st.district}`
        } as any);
      }
    });

    this.editedStationList = departure.stationList.map(s => s.id);
  }

  addStationField(): void {
    this.editedStationList.push(0);
  }

  removeStationField(index: number): void {
    if (this.editedStationList.length <= 2) return;
    this.editedStationList.splice(index, 1);
  }

  cancelEdit(): void {
    this.editingDepartureId = null;
    this.editedDeparture = {};
    this.editedStationList = [];
  }

  async saveDeparture(departure: DepartureModel) {
    if (!this.canManage() || this.editingDepartureId !== departure.id) return;

    const selectedStations = this.editedStationList
      .map(id => this.allStations.find(s => s.id === id))
      .filter((s): s is StationModel => !!s);

    if (this.stationValidator(selectedStations)) {
      this.notification.showError('Info', 'Duplicate stations are not allowed');
      return;
    }

    if(selectedStations.length < 2) {
      this.notification.showError('Info', 'Start and end stations must exist');
      return;
    }

    const ids = selectedStations.map(id => id.id);

    const updatedDeparture: DepartureModel = {
      ...departure,
      ...this.editedDeparture,
      startStationId: ids[0],
      endStationId: ids[ids.length-1],
      stationIds: ids
    };

    this.savingDepartureId = departure.id;

    this.departureService.updateDeparture(departure.id, updatedDeparture).subscribe({
      next: (result) => {
        const savedDeparture = result ?? updatedDeparture;
        this.departureWithStationList = this.departureWithStationList?.map(b => b.id === departure.id ? savedDeparture : b);
        this.stationListToString(savedDeparture.id, savedDeparture.stationList);
        this.editingDepartureId = null;
        this.editedDeparture = {};
        this.editedStationList = [];
        this.savingDepartureId = null;
        this.router.navigate(["/departure-view"]);
        this.notification.showSuccess('Success', `Departure updated successfully, please refresh the page`);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating departure');
        this.savingDepartureId = null;
      }
    });
  }
}
