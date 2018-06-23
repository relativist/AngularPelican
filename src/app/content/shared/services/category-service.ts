import {EventApp} from '../models/event-app';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Category} from '../models/category';
import {BaseApi} from './base-api';

@Injectable()
export class CategoryService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addCategory(event: Category): Observable<Category> {
    return this.post('categories', event);
  }

  getCategories(): Observable<Category[]> {
    return this.getArray('categories');
  }

  getCategoryById(id: string): Observable<Category> {
    return this.get(`categories/${id}`);
  }

  updateCategory(cat: Category): Observable<Category> {
    return this.put(`categories/${cat.id}`, cat);
  }

  createCategory(cat: Category): Observable<Category> {
    return this.post(`categories`, cat);
  }
}
