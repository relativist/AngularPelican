import {User} from './user';

export class Category {
  constructor(
    public parent: Category,
    public name: string,
    public simple: boolean,
    // если простая - сколько % в день
    // если не простая - количество очков которые принесут 100%
    // если завершаемая - всего количество сделано (н: прочел всего 423 стр. из 600)
    public score: number,
    // может быть завершена ?
    public disposable: boolean,
    // всего
    public disposableCapacity: number,
    // сделано
    public disposableDone: number,
    // завершена? устарела?
    public deprecated: boolean,
    public user: User,
    public header: boolean,
    public id?: number,
  ) {

  }
}
