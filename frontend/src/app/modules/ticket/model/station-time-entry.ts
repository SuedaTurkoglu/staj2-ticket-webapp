import {JsonObject, JsonProperty} from 'json2typescript';
import {StationModel} from '../../station/model/station.model';

@JsonObject("StationTimeEntry")
export class StationTimeEntry {
  @JsonProperty("station", StationModel, true)
  station: StationModel = new StationModel();

  @JsonProperty("time", String, true)
  time: string = "";
}
