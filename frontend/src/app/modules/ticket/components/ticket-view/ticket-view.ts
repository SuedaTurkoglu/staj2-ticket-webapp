import {Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DatePipe } from '@angular/common';
import {Card} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {ClassNames} from 'primeng/classnames';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {DataView} from 'primeng/dataview';
import {FormsModule} from '@angular/forms';
import {NotificationService} from '../../../../shared/notification/notification.service';
import {ConfirmationService, PrimeIcons} from 'primeng/api';
import {TicketService} from '../../service/ticket.service';
import {HttpErrorResponse} from '@angular/common/http';
import { Calendar } from '@primeicons/angular/calendar';
import { ArrowRight } from '@primeicons/angular/arrow-right';
import { Inbox } from '@primeicons/angular/inbox';
import { ExclamationTriangle } from '@primeicons/angular/exclamation-triangle';
import {TicketCardModel} from '../../model/ticket-card.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ticket-view',
  standalone: true,
  providers: [ConfirmationService],
  imports: [CommonModule, Card, DatePipe, ButtonDirective, ExclamationTriangle, Calendar, Inbox, ArrowRight, ClassNames, ConfirmDialog, Dialog, DataView, FormsModule],
  template: `
    <div class="view-page-header">
      <div>
        <span class="view-page-title">Tickets</span>
        <p class="view-page-subtitle">{{ totalElements }} elements found
          <br>{{ ticketList?.length }} ticket{{ ticketList?.length === 1 ? '' : 's' }} shown</p>
      </div>
    </div>

    <p-dataview
      [value]="ticketList"
      [paginator]="true"
      [rows]="12"
      [totalRecords]="totalElements"
      [lazy]="true"
      (onLazyLoad)="onPageChange($event)"
      [loading]="loading()"
    >
      <ng-template #list let-items>
        <div class="view-grid" style="position: relative">
          @for (ticket of items; track ticket.ticketId) {
            <p-card pClass="ticket-stub-card" style="border-left: 5px solid var(--p-blue-100)">

              <div class="ticket-stub">

                <div class="ticket-stub-main">
                  <div class="ticket-stub-header">
                    <div>
                      <span class="ticket-seat-badge">Seat {{ ticket.seatNum }}</span>
                      <div style="margin-top: 0.5rem">
                        <svg data-p-icon="calendar" style="width: 1rem; height: 1rem; margin-bottom: -0.15rem"/>
                        <span> {{ ticket.startDate | date: 'mediumDate' }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="ticket-id">Ticket #{{ ticket.ticketId }}</div>
                    </div>
                  </div>

                  <div class="ticket-route ticket-route-summary">
                    <div class="ticket-route-point">
                      <span class="ticket-route-label">{{ firstStation(ticket)?.station?.city }} - {{ firstStation(ticket)?.station?.district }}</span>
                      <span class="ticket-route-value">{{ firstStation(ticket)?.time | slice:0:-3 }}</span>
                    </div>
                    <div class="ticket-route-arrow">
                      <svg data-p-icon="arrow-right"></svg>
                    </div>
                    <div class="ticket-route-point">
                      <span class="ticket-route-label">{{ lastStation(ticket)?.station?.city }} - {{ lastStation(ticket)?.station?.district }}</span>
                      <span class="ticket-route-value">{{ lastStation(ticket)?.time | slice:0:-3 }}</span>
                    </div>
                  </div>

                  <div class="ticket-divider-dashed"></div>

                  <button
                    pButton
                    type="button"
                    class="ticket-details-btn"
                    (click)="openDetails(ticket)"
                  >See Details</button>
                </div>

                <div class="ticket-stub-perforation"></div>

                <div class="ticket-stub-side">
                  <span class="ticket-price-label">Price</span>
                  <span class="ticket-price-value">\${{ ticket.priceCalculated }}</span>

                  @if (editingTicketId !== ticket.ticketId && ticket.startDate > (today | date: 'yyyy-MM-dd')!) {
                    <button
                      pButton
                      class="ticket-return-btn"
                      type="button"
                      (click)="requestReturnTicket($event, ticket)"
                      [disabled]="editingTicketId !== null"
                    >
                      Request Return
                    </button>
                    <p-confirmdialog id="dialog" [visible]="showConfirm" (onHide)="showConfirm = false">
                      <svg data-p-icon="exclamation-triangle"/>
                    </p-confirmdialog>
                  }
                </div>

              </div>

            </p-card>
          }
        </div>
      </ng-template>

      <ng-template #empty>
        <div class="view-empty">
          <svg data-p-icon="inbox"/>
          <p>No tickets to show yet.</p>
        </div>
      </ng-template>
    </p-dataview>

    <p-dialog
      [(visible)]="showDetailsDialog"
      [modal]="true"
      [dismissableMask]="true"
      [draggable]="false"
      [style]="{ width: '440px' }"
      styleClass="ticket-details-dialog"
      [header]="'Ticket #' + (selectedTicket?.ticketId ?? '')"
    >
      @if (selectedTicket) {
        <div class="dialog-passenger">
          <span class="dialog-section-label">Passenger</span>
          <div class="dialog-passenger-name">
            {{ selectedTicket.passengerName }} {{ selectedTicket.passengerSurname }}
          </div>
          <span class="ticket-seat-badge">Seat {{ selectedTicket.seatNum }}</span>
        </div>

        <div class="ticket-divider-dashed"></div>

        <span class="dialog-section-label">Route</span>
        <div class="dialog-route">
          @for (item of selectedTicket.stationTimes; track item.station.city) {
            <div class="dialog-route-item">
              <div class="dialog-route-dot" [class.dialog-route-dot-end]="$last"></div>
              <div class="dialog-route-info">
                <span class="dialog-route-station">#{{ $index + 1 }} {{ item.station.city }} - {{ item.station.district }}</span>
                <span class="dialog-route-time">{{ item.time | slice:0:-3 }}</span>
              </div>
            </div>
          }
        </div>

        <div class="ticket-divider-dashed"></div>

        <div class="dialog-price-row">
          <span class="dialog-section-label" style="margin-bottom: 0">Total Price</span>
          <span class="ticket-price-value" style="margin-bottom: 0">\${{ selectedTicket.priceCalculated }}</span>
        </div>
      }
    </p-dialog>
  `,
  styles: [`
    :host ::ng-deep .ticket-stub-card .p-card-body {
      padding: 0 !important;
    }

    :host ::ng-deep .ticket-stub-card .p-card-content {
      padding: 0 !important;
    }

    .ticket-stub {
      display: flex;
      align-items: stretch;
      min-height: 190px;
    }

    .ticket-stub-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.25rem 1.25rem 1rem;
      min-width: 0;
    }

    .ticket-stub-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .ticket-seat-badge {
      display: inline-block;
      background: var(--p-primary-50);
      color: var(--p-primary-600);
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      padding: 0.25rem 0.625rem;
      border-radius: 8px;
      width: 4.5rem;
    }

    .ticket-id {
      margin-top: 0.375rem;
      font-family: 'Courier New', monospace;
      font-size: 0.8125rem;
      font-weight: 700;
      color: var(--p-surface-500, #6b7280);
      letter-spacing: 0.5px;
    }

    .ticket-route {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      flex-wrap: wrap;
      margin-top: 1.25rem;
    }

    .ticket-route-summary {
      margin-top: 0.5rem;
      margin-bottom: 1rem;
    }

    .ticket-route-point {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      min-width: 0;
    }

    .ticket-route-label {
      font-size: 1rem;
      font-weight: 700;
      color: var(--p-surface-800, #1f2937);
    }

    .ticket-route-value {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--p-surface-500, #9ca3af);
    }

    .ticket-route-arrow {
      display: flex;
      align-items: center;
      color: var(--p-primary-500, #f76902);
    }

    .ticket-route-arrow svg {
      width: 16px;
      height: 16px;
    }

    .ticket-divider-dashed {
      border-top: 1px dashed var(--p-surface-200, #e5e7eb);
      margin: 1.125rem 0 0.875rem;
    }

    .ticket-details-btn {
      width: 10%;
      justify-content: center;
      font-size: 0.8rem !important;
      background: var(--p-primary-500);
      opacity: 0.9;
    }

    .ticket-stub-perforation {
      position: relative;
      width: 0;
      border-left: 2px dashed var(--p-surface-200, #e5e7eb);
      margin: 0.75rem 0;
    }

    .ticket-stub-perforation::before,
    .ticket-stub-perforation::after {
      content: '';
      position: absolute;
      left: -9px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--p-surface-50, #f8f9fa);
    }

    .ticket-stub-perforation::before { top: -0.75rem; }
    .ticket-stub-perforation::after { bottom: -0.75rem; }

    .ticket-stub-side {
      flex: 0 0 148px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1.25rem 1rem;
      text-align: center;
      background: linear-gradient(165deg, var(--p-blue-50, #e8e9fb) 0%, var(--p-primary-50, #fff0e6) 100%);
    }

    .ticket-price-label {
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--p-surface-500, #6b7280);
    }

    .ticket-price-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--p-primary-500, #f76902);
      margin-bottom: 0.5rem;
    }

    .ticket-return-btn {
      width: 100%;
      justify-content: center;
      font-size: 0.75rem !important;
      white-space: normal;
      line-height: 1.2;
    }

    @media (max-width: 560px) {
      .ticket-stub {
        flex-direction: column;
      }

      .ticket-stub-perforation {
        width: auto;
        height: 0;
        border-left: none;
        border-top: 2px dashed var(--p-surface-200, #e5e7eb);
        margin: 0 0.75rem;
      }

      .ticket-stub-perforation::before,
      .ticket-stub-perforation::after {
        top: -9px;
        left: auto;
        width: 18px;
        height: 18px;
      }

      .ticket-stub-perforation::before { left: -0.75rem; }
      .ticket-stub-perforation::after { right: -0.75rem; left: auto; }

      .ticket-stub-side {
        flex: none;
        flex-direction: row;
        justify-content: space-between;
        padding: 0.875rem 1.25rem;
      }
    }

    :host ::ng-deep .ticket-details-dialog .p-dialog-header {
      background: linear-gradient(165deg, var(--p-blue-500) 10%, var(--p-primary-400) 90%);
      color: #ffffff;
      border-radius: 6px 6px 0 0;
      height: 4.2rem;
    }

    :host ::ng-deep .ticket-details-dialog .p-dialog-header .p-dialog-title {
      font-weight: 700;
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
    }

    :host ::ng-deep .ticket-details-dialog .p-dialog-header-icon {
      color: #ffffff;
    }

    :host ::ng-deep .ticket-details-dialog {
      border-radius: 12px;
      overflow: hidden;
    }

    .dialog-section-label {
      display: block;
      font-size: 0.6875rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--p-surface-400, #9ca3af);
      margin: 0.4rem 0 0.1rem 0;
    }

    .dialog-passenger {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .dialog-passenger-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--p-surface-800, #1f2937);
    }

    .dialog-route {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-top: 0.5rem;
    }

    .dialog-route-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      position: relative;
      padding-bottom: 0.75rem;
    }

    .dialog-route-item:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 4px;
      top: 14px;
      bottom: 0;
      width: 2px;
      height: 2rem;
      background: var(--p-surface-200, #e5e7eb);
    }

    .dialog-route-dot {
      width: 10px;
      height: 10px;
      min-width: 10px;
      border-radius: 50%;
      background: var(--p-primary-500, #f76902);
      margin-top: 6px;
      z-index: 2;
    }

    .dialog-route-dot-end {
      background: var(--p-blue-500, #1e22aa);
    }

    .dialog-route-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      gap: 0.75rem;
    }

    .dialog-route-station {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--p-surface-800, #1f2937);
    }

    .dialog-route-time {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--p-surface-500, #6b7280);
      white-space: nowrap;
    }

    .dialog-price-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `]
})

export class TicketView implements OnInit {
  today = new Date();
  private ticketService = inject(TicketService);
  private notification = inject(NotificationService);
  private router = inject(Router);
  totalElements = 0;
  ticketList?: TicketCardModel[];
  loading = signal(true);

  editingTicketId: number | null = null;

  showConfirm = false;
  private confirmationService = inject(ConfirmationService);

  showDetailsDialog = false;
  selectedTicket: TicketCardModel | null = null;

  ngOnInit(): void {
    // const state = history.state;
  }

  onPageChange(event: any) {
    this.loadTickets(event.first, event.first + event.rows);
  }

  private loadTickets(pageFirst: number, pageLast: number): void {
    this.loading.set(true);
    this.ticketService.getAllMyTickets(pageFirst, pageLast).subscribe({ //gets the CURRENT USER's ticket list
      next: (data) => {
        this.ticketList = data.content;
        this.totalElements = data.totalElements;
        this.loading.set(false);
      },
      error: (err) => {
        this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while loading ticket list');
        this.loading.set(false);
      }
    });
  }

  firstStation(ticket: TicketCardModel) {
    return ticket.stationTimes?.[0];
  }

  lastStation(ticket: TicketCardModel) {
    return ticket.stationTimes?.[ticket.stationTimes.length - 1];
  }

  openDetails(ticket: TicketCardModel): void {
    this.selectedTicket = ticket;
    this.showDetailsDialog = true;
  }

  requestReturnTicket(event: any, ticket: TicketCardModel) {
    this.showConfirm = true;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'You are trying to return this ticket of yours.<br>Do you want to give up from this journey?',
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
        this.ticketService.deleteTicket(ticket.ticketId).subscribe({next: () => {
            this.router.navigate(["/ticket-view"]);
            this.notification.showSuccess('Success', 'Ticket returned succesfully, please refresh the page');
          }, error: (err: HttpErrorResponse) => {
            this.notification.showHttpError(err, err.error?.message ?? 'Something went wrong while returning ticket');
          }});
      },
      reject: () => {
        this.notification.showInfo('Info', `Operation cancelled`);
      }
    });
  }

}
