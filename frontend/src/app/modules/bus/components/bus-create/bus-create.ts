import {Component, inject} from '@angular/core';
import {BusService} from '../../service/bus.service';
import {BusModel} from '../../model/bus.model';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {KeyFilter} from 'primeng/keyfilter';
import {ClassNames} from 'primeng/classnames';
import {MessageModule} from 'primeng/message';
import { NotificationService } from '../../../../shared/notification/notification.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-bus-create',
  standalone: true,
  imports: [Card, ReactiveFormsModule, InputText, ButtonDirective, KeyFilter, ClassNames, MessageModule],
  template: `
    <div class="flex justify-center p-4">
      <p-card pClass="max-w-md w-full" header="Add Bus">

        <form [formGroup]="formGroup" (ngSubmit)="onSubmit()" class="flex flex-column gap-4">
          <div class="flex flex-col gap-2">
            <label class="app-form-label">Plate</label>
            <input
              pInputText
              placeholder="e.g. 07 ABC 123"
              formControlName="plate"
            />
            @if (formGroup.controls.plate.invalid && (formGroup.controls.plate.dirty || formGroup.controls.plate.touched)) {
              <p class="form-invalid">Enter in plate format</p>
            }
          </div>

          <div class="flex flex-col gap-2">
            <label class="app-form-label">Capacity</label>
            <input
              pInputText
              type="number"
              pKeyFilter="int"
              min="1"
              placeholder="e.g. 46"
              formControlName="capacity"
            />
          </div>
          @if (formGroup.controls.capacity.invalid && (formGroup.controls.capacity.dirty || formGroup.controls.capacity.touched)) {
            <p class="form-invalid .ng-invalid.ng-touched">Enter positive value</p>
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

export class BusCreate {
  busService = inject(BusService);
  private notification = inject(NotificationService);

  formGroup = new FormGroup({
    plate: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(0[1-9]|[1-7][0-9]|8[0-1])\s?[A-Za-z]{1,3}\s?(\d{2,4})$/)] }),
    capacity: new FormControl(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] })
  });

  onSubmit() {
    this.busService.createBus(this.formGroup.value as any as BusModel).subscribe({next: (data) => {
        this.notification.showSuccess('Success', `Bus created with id: ${data.id}`);
      }, error: (err: HttpErrorResponse) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating bus');
      }
    });
  }

}
