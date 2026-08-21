import {JsonConverter} from 'json2typescript';
import {__decorate} from 'tslib';

let SeatMapConverter = class SeatMapConverter {
  deserialize(obj: any): Map<number, boolean> {
    const map = new Map<number, boolean>();

    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        map.set(Number(key), Boolean(obj[key]));
      });
    }

    return map;
  }

  serialize(seatMap: Map<number, boolean>): any {
    const obj: Record<string, boolean> = {};
    seatMap.forEach((value, key) => {
      obj[key.toString()] = value;
    });

    return obj;
  }

};
SeatMapConverter = __decorate([
  JsonConverter
], SeatMapConverter);
export { SeatMapConverter };
