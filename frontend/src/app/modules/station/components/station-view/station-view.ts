import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Calendar } from '@primeicons/angular/calendar';
import { Inbox } from '@primeicons/angular/inbox';
import { Home } from '@primeicons/angular/home';
import { MapMarker } from '@primeicons/angular/map-marker';
import { StationModel } from '../../model/station.model';
import { StationService } from '../../service/station.service';
import {ClassNames} from 'primeng/classnames';
import {ButtonDirective} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-station-view',
  standalone: true,
  providers: [ConfirmationService],
  imports: [DataViewModule, CardModule, TagModule, DatePipe, FormsModule, InputText, Calendar, Inbox, MapMarker, Home, ClassNames, ButtonDirective, ConfirmDialog],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Stations</span>
        <p class="view-page-subtitle">{{totalElements}} elements found<br>
          {{ filteredStations.length }} station{{ filteredStations.length === 1 ? '' : 's' }} shown</p>
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
      [value]="filteredStations"
      [paginator]="true"
      [rows]="12"
      [totalRecords]="totalElements"
      [lazy]="true"
      (onLazyLoad)="onPageChange($event)"
      [loading]="loading()"
    >
      <ng-template #list let-items>
        <div class="view-grid">
          @for (station of items; track station.id) {
            <p-card pClass="view-card">

              <div class="flex justify-end gap-2 pt-2">
                @if (editingStationId !== station.id) {
                  <button
                    pButton
                    class="p-button-view-card-edit"
                    type="button"
                    (click)="startEdit(station)"
                    [disabled]="editingStationId !== null"
                  >
                    Edit
                  </button>
                  <button
                    pButton
                    class="p-button-view-card-delete"
                    type="button"
                    (click)="requestDelete($event, station)"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="editingStationId !== null"
                  >
                    Delete
                  </button>
                  <p-confirmdialog id="dialog" [visible]="showConfirm" (onHide)="showConfirm = false">
                    <svg data-p-icon="exclamation-triangle"/>
                  </p-confirmdialog>
                }
              </div>

                <div class="view-card-header">
                  <div class="view-avatar-icon">
                    <svg data-p-icon="home"/>
                  </div>
                  <div>
                    <div class="view-card-title">Station #{{ station.id }}</div>
                    <div class="view-card-date">
                      <svg data-p-icon="calendar"/>
                      Created at: {{ station.createdAt | date: 'mediumDate' }}
                    </div>
                  </div>
                </div>

                @if (editingStationId == station.id) {
                  <div class="view-card-body view-card-edit-body">
                    <div class="view-edit-field">
                      <label>City</label>
                      <input
                        #cityInput="ngModel"
                        pInputText
                        type="text"
                        [(ngModel)]="editedStation.city"
                        minlength="2"
                      />
                    </div>
                    @if (cityInput.value === '' && (cityInput.dirty || cityInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter city</p>
                    }
                    <div class="view-edit-field">
                      <label>District</label>
                      <input
                        #districtInput="ngModel"
                        pInputText
                        type="text"
                        [(ngModel)]="editedStation.district"
                        minlength="2"
                      />
                    </div>
                    @if (districtInput.value === '' && (districtInput.dirty || districtInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter district</p>
                    }
                    <div class="view-edit-field">
                      <label>Coordinate</label>
                      <input
                        #coordinateInput="ngModel"
                        pInputText
                        type="text"
                        [(ngModel)]="editedStation.coordinate"
                        [pattern]="/^-?\\d+(\\.\\d+)?,\\s*-?\\d+(\\.\\d+)?$/"
                      />
                    </div>
                    @if (coordinateInput.value === '' && (coordinateInput.dirty || coordinateInput.touched)) {
                      <p class=".ng-invalid.ng-touched form-invalid">Enter in coordinate format</p>
                    }

                    <div class="flex justify-end gap-2 pt-2">
                      <button pButton class="p-button-view-card-cancel" type="button"
                              (click)="cancelEdit()"
                              [disabled]="savingStationId === station.id"
                      >
                        Cancel
                      </button>
                      <button pButton class="p-button-view-card-save" type="button"
                              (click)="saveStation(station)"
                              [disabled]="savingStationId === station.id || cityInput.invalid || cityInput.value === ''
                                        || districtInput.invalid || districtInput.value === ''
                                        || coordinateInput.invalid || coordinateInput.value === null "
                      >
                        {{ savingStationId === station.id ? 'Saving...' : 'Save' }}
                      </button>
                    </div>
                  </div>
                } @else {
                  <div class="view-card-details">
                    <div class="view-stat">
                      <svg data-p-icon="map-marker"/>
                      <span>{{ station.city }}</span>
                    </div>
                    <p-tag [value]="station.district" class="view-tag" severity="info"/>
                    <span class="view-coordinate">{{ station.coordinate }}</span>
                  </div>
                }

            </p-card>
          }
        </div>
      </ng-template>

      <ng-template #empty>
        <div class="view-empty">
          <svg data-p-icon="inbox"/>
          <p>No stations to show yet.</p>
        </div>
      </ng-template>
    </p-dataview>
  `
})
export class StationView implements OnInit {
  private stationService = inject(StationService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  stationList?: StationModel[];
  loading = signal(true);
  searchTerm = '';
  totalElements = 0;

  editingStationId: number | null = null;
  editedStation: Partial<StationModel> = {};
  savingStationId: number | null = null;

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {}

  onPageChange(event: any) {
    this.loadStations(event.first, event.first + event.rows);
  }

  private loadStations(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    this.stationService.getListStations(pageFirst, pageLast).subscribe({
      next: (data) => {
        this.stationList = data.content;
        this.totalElements = data.totalElements;
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading station list');
        this.loading.set(false);
      }
    });
  }

  get filteredStations(): StationModel[] {
    if (!this.stationList) { return []; }
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.stationList;
    }
    return this.stationList.filter(station =>
      station.city?.toLowerCase().includes(term)
    );
  }

  requestDelete(event: any, station: StationModel) {
    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Cannot delete station if related departure exists. Do you want to proceed?',
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
        this.stationService.deleteStation(station.id).subscribe({next: () => {
            this.router.navigate(["api/station"])
            this.notification.showSuccess('Success', `Station deleted succesfully, please refresh the page`);
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while deleting station');
          }
        });
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

  startEdit(station: StationModel): void {
    this.editingStationId = station.id;
    this.editedStation = { ...station };
  }

  cancelEdit(): void {
    this.editingStationId = null;
    this.editedStation = {};
  }

  async saveStation(station: StationModel) {
    if (this.editingStationId !== station.id) { return; }

    const updatedStation: StationModel = { ...station, ...this.editedStation };
    this.savingStationId = station.id;

    this.stationService.updateStation(station.id, updatedStation).subscribe({
      next: (result) => {
        const savedStation = result ?? updatedStation;
        this.stationList = this.stationList?.map(b => b.id === station.id ? savedStation : b);
        this.editingStationId = null;
        this.editedStation = {};
        this.savingStationId = null;
        this.router.navigate(["/station-view"]);
        this.notification.showSuccess('Success', `Station updated succesfully, please refresh the page`);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating station');
        this.savingStationId = null;
      }
    });
  }

}
