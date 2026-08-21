import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SeatModel} from '../model/seat.model';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonConvert} from 'json2typescript';

@Injectable({providedIn: 'root'})
export class SeatService {

  private http = inject(HttpClient);

  getListSeats(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<SeatModel>>(`/seat/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getSeatById(seatId: number){
    return this.http.get<SeatModel>(`/seat/${seatId}`);
  }

  getSeatBySeatNumAndBusId(seatNum: number, busId: number){
    return this.http.get<SeatModel>(`/seat/bus`, {params: {seatNum: seatNum, busId: busId}});
  }

  createSeat(seat: SeatModel){
    return this.http.post<SeatModel>(`/seat`, new JsonConvert().serialize(seat, SeatModel));
  }

  updateSeat(seatId: number, seat: SeatModel){
    return this.http.put<SeatModel>(`/seat/${seatId}`, new JsonConvert().serialize(seat, SeatModel));
  }

  deleteSeat(seatId: number){
    return this.http.delete<SeatModel>(`/seat/${seatId}`);
  }

}
