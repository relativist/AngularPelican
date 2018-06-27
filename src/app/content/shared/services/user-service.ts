import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';
import {BaseApi} from './base-api';

@Injectable()
export class UserService extends BaseApi {

  constructor(public http: HttpClient) {
    super(http);
  }

  addUser(event: User): Observable<User> {
    return this.post('users', event);
  }

  getUsers(): Observable<User[]> {
    return this.getArray('users');
  }

  getUserById(id: string): Observable<User> {
    return this.get(`users/${id}`);
  }

  getUserByLogin(login: string): Observable<User> {
    return this.get(`users?login=${login}`);
  }

}
