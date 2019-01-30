import { Pipe, PipeTransform } from '@angular/core';
import {Plan} from '../models/plan';

@Pipe({
  name: 'grandFilter',
  pure: false
})
export class GrandFilterPipe implements PipeTransform {
  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter(item => callback(item));
  }
}
