import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Calendar } from '@primeicons/angular/calendar';
import { Inbox } from '@primeicons/angular/inbox';
import { Stopwatch } from '@primeicons/angular/stopwatch';
import { Strikethrough } from '@primeicons/angular/strikethrough';
import { MapMarker } from '@primeicons/angular/map-marker';
import { StationCombinationModel } from '../../model/station-combination.model';
import { StationCombinationService } from '../../service/station-combination.service';
import {StationService} from '../../../station/service/station.service';
import {ClassNames} from 'primeng/classnames';
import {ButtonDirective} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-station-combination-view',
  standalone: true,
  imports: [DataViewModule, CardModule, TagModule, DatePipe, FormsModule, InputTextModule, Calendar, Inbox, Stopwatch, Strikethrough, MapMarker, ClassNames, ButtonDirective, ConfirmDialog],
  providers: [ConfirmationService],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Station Combinations</span>
        <p class="view-page-subtitle">{{totalElements}} elements found<br>
          {{ filteredStationCombinations.length }} station combination{{ filteredStationCombinations.length === 1 ? '' : 's' }} shown</p>
      </div>

      <div class="view-search">
        <input
          pInputText
          type="text"
          placeholder="Search by city..."
          [(ngModel)]="searchTerm"
        />
      </div>
    </div>

    <p-dataview [value]="stationCombinationList"
                [paginator]="true"
                [rows]="12"
                [totalRecords]="totalElements"
                [lazy]="true"
                (onLazyLoad)="onPageChange($event)"
                [loading]="loading()">
      <ng-template #list let-items>
        <div class="view-grid">
          @for (stationCombination of items; track stationCombination.id) {
            <p-card pClass="view-card">

              <div class="flex justify-end gap-2 pt-2">
                @if (editingStationCombinationId !== stationCombination.id) {
                  <button
                    pButton
                    class="p-button-view-card-edit"
                    type="button"
                    (click)="startEdit(stationCombination)"
                    [disabled]="editingStationCombinationId !== null"
                  >
                    Edit
                  </button>
                  <button
                    pButton
                    class="p-button-view-card-delete"
                    type="button"
                    (click)="requestDelete($event, stationCombination)"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="editingStationCombinationId !== null"
                  >
                    Delete
                  </button>
                  <p-confirmdialog id="dialog" [visible]="showConfirm" (onHide)="showConfirm = false">
                    <svg data-p-icon="exclamation-triangle"/>
                  </p-confirmdialog>
                }
              </div>

              <div class="view-card-row">
                <div class="view-card-header">
                  <div class="view-avatar-icon">
                    <svg data-p-icon="map-marker"/>
                  </div>
                  <div>
                    <div class="view-card-title">Combination #{{ stationCombination.id }}</div>
                    <div class="view-card-date">
                      <svg data-p-icon="calendar"/>
                      Created at: {{ stationCombination.createdAt | date: 'mediumDate' }}
                    </div>
                  </div>
                </div>
              </div>

                @if (editingStationCombinationId == stationCombination.id) {
                  <div class="view-card-body view-card-edit-body">
                    <div class="view-edit-field">
                      <label>Distance</label>
                      <input
                        #distanceInput="ngModel"
                        pInputText
                        type="number"
                        min="1"
                        [(ngModel)]="editedStationCombination.distance"
                      />
                    </div>
                    @if (distanceInput.invalid && (distanceInput.dirty || distanceInput.touched)) {
                      <p class="form-invalid .ng-invalid.ng-touched">Enter positive value for km</p>
                    }
                    <div class="view-edit-field">
                      <label>Duration</label>
                      <input
                        #durationInput="ngModel"
                        pInputText
                        type="number"
                        min="1"
                        [(ngModel)]="editedStationCombination.duration"
                      />
                    </div>
                    @if (durationInput.invalid && (durationInput.dirty || durationInput.touched)) {
                      <p class="form-invalid .ng-invalid.ng-touched">Enter positive value for minutes</p>
                    }
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    <button pButton class="p-button-view-card-cancel" type="button"
                            (click)="cancelEdit()"
                            [disabled]="savingStationCombinationId === stationCombination.id"
                    >
                      Cancel
                    </button>
                    <button pButton class="p-button-view-card-save" type="button"
                            (click)="saveStationCombination(stationCombination)"
                            [disabled]="savingStationCombinationId === stationCombination.id || distanceInput.invalid || distanceInput.value === null
                                        || durationInput.invalid || durationInput.value === null "
                    >
                      {{ savingStationCombinationId === stationCombination.id ? 'Saving...' : 'Save' }}
                    </button>
                  </div>
                } @else {
                <div class="view-card-details">
                  <div class="view-stat" style="margin-right: 1rem">
                      <svg data-p-icon="strikethrough"/>
                      <span>Distance: {{ stationCombination.distance }}</span>
                      <svg data-p-icon="stopwatch" style="margin-left: 0.75rem"/>
                      <span>Duration: {{ stationCombination.duration }} </span>
                  </div>

                  <p-tag class="view-tag">
                    Station 1 Id: {{ stationCombination.stationAId }}
                    <br>Station 2 Id: {{ stationCombination.stationBId }}
                  </p-tag>
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
export class StationCombinationView implements OnInit {
  private stationCombinationService = inject(StationCombinationService);
  private stationService = inject(StationService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  stationCombinationList?: StationCombinationModel[];
  loading = signal(true);
  searchTerm = '';
  totalElements = 0;

  editingStationCombinationId: number | null = null;
  editedStationCombination: Partial<StationCombinationModel> = {};
  savingStationCombinationId: number | null = null;

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {}

  onPageChange(event: any) {
    this.loadStationCombinations(event.first, event.first + event.rows);
  }

  private loadStationCombinations(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    this.stationCombinationService.getListStationCombinations(pageFirst, pageLast).subscribe({
      next: (data) => {
        this.stationCombinationList = data.content;
        this.totalElements = data.totalElements;
        // for (let stc of this.stationCombinationList) {
        //   (stc as any).displayPropertyA = `${this.stationService.getStationById(stc.stationAId).subscribe(station => {return `${station.city} - ${station.district}`})}`;
        //   (stc as any).displayPropertyB = `${this.stationService.getStationById(stc.stationBId).subscribe(station => {return `${station.city} - ${station.district}`})}`;
        // }
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading station combination list');
        this.loading.set(false);
      }
    });
  }

  get filteredStationCombinations(): StationCombinationModel[] {
    if (!this.stationCombinationList) { return []; }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) { return this.stationCombinationList; }

    return this.stationCombinationList.filter(sc =>
      this.stationService.getStationById(sc.stationAId).subscribe({
        next: data => {return data.city.toLowerCase().includes(term) ||
          (this.stationService.getStationById(sc.stationBId).subscribe({
            next: data => {return data.city.toLowerCase().includes(term)}
          })
          )
        }
      })
    );
  }

  requestDelete(event: any, stationCombination: StationCombinationModel) {
    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Only the selected combination will be affected.<br>Do you want to delete this record?',
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
        this.stationCombinationService.deleteStationCombination(stationCombination.id).subscribe({next: () => {
            this.router.navigate(["/station-combination-view"]);
            this.notification.showSuccess('Success', `Station combination deleted succesfully, please refresh the page`);
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while deleting station combination');
          }});
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

  startEdit(stationCombination: StationCombinationModel): void {
    this.editingStationCombinationId = stationCombination.id;
    this.editedStationCombination = { ...stationCombination };
  }

  cancelEdit(): void {
    this.editingStationCombinationId = null;
    this.editedStationCombination = {};
  }

  async saveStationCombination(stationCombination: StationCombinationModel) {
    if (this.editingStationCombinationId !== stationCombination.id) { return; }

    const updatedStationCombination: StationCombinationModel = { ...stationCombination, ...this.editedStationCombination };
    this.savingStationCombinationId = stationCombination.id;

    this.stationCombinationService.updateStationCombination(stationCombination.id, updatedStationCombination).subscribe({
      next: (result) => {
        const savedStationCombination = result ?? updatedStationCombination;
        this.stationCombinationList = this.stationCombinationList?.map(b => b.id === stationCombination.id ? savedStationCombination : b);
        this.editingStationCombinationId = null;
        this.editedStationCombination = {};
        this.savingStationCombinationId = null;
        this.router.navigate(["/station-combination-view"]);
        this.notification.showSuccess('Success', `Station combination updated succesfully, please refresh the page`);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating station combination');
        this.savingStationCombinationId = null;
      }
    });
  }

}
