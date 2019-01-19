import {User} from './user';
import {Category} from './category';

export class EventApp {
  constructor(
              public score: number,
              public category: Category,
              public date: string,
              public user: User,
              public id?: number,
  ) {

  }
}
