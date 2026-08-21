import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Seat")
export class SeatModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("seatNum", Number, true)
  seatNum: number = 0;

  @JsonProperty("busId", Number, true)
  busId: number = 0;

}
