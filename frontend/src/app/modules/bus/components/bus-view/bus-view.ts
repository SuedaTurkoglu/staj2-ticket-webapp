import { Component, inject, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DatePipe } from '@angular/common';
import { BusModel } from '../../model/bus.model';
import { BusService } from '../../service/bus.service';
import { Car } from '@primeicons/angular/car';
import { Calendar } from '@primeicons/angular/calendar';
import { Users } from '@primeicons/angular/users';
import { Inbox } from '@primeicons/angular/inbox';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {ConfirmDialog} from 'primeng/confirmdialog';
import { ExclamationTriangle } from '@primeicons/angular/exclamation-triangle';
import { NotificationService } from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-bus-view',
  standalone: true,
  providers: [ConfirmationService],
  imports: [DataViewModule, CardModule, TagModule, DatePipe, ExclamationTriangle, Car, Calendar, Users, Inbox, FormsModule, InputText, ButtonDirective, ClassNames, ToastModule, ConfirmDialog],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Fleet</span>
        <p class="view-page-subtitle">{{ totalElements }} elements found in fleet
          <br>{{ filteredBuses?.length }} bus{{ filteredBuses?.length === 1 ? '' : 'es' }} shown</p>
      </div>

      <div class="view-search">
        <input
          pInputText
          type="text"
          placeholder="Search by plate..."
          [(ngModel)]="searchTerm"
        />
      </div>
    </div>

    <p-dataview
      [value]="filteredBuses"
      [paginator]="true"
      [rows]="12"
      [totalRecords]="totalElements"
      [lazy]="true"
      (onLazyLoad)="onPageChange($event)"
      [loading]="loading()"
    >
      <ng-template #list let-items>
        <div class="view-grid" style="position: relative">
          @for (bus of items; track bus.id) {
            <p-card pClass="view-card">

              <div class="flex justify-end gap-2 pt-2">
                @if (editingBusId !== bus.id) {
                  <button
                    pButton
                    class="p-button-view-card-edit"
                    type="button"
                    (click)="startEdit(bus)"
                    [disabled]="editingBusId !== null"
                  >
                    Edit
                  </button>
                  <button
                    pButton
                    class="p-button-view-card-delete"
                    type="button"
                    (click)="requestDelete($event, bus)"
                    severity="danger"
                    [outlined]="true"
                    [disabled]="editingBusId !== null"
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
                  <svg data-p-icon="car"/>
                </div>
                <div>
                  <div class="view-card-title">Bus #{{ bus.id }}</div>
                  <div class="view-card-date">
                    <svg data-p-icon="calendar"/>
                    Created at: {{ bus.createdAt | date: 'mediumDate' }}
                  </div>
                </div>
              </div>

              @if (editingBusId === bus.id) {
                <div class="view-card-body view-card-edit-body">
                  <div class="view-edit-field">
                    <label>Plate</label>
                    <input
                      #plateInput="ngModel"
                      pInputText
                      type="text"
                      [(ngModel)]="editedBus.plate"
                      [pattern]="/^(0[1-9]|[1-7][0-9]|8[0-1])\\s?[A-Za-z]{1,3}\\s?(\\d{2,4})$/"
                    />
                  </div>
                  @if (plateInput.invalid && (plateInput.dirty || plateInput.touched)) {
                    <p class=".ng-invalid.ng-touched form-invalid">Enter in plate format</p>
                  }
                  <div class="view-edit-field">
                    <label>Capacity</label>
                    <input
                      #capacityInput="ngModel"
                      pInputText
                      type="number"
                      min="1"
                      [(ngModel)]="editedBus.capacity"
                    />
                  </div>
                  @if (capacityInput.value === 0 && (capacityInput.dirty || capacityInput.touched)) {
                    <p class=".ng-invalid.ng-touched form-invalid">Enter positive value</p>
                  }
                </div>

                <div class="flex justify-end gap-2 pt-2">
                  <button pButton class="p-button-view-card-cancel" type="button"
                          (click)="cancelEdit()"
                          [disabled]="savingBusId === bus.id"
                  >
                    Cancel
                  </button>
                  <p-toast position="bottom-right" key="bottom-right" />
                  <button pButton class="p-button-view-card-save" type="button"
                          (click)="saveBus(bus)"
                          [disabled]="savingBusId === bus.id || plateInput.invalid || plateInput.value === ''
                                        || capacityInput.invalid || capacityInput.value === null "
                  >
                    {{ savingBusId === bus.id ? 'Saving...' : 'Save' }}
                  </button>
                </div>
              } @else {
                <div class="view-card-body">
                  <div class="view-stat">
                    <svg data-p-icon="users"/>
                    <span>{{ bus.capacity }} seats</span>
                  </div>
                  <p-tag [value]="bus.plate" severity="info" class="view-tag"/>
                </div>
              }
            </p-card>
          }
        </div>
      </ng-template>

      <ng-template #empty>
        <div class="view-empty">
          <svg data-p-icon="inbox"/>
          <p>No buses to show yet.</p>
        </div>
      </ng-template>
    </p-dataview>
  `
})
export class BusView implements OnInit {
  private busService = inject(BusService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  searchTerm = '';
  totalElements = 0;
  busList?: BusModel[];
  loading = signal(true);

  editingBusId: number | null = null;
  editedBus: Partial<BusModel> = {};
  savingBusId: number | null = null;

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {}

  onPageChange(event: any) {
    this.loadBuses(event.first, event.first + event.rows);
  }

  private loadBuses(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    this.busService.getListBuses(pageFirst, pageLast).subscribe({
      next: (data) => {
        this.busList = data.content;
        this.totalElements = data.totalElements;
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading bus list');
        this.loading.set(false);
      }
    });
  }

  get filteredBuses(): BusModel[] {
    if (!this.busList) { return []; }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) { return this.busList; }

    return this.busList.filter(bus => bus.plate.toLowerCase().includes(term));
  }

  requestDelete(event: any, bus: BusModel) {
    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'All the bus records and related records (seats and tickets) of this bus will also be deleted.<br>Do you want to delete this record?',
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
        this.busService.deleteBus(bus.id).subscribe({next: () => {
            this.router.navigate(["/bus-view"]);
            this.notification.showSuccess('Success', `Bus deleted succesfully, please refresh the page`);
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while deleting bus');
          }});
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

  startEdit(bus: BusModel): void {
    this.editingBusId = bus.id;
    this.editedBus = { ...bus };
  }

  cancelEdit(): void {
    this.editingBusId = null;
    this.editedBus = {};
  }

  async saveBus(bus: BusModel) {
    if (this.editingBusId !== bus.id) { return; }

    const updatedBus: BusModel = { ...bus, ...this.editedBus };
    this.savingBusId = bus.id;

    this.busService.updateBus(bus.id, updatedBus).subscribe({
      next: (result) => {
        const savedBus = result ?? updatedBus;
        this.busList = this.busList?.map(b => b.id === bus.id ? savedBus : b);
        this.editingBusId = null;
        this.editedBus = {};
        this.savingBusId = null;
        this.router.navigate(["/bus-view"]);
        this.notification.showSuccess('Success', `Bus updated succesfully, please refresh the page`);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while updating bus');
        this.savingBusId = null;
      }
    });
  }
}
