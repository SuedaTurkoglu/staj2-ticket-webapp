import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import {StyleClass} from 'primeng/styleclass';
import { MapMarker } from '@primeicons/angular/map-marker';
import { Calendar } from '@primeicons/angular/calendar';
import {TicketService} from '../../service/ticket.service';
import {TicketModel} from '../../model/ticket.model';
import {InputText} from 'primeng/inputtext';
import {KeyFilter} from 'primeng/keyfilter';
import { ArrowRight } from '@primeicons/angular/arrow-right';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {concatMap, from} from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, Card, ReactiveFormsModule, ArrowRight, MapMarker, Calendar, ButtonDirective, DatePickerModule, DividerModule, SelectModule, StyleClass, InputText, KeyFilter
  ],
  template: `
    <div style="max-width: 1000px; margin: 0 auto; padding: 1.5rem;">

      <div class="view-page-header">
        <div>
          <span class="view-page-title">One Last Step</span>
          <p class="view-page-subtitle">Please fill the information below</p>
        </div>
      </div>

      <form [formGroup]="checkoutForm" (ngSubmit)="onBuy()">
        <div class="view-grid" formArrayName="passengers">
          @for (seat of seatList; track seat; let i = $index) {
            <p-card pStyleClass="ticket-card view-card checkout-ticket-card" [formGroupName]="i">

              <div class="checkout-card-header">
                <div>
                  <span class="checkout-seat-badge">Seat {{ seat }}</span>
                  <div class="brand-text-gradient" style="font-weight: 700; font-size: 1.1rem; margin-top: 0.25rem;">
                    #Details
                  </div>
                </div>

                <div style="flex: 1 1 220px; margin-left: 1rem">
                  <div class="view-card-date" style="font-size: 1rem">
                    <svg data-p-icon="calendar"></svg>
                    <span>{{ ticketProperty.queryStartDate }}</span>
                  </div>
                  <div class="view-card-date mt-1" style="font-size: 1rem">
                    <svg data-p-icon="map-marker"/>
                    <span>{{ ticketProperty.queryStartTime }} &ndash; {{ ticketProperty.queryEndTime }}</span>
                  </div>
                </div>

                <div style="text-align: right; margin-right: 1rem">
                  <div style="font-size: 1.25rem; font-weight: 700; color: var(--p-surface-800);">
                    {{ ticketProperty.queryStartStationName }} &rarr; {{ ticketProperty.queryEndStationName }}
                  </div>
                  <span class="checkout-selected-text">Selected</span>
                </div>
              </div>

              <p-divider></p-divider>

              <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end; margin-left: 0.5rem;">

                <div class="flex flex-col gap-2">
                  <label class="app-form-label">TCKN</label>
                  <input
                    pInputText
                    type="number"
                    pKeyFilter="int"
                    min="1"
                    placeholder="12345678901"
                    formControlName="passengerTckn"
                  />
                  @if (checkoutForm.controls.passengers.at(i).get('passengerTckn')?.invalid &&
                  (checkoutForm.controls.passengers.at(i).get('passengerTckn')?.dirty ||
                    checkoutForm.controls.passengers.at(i).get('passengerTckn')?.touched)) {
                    <p class="form-invalid .ng-invalid.ng-touched" style="margin-left: 3rem">Enter valid TCKN</p>
                  }
                </div>

                <div class="flex flex-col gap-2">
                  <label class="app-form-label">Name</label>
                  <input
                    pInputText
                    placeholder="Your Name"
                    formControlName="passengerName"
                  />
                  @if (checkoutForm.controls.passengers.at(i).get('passengerName')?.invalid &&
                  (checkoutForm.controls.passengers.at(i).get('passengerName')?.dirty ||
                    checkoutForm.controls.passengers.at(i).get('passengerName')?.touched)) {
                    <p class="form-invalid .ng-invalid.ng-touched" style="margin-left: 3.5rem">Name must be at least 3 characters</p>
                  }
                </div>

                <div class="flex flex-col gap-2">
                  <label class="app-form-label">Surname</label>
                  <input
                    pInputText
                    placeholder="Your Surname"
                    formControlName="passengerSurname"
                  />
                  @if (checkoutForm.controls.passengers.at(i).get('passengerSurname')?.invalid &&
                  (checkoutForm.controls.passengers.at(i).get('passengerSurname')?.dirty ||
                    checkoutForm.controls.passengers.at(i).get('passengerSurname')?.touched)) {
                    <p class="form-invalid .ng-invalid.ng-touched" style="margin-left: 4.5rem">Surname must be at least 3 characters</p>
                  }
                </div>

              </div>
            </p-card>
          }
        </div>

        <div class="checkout-submit-row">
          <button
            pButton
            type="submit"
            class="p-button-brand"
            [disabled]="checkoutForm.invalid || loading"
          >Complete Booking
            <svg data-p-icon="arrow-right"/>
          </button>
        </div>
      </form>

    </div>
  `,
  styles: [`
    .checkout-seat-badge {
      display: inline-block;
      background: var(--p-primary-50);
      color: var(--p-primary-600);
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.25rem 0.625rem;
      border-radius: 8px;
    }

    .checkout-submit-row {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .checkout-selected-text {
      display: inline-block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffffff;
      background: linear-gradient(135deg, #9fa3ef 0%, #ff5c33 100%) !important;
      padding: 0.2rem 0.625rem;
      border-radius: 8px;
    }

    .checkout-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-left: 0.5rem;
    }
  `]
})

export class Checkout implements OnInit {
  ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notification = inject(NotificationService);
  loading = false;

  departureId?: Number;
  startStationId?: any;
  endStationId?: any;
  seatList: any[] = [];
  isBooked: boolean = false;
  ticketProperty: any;

  private createdTickets: TicketModel[] = [];

  checkoutForm = new FormGroup({
    passengers: new FormArray<FormGroup>([])
  });

  get passengers(): FormArray<FormGroup> {
    return this.checkoutForm.get('passengers') as FormArray<FormGroup>;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.departureId = Number(params['departureId']);
      this.startStationId = Number(params['startStationId']);
      this.endStationId = Number(params['endStationId']);
      this.seatList = params['seatList'] ? params['seatList'].split(',') : [];
      this.ticketProperty = {
        queryStartStationName: params['startName'] ?? '',
        queryEndStationName: params['endName'] ?? '',
        queryStartTime: params['startTime'],
        queryEndTime: params['endTime'],
        queryStartDate: params['startDate'] ? new Date(params['startDate']).toLocaleDateString('en-GB', {year: 'numeric', month: 'short', day: '2-digit'}) : new Date()
      };

      this.buildForms();
    });
  }

  private buildForms(): void {
    this.passengers.clear();

    for (const seat of this.seatList) {
      //fill the seatNum, departureId, start-endStationId from creation
      //updating the seatNum to seatId before creating the ticket at ticket.service
      //updating the station start-end ids to departureStation ids at the server-side before creation
      this.passengers.push(new FormGroup({
        seatId: new FormControl(seat, { nonNullable: true, validators: [Validators.required] }),
        departureId: new FormControl(this.departureId as number, { nonNullable: true, validators: [Validators.required] }),
        departureStationStartId: new FormControl(this.startStationId as number, { nonNullable: true, validators: [Validators.required] }),
        departureStationEndId: new FormControl(this.endStationId as number, { nonNullable: true, validators: [Validators.required] }),
        passengerTckn: new FormControl(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(11), Validators.maxLength(11)] }),
        passengerName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        passengerSurname: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        userId: new FormControl(1, { nonNullable: true }) // overriding at backend, just a placeholder value to create TicketModel
      }));
    }
  }

  onBuy(): void {
    if (this.checkoutForm.invalid) return;

    this.loading = true;
    this.createdTickets = [];

    from(this.passengers.controls).pipe(
      concatMap((passengerGroup) =>
        this.ticketService.createTicket(passengerGroup.value as any as TicketModel)
      )
    ).subscribe({
      next: (data) => {
        this.createdTickets.push(data);
        this.notification.showSuccess('Success', `Ticket created with id: ${data.id}`);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while creating ticket');
      },
      complete: () => {
        this.loading = false;
        this.isBooked = true;

        this.router.navigate(['/booking-success'], {
          state: {
            tickets: this.createdTickets,
            ticketProperty: this.ticketProperty
          }
        });
      }
    });
  }

}
