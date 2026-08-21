import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';
import {SeatMapConverter} from '../../../shared/converter/seat-map-converter';

@JsonObject("DepartureCard")
export class DepartureCardModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("departureId", Number, true)
  departureId: number = 0;

  @JsonProperty("queryStartDate", JsonDateConverter, true)
  queryStartDate: Date | null = null;

  @JsonProperty("queryStartStationName", String, true)
  queryStartStationName: string = "";

  @JsonProperty("queryEndStationName", String, true)
  queryEndStationName: string = "";

  @JsonProperty("startStationName", String, true)
  startStationName: string = "";

  @JsonProperty("endStationName", String, true)
  endStationName: string = "";

  @JsonProperty("seatLeft", Number, true)
  seatLeft: number = 0;

  @JsonProperty("queryDistance", Number, true)
  queryDistance: number = 0;

  @JsonProperty("queryPrice", Number, true)
  queryPrice: number = 0;

  @JsonProperty("queryDuration", Number, true)
  queryDuration: number = 0;

  @JsonProperty("queryStartTime", String, true)
  queryStartTime: string = '';

  @JsonProperty("queryEndTime", String, true)
  queryEndTime: string = '';

  @JsonProperty("busCapacity", Number, true)
  busCapacity: number = 0;

  @JsonProperty("seatMap", SeatMapConverter, true) // fix any and add custom converter if not works
  seatMap: Record<number, boolean> = {};
}
