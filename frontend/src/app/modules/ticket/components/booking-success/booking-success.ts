import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Card} from 'primeng/card';
import {ButtonDirective} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {TicketModel} from '../../model/ticket.model';
import {StyleClass} from 'primeng/styleclass';
import { Check } from '@primeicons/angular/check';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, Card, ButtonDirective, RouterLink, StyleClass, Check],
  template: `
    <div class="auth-page">
      <div class="auth-card-wrap" style="max-width: 520px">

        <div class="auth-badge">
          <svg data-p-icon="check" color="#ffffff"/>
        </div>

        <p-card pStyleClass="auth-card">
          <div class="auth-head">
            <h1 class="auth-title">Booking confirmed</h1>
            <p class="auth-subtitle">
              {{ tickets.length }} ticket{{ tickets.length === 1 ? '' : 's' }} booked for
              {{ ticketProperty?.queryStartStationName }} &rarr; {{ ticketProperty?.queryEndStationName }}
            </p>
          </div>

          @if (tickets.length > 0) {
            <div class="success-ticket-list">
              @for (ticket of tickets; track ticket.id) {
                <div class="success-ticket-row">
                  <div class="success-ticket-seat">
                    <span class="checkout-seat-badge">Seat {{ ticket.seatId }}</span>
                    <span class="success-ticket-id">Ticket #{{ ticket.id }}</span>
                  </div>

                  <div class="success-ticket-meta">
                    <span class="success-ticket-date">{{ ticketProperty?.queryStartDate }}</span>
                    <span class="success-ticket-time">{{ ticketProperty?.queryStartTime }} &ndash; {{ ticketProperty?.queryEndTime }}</span>
                  </div>

                  <div class="success-ticket-passenger">
                    {{ ticket.passengerName }} {{ ticket.passengerSurname }}
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="success-empty">No ticket information available for this booking.</p>
          }

          <div class="success-actions">
            <a pButton routerLink="/" class="p-button-search success-home">Back to Home</a>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`

    .success-ticket-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      margin-top: 1rem;
    }

    .success-ticket-row {
      border-left: 4px solid var(--p-primary-500, #f76902);
      background: var(--p-surface-50, #f8f9fa);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .success-ticket-seat {
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }

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

    .success-ticket-id {
      font-size: 0.8125rem;
      color: var(--p-surface-500, #6b7280);
    }

    .success-ticket-meta {
      display: flex;
      flex-direction: column;
      font-size: 0.8125rem;
      color: var(--p-surface-600, #4b5563);
      text-align: right;
    }

    .success-ticket-passenger {
      flex-basis: 100%;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--p-surface-800, #1f2937);
    }

    .success-empty {
      text-align: center;
      color: var(--p-surface-500, #6b7280);
      margin-bottom: 1.5rem;
    }

    .success-actions {
      display: flex;
      justify-content: center;
    }

    .success-home {
      text-decoration: none;
      color: #ffffff;
    }

    @keyframes successFadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes successPop {
      0%   { transform: translateX(-50%) scale(0.4); opacity: 0; }
      100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }

    @media (max-width: 480px) {
      .success-ticket-row { flex-direction: column; align-items: flex-start; }
      .success-ticket-meta { text-align: left; }
    }
  `]
})
export class BookingSuccess implements OnInit {
  tickets: TicketModel[] = [];
  ticketProperty: any;
  private router = inject(Router);

  ngOnInit(): void {
    const state = history.state;

    if (state?.tickets?.length) {
      this.tickets = state.tickets;
      this.ticketProperty = state.ticketProperty;
    } else {
      // direct visit or page refresh with no booking data available, directs home
      this.router.navigate(['/']);
    }
  }
}
