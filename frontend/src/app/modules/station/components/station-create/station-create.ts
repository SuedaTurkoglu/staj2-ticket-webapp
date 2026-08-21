import {Component, inject} from '@angular/core';
import {StationService} from '../../service/station.service';
import {StationModel} from '../../model/station.model';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-station-create',
  standalone: true,
  imports: [Card, ReactiveFormsModule, InputText, ButtonDirective, ClassNames],
  template: `
    <div class="flex justify-center p-4">
      <p-card pClass="max-w-md w-full" header="Add Station">

        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <div class="flex flex-col gap-2">
            <label class="app-form-label">City</label>
            <input
              pInputText
              placeholder="e.g. Aydın"
              formControlName="city"
            />
          </div>
          @if (formGroup.controls.city.invalid && (formGroup.controls.city.dirty || formGroup.controls.city.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter city</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">District</label>
            <input
              pInputText
              placeholder="e.g. Efeler"
              formControlName="district"
            />
          </div>
          @if (formGroup.controls.district.invalid && (formGroup.controls.district.dirty || formGroup.controls.district.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter district</p>
          }
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Coordinate</label>
            <input
              pInputText
              placeholder="e.g. 37.79728174939079, 27.83998142501733"
              formControlName="coordinate"
              [style]="{ width: '28%' }"
            />
          </div>
          @if (formGroup.controls.coordinate.invalid && (formGroup.controls.coordinate.dirty || formGroup.controls.coordinate.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter in coordinate format</p>
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

export class StationCreate {
  stationService = inject(StationService);
  private notification = inject(NotificationService);

  formGroup = new FormGroup({
    city: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    district: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    coordinate: new FormControl('37.79728174939079, 27.83998142501733', { nonNullable: true, validators:
        [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)] })
  });

  async onSubmit() {
    this.stationService.createStation(this.formGroup.value as any as StationModel).subscribe({next: (data) => {
        this.notification.showSuccess('Success', `Station created with id: ${data.id}`);
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating station');
      }
    });
  }

}
