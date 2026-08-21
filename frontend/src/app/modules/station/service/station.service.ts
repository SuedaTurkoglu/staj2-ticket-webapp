import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StationModel} from '../model/station.model';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonConvert} from 'json2typescript';

@Injectable({providedIn: 'root'})
export class StationService {

  private http = inject(HttpClient);

  getListStations(pageFirst:number, pageLast:number){
    return this.http.get<PageResponse<StationModel>>(`/station/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getStationById(stationId: number){
    return this.http.get<StationModel>(`/station/${stationId}`);
  }

  createStation(station: StationModel){
    return this.http.post<StationModel>(`/station`, new JsonConvert().serialize(station, StationModel));
  }

  updateStation(stationId: number, station: StationModel){
    return this.http.put<StationModel>(`/station/${stationId}`, new JsonConvert().serialize(station, StationModel));
  }

  deleteStation(stationId: number){
    return this.http.delete<StationModel>(`/station/${stationId}`);
  }

}
