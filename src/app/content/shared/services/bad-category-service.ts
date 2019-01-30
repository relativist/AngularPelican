import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from './base-api';
import {BadCategory} from '../models/bad.category';

@Injectable()
export class BadCategoryService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addBadCategory(event: BadCategory): Observable<BadCategory> {
    return this.post('bad-plans', event);
  }

  getBadCategories(userId: number): Observable<BadCategory[]> {
    return this.getArray(`bad-categories?userId=${userId}`);
  }

  getAllBadCategories(): Observable<BadCategory[]> {
    return this.getArray('bad-categories');
  }

  getBadCategoryById(id: string): Observable<BadCategory> {
    return this.get(`bad-categories/${id}`);
  }

  updateBadCategory(cat: BadCategory): Observable<BadCategory> {
    return this.put('bad-categories', cat);
  }

  createBadCategory(cat: BadCategory): Observable<BadCategory> {
    return this.post('bad-categories', cat);
  }
}
