import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';
import {StationModel} from '../../station/model/station.model';

@JsonObject("Departure")
export class DepartureModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("date", JsonDateConverter, true)
  date: Date | null = null;

  @JsonProperty("time", String, true)
  time: string = "";

  @JsonProperty("busId", Number, true)
  busId: number = 0;

  @JsonProperty("driverId", Number, true)
  driverId: number = 0;

  @JsonProperty("startStationId", Number, true)
  startStationId: number = 0;

  @JsonProperty("endStationId", Number, true)
  endStationId: number = 0;

  @JsonProperty("basePrice", Number, true)
  basePrice: number = 0;

  @JsonProperty("pricePerKm", Number, true)
  pricePerKm: number = 0;

  @JsonProperty("stationList", [StationModel], true)
  stationList: StationModel[] = [];

  @JsonProperty("stationIds", [Number], true)
  stationIds: Number[] = [];

}
