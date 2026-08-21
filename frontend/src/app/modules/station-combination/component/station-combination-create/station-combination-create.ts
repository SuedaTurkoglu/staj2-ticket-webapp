import {Component, inject, OnInit} from '@angular/core';
import {StationCombinationService} from '../../service/station-combination.service';
import {StationCombinationModel} from '../../model/station-combination.model';
import {CardModule} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {KeyFilter} from 'primeng/keyfilter';
import {SelectModule} from 'primeng/select';
import {StationService} from '../../../station/service/station.service';
import {StationModel} from '../../../station/model/station.model';
import {ClassNames} from 'primeng/classnames';
import {ScrollerOptions} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../../../shared/notification/notification.service';

@Component({
  selector: 'app-station-combination-create',
  standalone: true,
  imports: [CardModule, ReactiveFormsModule, InputText, ButtonDirective, KeyFilter, SelectModule, FormsModule, ClassNames],
  template: `
    <div class="flex justify-center p-4">
      <p-card pClass="max-w-md w-full" header="Add Station Combination">
        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">

          <div class="search-field">
            <label class="app-form-label">Start Station</label>
            <p-select
              [options]="stationList"
              formControlName="stationAId"
              optionLabel="displayName"
              optionValue="id"
              placeholder="Select station"
              [filter]="true"
              filterBy="displayName"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              [style]="{ width: '20%' }"
              [virtualScroll]="true" [virtualScrollItemSize]="32" [virtualScrollOptions]="stationScrollerOptions"
              required
            />
          </div>
          @if (formGroup.controls.stationAId.value === 0 && formGroup.controls.stationAId.touched) {
            <p class="form-invalid .ng-invalid.ng-touched">Station selection is required</p>
          }
          <div class="search-field">
            <label class="app-form-label">End Station</label>
            <p-select
              [options]="stationList"
              formControlName="stationBId"
              optionLabel="displayName"
              optionValue="id"
              placeholder="Select station"
              [filter]="true"
              filterBy="displayName"
              filterMatchMode="contains"
              [resetFilterOnHide]="true"
              [style]="{ width: '20%' }"
              [virtualScroll]="true"
              [virtualScrollItemSize]="32"
              [virtualScrollOptions]="stationScrollerOptions"
              required
            />
          </div>
          @if (formGroup.controls.stationBId.value === 0 && formGroup.controls.stationBId.touched) {
            <p class="form-invalid .ng-invalid.ng-touched">Station selection is required</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Distance</label>
            <input
              pInputText
              type="number"
              pKeyFilter="int"
              min="1"
              placeholder="km"
              formControlName="distance"
            />
          </div>
          @if (formGroup.controls.distance.invalid && (formGroup.controls.distance.dirty || formGroup.controls.distance.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter positive value for km</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Duration</label>
            <input
              pInputText
              type="number"
              pKeyFilter="int"
              min="1"
              placeholder="minutes"
              formControlName="duration"
            />
          </div>
          @if (formGroup.controls.duration.invalid && (formGroup.controls.duration.dirty || formGroup.controls.duration.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter positive value for minutes</p>
          }
          <div class="flex justify-end gap-2 pt-2">
            <button pButton class="p-button-brand-search" type="submit" [disabled]="formGroup.invalid">
              Save
            </button>
          </div>
        </form>
      </p-card>
    </div>
  `
})

export class StationCombinationCreate implements OnInit {
  stationCombinationService = inject(StationCombinationService);
  stationService = inject(StationService);
  private notification = inject(NotificationService);

  stationList: StationModel[] = [];

  private last = 50;
  stationScrollerOptions: ScrollerOptions = {
    delay: 200,
    showLoader: true,
    lazy: true,
    onLazyLoad: this.stationOnLazyLoad.bind(this)
  };

  ngOnInit(): void {
    this.stationOnLazyLoad({first: 0, last:this.last});
  }

  stationOnLazyLoad(event: any) {
    this.stationService.getListStations(event.first, event.first + this.last).subscribe({
      next: data => {
        this.stationList = data.content;
        for (let station of this.stationList) {
          (station as any).displayName = `${station.city} - ${station.district}`;
        }
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading sttaion list');
      }
    });
  }

  stationValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const start = formGroup.get('stationAId')?.value;
      const end = formGroup.get('stationBId')?.value;
      return start && end && start === end ? { stationsIdentical: true } : null; //null and identical check
    };
  }

  formGroup = new FormGroup({
    stationAId: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    stationBId: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    distance: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    duration: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(1)]})
  }, {validators: this.stationValidator()});


  onSubmit() {
    this.stationCombinationService
      .createStationCombination(this.formGroup.value as any as StationCombinationModel).subscribe({next: (data) => {
        this.notification.showSuccess('Success', `Station combination created with id: ${data.id}`);
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating station combination');
      }
    });
  }
}
