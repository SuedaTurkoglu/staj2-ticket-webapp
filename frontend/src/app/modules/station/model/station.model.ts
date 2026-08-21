import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Station")
export class StationModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("city", String, true)
  city: string = "";

  @JsonProperty("district", String, true)
  district: string = "";

  @JsonProperty("coordinate", String, true)
  coordinate: string = "";

}
