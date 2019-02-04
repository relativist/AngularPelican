import {Category} from './models/category';
import {EventApp} from './models/event-app';
import {BadEvent} from './models/BadEvent';

export default class PelicanUtils {
  static doSomething(val: string) { return val; }
  static doSomethingElse(val: string) { return val; }
  static prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.parent !== null) {
      prefix = cat.parent.name + ': ';
    }
    return prefix + cat.name;
  }

  static percentOfEvent(event: EventApp, cat: Category): number {
    if (event.score === null && event.category.simple === true) {
      return event.category.score;
    }

    let percent = 0;
    if (event.score > 0) {
      percent += event.score * 100 / cat.score;

      if (percent > 100) {
        percent = 100;
      }
    }
    return percent;
  }

  static percentOfBadEvent(event: BadEvent): number {
    if (event.category.score > 100) {
      return 100;
    }
    return event.category.score;
  }
}
