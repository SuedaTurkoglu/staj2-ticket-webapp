import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StationCombinationModel} from '../model/station-combination.model';
import {PageResponse} from '../../../shared/page/page-response';
import {JsonConvert} from 'json2typescript';

@Injectable({providedIn: 'root'})
export class StationCombinationService {

  private http = inject(HttpClient);

  getListStationCombinations(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<StationCombinationModel>>(`/station-combination/load`, {params: {first: pageFirst, last: pageLast}});
  }

  getStationCombinationById(StationCombinationId: number){
    return this.http.get<StationCombinationModel>(`/station-combination/${StationCombinationId}`);
  }

  createStationCombination(stationCombination: StationCombinationModel){
    return this.http.post<StationCombinationModel>(`/station-combination`, new JsonConvert().serialize(stationCombination, StationCombinationModel));
  }

  updateStationCombination(StationCombinationId: number, stationCombination: StationCombinationModel){
    return this.http.put<StationCombinationModel>(`/station-combination/${StationCombinationId}`, new JsonConvert().serialize(stationCombination, StationCombinationModel));
  }

  deleteStationCombination(StationCombinationId: number){
    return this.http.delete<StationCombinationModel>(`/station-combination/${StationCombinationId}`);
  }

}
