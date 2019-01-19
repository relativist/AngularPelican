import {User} from './user';

export class Category {
  constructor(
    public parent: Category,
    public name: string,
    public simple: boolean,
    public score: number,
    public disposable: boolean,
    public disposableCapacity: number,
    public disposableDone: number,
    public deprecated: boolean,
    public user: User,
    public header: boolean,
    public id?: number,
  ) {

  }
}
