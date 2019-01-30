import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from './base-api';
import {Score} from '../models/score';

@Injectable()
export class ScoreService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  getScore(userId: number): Observable<Score> {
    return this.getArray(`score?userId=${userId}`);
  }

  operateScore(userId: number, value: number): Observable<Score> {
    return this.get(`score/operate?userId=${userId}&value=${value}`);
  }

}
