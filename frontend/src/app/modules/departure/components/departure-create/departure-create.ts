import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {ButtonDirective} from 'primeng/button';
import {KeyFilter} from 'primeng/keyfilter';
import {DepartureService} from '../../service/departure.service';
import {DepartureModel} from '../../model/departure.model';
import {DatePickerModule } from 'primeng/datepicker';
import {ClassNames} from 'primeng/classnames';
import {BusService} from '../../../bus/service/bus.service';
import {UserService} from '../../../user/service/user.service';
import {StationService} from '../../../station/service/station.service';
import {BusModel} from '../../../bus/model/bus.model';
import {StationModel} from '../../../station/model/station.model';
import {SelectModule} from 'primeng/select';
import {StyleClass} from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import {ScrollerOptions} from 'primeng/api';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserResponseModel} from '../../../user/model/user-response.model';

@Component({
  selector: 'app-departure-create',
  standalone: true,
  imports: [Card, ReactiveFormsModule, InputText, ButtonDirective, KeyFilter, DatePickerModule , ClassNames, DividerModule, SelectModule , StyleClass],
  template: `
    <div class="flex justify-center p-4">
      <p-card pClass="max-w-md w-full" header="Create Departure">

        <form [formGroup]="formGroupDeparture" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Departure Date</label>
            <p-datepicker
              [showIcon]="true"
              [minDate]="today"
              dateFormat="dd M yy"
              [style]="{ width: '20%' }"
              pStyleClass="w-full"
              formControlName="date"
            />
          </div>
          @if (formGroupDeparture.controls.date.invalid && (formGroupDeparture.controls.date.dirty || formGroupDeparture.controls.date.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter in date format</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Time</label>
            <input
              pInputText
              placeholder="00:00"
              formControlName="time"
            />
          </div>
          @if (formGroupDeparture.controls.time.invalid && (formGroupDeparture.controls.time.dirty || formGroupDeparture.controls.time.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter in time format</p>
          }
          <div class="search-field">
            <label class="app-form-label">Bus</label>
            <p-select
              [options]="busList"
              optionLabel="displayProperty"
              optionValue="id"
              placeholder="Select Bus"
              [filter]="true"
              filterBy="displayProperty"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              formControlName="busId"
              [style]="{ width: '20%' }"
              [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="busScrollerOptions"
              required
            />
          </div>
          @if (formGroupDeparture.controls.busId.value === 0 && (formGroupDeparture.controls.busId.dirty || formGroupDeparture.controls.busId.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Bus selection is required</p>
          }
          <div class="search-field">
            <label class="app-form-label">Driver</label>
            <p-select
              [options]="userList"
              optionLabel="displayProperty"
              optionValue="id"
              placeholder="Select Driver"
              [filter]="true"
              filterBy="displayProperty"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              formControlName="driverId"
              [style]="{ width: '20%' }"
              [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="userScrollerOptions"
              required
            />
          </div>
          @if (formGroupDeparture.controls.driverId.value === 0 && (formGroupDeparture.controls.driverId.dirty || formGroupDeparture.controls.driverId.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Driver selection is required</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Base Price</label>
            <input
              pInputText
              type="number"
              pKeyFilter="int"
              min="1"
              placeholder="0 TL"
              formControlName="basePrice"
            />
          </div>
          @if (formGroupDeparture.controls.basePrice.invalid && (formGroupDeparture.controls.basePrice.dirty || formGroupDeparture.controls.basePrice.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter positive value</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Price Per Kilometer</label>
            <input
              pInputText
              type="number"
              pKeyFilter="int"
              min="1"
              placeholder="0 TL"
              formControlName="pricePerKm"
            />
          </div>
          @if (formGroupDeparture.controls.pricePerKm.invalid && (formGroupDeparture.controls.pricePerKm.dirty || formGroupDeparture.controls.pricePerKm.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter positive value</p>
          }

          <p-divider />

          <div class="flex flex-column gap-3" formArrayName="stationIds">
            <label class="app-form-label">Stations (in order)</label>

            @for (stc of stationControls; track $index) {
              <div class="flex gap-2 align-items-center">
                <span class="station-order-badge" style="margin-right: 1rem">{{ $index + 1 }}</span>

                  <p-select
                    [options]="stationList"
                    optionLabel="displayProperty"
                    optionValue="id"
                    [filter]="true"
                    filterBy="displayProperty"
                    filterMatchMode="contains"
                    [resetFilterOnHide]="true"
                    [placeholder]="$index === 0 ? 'Start station' : ($index === stationControls.length - 1 ? 'End station' : 'Stop ' + ($index + 1))"
                    [formControlName]="$index"
                    [style]="{ width: '20%', marginBottom: '0.5rem'}"
                    [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
                    required
                  />

                  @if (stationControls.length > 2) {
                    <button
                      pButton
                      type="button"
                      class=".p-button-secondary-blue"
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

            <div class="flex justify-end gap-2 pt-2">
              <button pButton class="p-button-brand-search" type="submit" [disabled]="formGroupDeparture.invalid">
                Save
              </button>
            </div>
        </form>

      </p-card>
    </div>
  `,
  styles:`
    .p-button-add {
      background: var(--p-surface-400);
      color: #ffffff;
      border: none;
      font-size: 0.875rem;
      font-weight: 600;
      margin-top: 0.5rem;
      margin-bottom: 1.5rem;
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }
  `
})

export class DepartureCreate implements OnInit{
  departureService = inject(DepartureService);
  busService = inject(BusService);
  busList?: BusModel[];
  userService = inject(UserService);
  userList?: UserResponseModel[];
  stationService = inject(StationService);
  stationList?: StationModel[];
  private notification = inject(NotificationService);

  today = new Date();
  private stationIds: any;
  private last = 50;
  busScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.busOnLazyLoad.bind(this)
  };

  userScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.userOnLazyLoad.bind(this)
  };

  stationScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.stationOnLazyLoad.bind(this)
  };

  ngOnInit(): void {
    this.busOnLazyLoad({first: 0, last:this.last});
    this.userOnLazyLoad({first: 0, last:this.last});
    this.stationOnLazyLoad({first: 0, last:this.last});
  }

  busOnLazyLoad(event: any) {
    this.busService.getListBuses(event.first, event.first + this.last).subscribe({
      next: data => {
            this.busList = data.content;
            for (let bus of this.busList) {
              (bus as any).displayProperty = `${bus.plate} - ${bus.capacity}`;
            }
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading bus list');
      }
    });
  }

  userOnLazyLoad(event:any) {
    this.userService.getListUsers(event.first, event.first + this.last).subscribe({
          next: data => {
            this.userList = data.content.filter(user => user.driver);
            for (let user of this.userList) {
              (user as any).displayProperty = `${user.name} - ${user.surname}`;
            }
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading driver list');
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
      const seen = new Set<any>();
      const duplicates = formGroup.get(this.stationIds)?.value.some((data: any) => {
        if(seen.has(data)) return true;
        seen.add(data);
        return false;
      })
      return duplicates ? { duplicateStations: true } : null;
    };
  }

  formGroupDeparture = new FormGroup({
    date: new FormControl(new Date(), { nonNullable: true, validators: [Validators.required] }),
    time: new FormControl('12:00', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)] }),
    busId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    driverId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    startStationId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    endStationId: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    basePrice: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    pricePerKm: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),

    stationIds: new FormArray<FormControl<number | null>>([
      new FormControl<number | null>(null),
      new FormControl<number | null>(null)
    ])
  }, {validators: this.stationValidator()});

  // contains the stations added with the index (min 2 stations)
  get stationsArray(): FormArray<FormControl<number | null>> {
    return this.formGroupDeparture.controls.stationIds;
  }

  get stationControls(): FormControl<number | null>[] {
    return this.stationsArray.controls;
  }

  addStationField(): void {
    this.stationsArray.push(new FormControl<number | null>(null, { validators: [Validators.required] }));
  }

  removeStationField(index: number): void {
    if (this.stationsArray.length > 2) {
      this.stationsArray.removeAt(index);
    }
  }

  async onSubmit() {
    if (this.formGroupDeparture.invalid || this.stationsArray.invalid) { return; }

    this.stationIds = this.stationsArray.value as number[];
    this.formGroupDeparture.get("startStationId")?.setValue(this.stationIds[0]);
    this.formGroupDeparture.get("endStationId")?.setValue(this.stationIds[this.stationIds.length - 1]);

    this.departureService.createDeparture(this.formGroupDeparture.value as any as DepartureModel).subscribe({next: (data) => {
        this.notification.showSuccess('Success', `Departure created with id: ${data.id}`);
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating departure');
      }
    });
  }

}
