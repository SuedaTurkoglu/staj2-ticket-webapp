import {JsonObject, JsonProperty} from "json2typescript";
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Bus")
export class BusModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("plate", String, true)
  plate: string = "";

  @JsonProperty("capacity", Number, true)
  capacity: number = 0;
}
