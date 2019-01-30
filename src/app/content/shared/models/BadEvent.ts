import {User} from './user';
import {BadCategory} from './bad.category';

export class BadEvent {
  constructor(
    public date: string,
    public category: BadCategory,
    public user: User,
    public id?: number,
  ) {

  }
}
