import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Ticket")
export class TicketModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("priceCalculated", Number, true)
  priceCalculated: number = 0;

  @JsonProperty("seatId", Number, true)
  seatId: number = 0;

  @JsonProperty("departureId", Number, true)
  departureId: number = 0;

  @JsonProperty("departureStationStartId", Number, true)
  departureStationStartId: number = 0;

  @JsonProperty("departureStationEndId", Number, true)
  departureStationEndId: number = 0;

  @JsonProperty("passengerTckn", Number, true)
  passengerTckn: number = 0;

  @JsonProperty("passengerName", String, true)
  passengerName: string = "";

  @JsonProperty("passengerSurname", String, true)
  passengerSurname: string = "";

  @JsonProperty("userId", Number, true)
  userId: number = 0;
}
