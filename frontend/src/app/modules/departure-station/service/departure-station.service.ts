import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DepartureStationModel} from '../model/departure-station.model';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonConvert} from 'json2typescript';

@Injectable({providedIn: 'root'})
export class DepartureStationService {

  private http = inject(HttpClient);

  getListDepartureStations(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<DepartureStationModel>>(`/departure-station/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getDepartureStationById(DepartureStationId: number){
    return this.http.get<DepartureStationModel>(`/departure-station/${DepartureStationId}`);
  }

  createDepartureStation(departureStation: DepartureStationModel){
    return this.http.post<DepartureStationModel>(`/departure-station`, new JsonConvert().serialize(departureStation, DepartureStationModel));
  }

  updateDepartureStation(DepartureStationId: number, departureStation: DepartureStationModel){
    return this.http.put<DepartureStationModel>(`/departure-station/${DepartureStationId}`, new JsonConvert().serialize(departureStation, DepartureStationModel));
  }

  deleteDepartureStation(DepartureStationId: number){
    return this.http.delete<DepartureStationModel>(`/departure-station/${DepartureStationId}`);
  }

}
