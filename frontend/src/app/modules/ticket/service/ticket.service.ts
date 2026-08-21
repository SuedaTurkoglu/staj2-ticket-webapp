import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TicketModel} from '../model/ticket.model';
import {JsonConvert} from 'json2typescript';
import {PageResponse} from '../../../shared/page/page-response';
import {SeatService} from '../../seat/service/seat.service';
import {DepartureService} from '../../departure/service/departure.service';
import {Observable, switchMap} from 'rxjs';
import {TicketCardModel} from '../model/ticket-card.model';

@Injectable({providedIn: 'root'})
export class TicketService{

  private http = inject(HttpClient);
  private seatService = inject(SeatService);
  private departureService = inject(DepartureService);
  converter = new JsonConvert();

  getListTickets(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<TicketCardModel>>(`/ticket/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getAllMyTickets(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<TicketCardModel>>(`/ticket/load-my-tickets`, {params: {first: pageFirst, last: pageLast}});
  }

  getTicketById(ticketId: number){
    return this.http.get<TicketModel>(`/ticket/${ticketId}`);
  }

  createTicket(ticket: TicketModel): Observable<TicketModel> {
    return this.departureService.getDepartureById(ticket.departureId).pipe(
      switchMap(dp => this.seatService.getSeatBySeatNumAndBusId(ticket.seatId, dp.busId)),
      switchMap(seat => {
        const updatedTicket = {...ticket, seatId: seat.id};

        return this.http.post<TicketModel>('/ticket', this.converter.serialize(updatedTicket, TicketModel));
      })
    );
  }

  updateTicket(ticketId: number, ticket: TicketModel){
    return this.http.put<TicketModel>(`/ticket/${ticketId}`, this.converter.serialize(ticket, TicketModel));
  }

  deleteTicket(ticketId: number){
    return this.http.delete<TicketModel>(`/ticket/${ticketId}`);
  }

}
