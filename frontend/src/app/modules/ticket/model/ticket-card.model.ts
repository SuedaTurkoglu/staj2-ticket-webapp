import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';
import {StationTimeEntry} from './station-time-entry';

@JsonObject("TicketCard")
export class TicketCardModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("ticketId", Number, true)
  ticketId: number = 0;

  @JsonProperty("startDate", JsonDateConverter, true)
  startDate: Date | null = null;

  @JsonProperty("priceCalculated", Number, true)
  priceCalculated: number = 0;

  @JsonProperty("seatNum", Number, true)
  seatNum: number = 0;

  @JsonProperty("stationTimes", [StationTimeEntry], true)
  stationTimes: StationTimeEntry[] = [];

  @JsonProperty("passengerTckn", Number, true)
  passengerTckn: number = 0;

  @JsonProperty("passengerName", String, true)
  passengerName: string = "";

  @JsonProperty("passengerSurname", String, true)
  passengerSurname: string = "";

}
