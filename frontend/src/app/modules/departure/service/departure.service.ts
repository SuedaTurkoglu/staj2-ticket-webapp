import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DepartureModel} from '../model/departure.model';
import {JsonConvert} from 'json2typescript';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';
import {DepartureCardModel} from '../model/departure-card.model';

@Injectable({providedIn: 'root'})
export class DepartureService {

  private http = inject(HttpClient);
  serializer = new JsonConvert();

  getListDepartures(pageFirst: number, pageLast: number){
    return this.http.get<PageResponse<DepartureModel>>(`/departure/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getAllMyDepartures(pageFirst: number, pageLast: number){
    return this.http.get<PageResponse<DepartureModel>>(`/departure/load-my-departures`, {params: {first: pageFirst, last: pageLast}});
  }

  getDepartureById(departureId: number){
    return this.http.get<DepartureModel>(`/departure/${departureId}`);
  }

  createDeparture(departure: DepartureModel) {
    const serialized: DepartureModel = new JsonConvert().serialize(departure, DepartureModel);
    serialized.date = new JsonDateConverter().serializeToLocalDate(departure.date) as any;

    return this.http.post<DepartureModel>(`/departure`, serialized);
  }

  updateDeparture(departureId: number, departure: DepartureModel){
    return this.http.put<DepartureModel>(`/departure/${departureId}`, this.serializer.serialize(departure, DepartureModel));
  }

  deleteDeparture(departureId: number){
    return this.http.delete<DepartureModel>(`/departure/${departureId}`);
  }

  getListFilteredDepartures(startStationId: number, endStationId: number, date: Date, passenger: number) {
    return this.http.get<DepartureCardModel[]>(`/departure/search`, {params:
        {startStationId: startStationId, endStationId: endStationId, date: new JsonDateConverter().serializeToLocalDate(date), passenger: passenger }});
  }

  // getPricingProperty(departureId: number, startStationId: number, endStationId: number) {
  //   return this.http.get<Number[]>(`/departure/pricing`, {params:
  //       {departureId: departureId, startStationId: startStationId, endStationId: endStationId}});
  // }
  //
  // getTimeProperty(departureId: number, startStationId: number, endStationId: number) {
  //   return this.http.get<Date[]>(`/departure/time`, {params:
  //       {departureId: departureId, startStationId: startStationId, endStationId: endStationId}});
  // }
  //
  // getDateProperty(departureId: number, startStationId: number) {
  //   return this.http.get<Date>(`/departure/date`, {params: {departureId: departureId, startStationId: startStationId}});
  // }
  //
  // getSeatProperty(departureId: number, startStationId: number, endStationId: number) {
  //   return this.http.get<Map<number, boolean>>(`/departure/seat`, {params: {departureId: departureId, startStationId: startStationId, endStationId: endStationId}});
  // }

}
