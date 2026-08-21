import {JsonConverter} from 'json2typescript';
import {__decorate} from 'tslib';

let JsonDateConverter = class JsonDateConverter {
  deserialize(date: any): Date {
    return new Date(date);
  }

  serialize(date: any): Date {
    //convert to date if type is string (createdAt etc.)
    date = typeof date === 'string' ? new Date(date) : date;

    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  }

  serializeToLocalDate(date: any): string {
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  }

};
JsonDateConverter = __decorate([
  JsonConverter
], JsonDateConverter);
export { JsonDateConverter };
