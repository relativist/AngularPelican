import {User} from './user';

export class Score {
  constructor(
    public score: number,
    public user: User,
    public id?: number,
  ) {

  }
}
