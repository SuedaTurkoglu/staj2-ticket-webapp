import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("Station-Combination")
export class StationCombinationModel {

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("stationAId", Number, true)
  stationAId: number = 0;

  @JsonProperty("stationBId", Number, true)
  stationBId: number = 0;

  @JsonProperty("distance", Number, true)
  distance: number = 0;

  @JsonProperty("duration", Number, true)
  duration: number = 0;

}
