import {User} from './user';

export class Plan {
  constructor(
    public isFinished: boolean,
    public isGrand: boolean,
    public score: number,
    public name: string,
    public date: string,
    public user: User,
    public id?: number,
  ) {

  }
}
