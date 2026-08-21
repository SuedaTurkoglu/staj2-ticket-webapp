import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BusModel} from '../model/bus.model';
import {JsonConvert} from 'json2typescript';
import {PageResponse} from '../../../shared/page/page-response';

@Injectable({providedIn: 'root'})
export class BusService {

  private http = inject(HttpClient);
  private converter = new JsonConvert();

  getListBuses(pageFirst: number, pageLast:number){
    return this.http.get<PageResponse<BusModel>>('/bus/load', {params: {first: pageFirst, last: pageLast}});
      // .pipe(map(data => this.converter.deserialize(data, BusModel)));
  }

  getBusById(busId: number){
    return this.http.get<BusModel>(`/bus/${busId}`);
  }

  createBus(bus: BusModel){
    return this.http.post<BusModel>(`/bus`, this.converter.serialize(bus, BusModel));
  }

  updateBus(busId: number, bus: BusModel){
    return this.http.put<BusModel>(`/bus/${busId}`, this.converter.serialize(bus, BusModel));
  }

  deleteBus(busId: number){
    return this.http.delete<BusModel>(`/bus/${busId}`);
  }

}
