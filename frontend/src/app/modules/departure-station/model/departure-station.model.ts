import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Departure-Station")
export class DepartureStationModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("stationId", Number, true)
  stationId: number = 0;

  @JsonProperty("departureId", Number, true)
  departureId: number = 0;

  @JsonProperty("orderInRoute", Number, true)
  orderInRoute: number = 0;

  @JsonProperty("date", JsonDateConverter, true)
  date: Date | null = null;
}
