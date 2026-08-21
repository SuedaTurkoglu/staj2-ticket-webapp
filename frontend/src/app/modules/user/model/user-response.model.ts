import {JsonObject, JsonProperty} from 'json2typescript';
import {JsonDateConverter} from '../../../shared/converter/json-date-converter';

@JsonObject("UserResponse")
export class UserResponseModel{

  @JsonProperty("id", Number, true)
  id: number = 0;

  @JsonProperty("createdAt", JsonDateConverter, true)
  createdAt: Date | null = null;

  @JsonProperty("updatedAt", JsonDateConverter, true)
  updatedAt: Date | null = null;

  @JsonProperty("userId", Number, true)
  userId: number = 0;

  @JsonProperty("name", String, true)
  name: string = "";

  @JsonProperty("surname", String, true)
  surname: string = "";

  @JsonProperty("mail", String, true)
  mail: string = "";

  @JsonProperty("admin", Boolean, true)
  admin: boolean = false;

  @JsonProperty("driver", Boolean, true)
  driver: boolean = false;

}
