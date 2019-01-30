import {User} from './user';

export class BadCategory {
  constructor(
    public name: string,
    public score: number,
    public user: User,
    public id?: number,
  ) {

  }
}
