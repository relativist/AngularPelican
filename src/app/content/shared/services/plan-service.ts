import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from './base-api';
import {Plan} from '../models/plan';

@Injectable()
export class PlanService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addPlan(event: Plan): Observable<Plan> {
    return this.post('plan', event);
  }

  getPlans(userId: number): Observable<Plan[]> {
    return this.getArray(`plan?userId=${userId}`);
  }

  getAllPlan(): Observable<Plan[]> {
    return this.getArray('plan');
  }

  getPlanById(id: string): Observable<Plan> {
    return this.get(`plan/${id}`);
  }

  updatePlan(cat: Plan): Observable<Plan> {
    return this.put('plan', cat);
  }

  createPlan(cat: Plan): Observable<Plan> {
    return this.post('plan', cat);
  }
}
