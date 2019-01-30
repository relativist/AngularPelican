import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseApi} from './base-api';
import {BadEvent} from '../models/BadEvent';
import {EventApp} from '../models/event-app';


@Injectable()
export class BadEventService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addBadEvent(event: BadEvent): Observable<BadEvent> {
    return this.post('bad-events', event);
  }

  getBadEvents(userId: number): Observable<BadEvent[]> {
    return this.getArray(`bad-events?userId=${userId}`);
  }

  getAllBadEvent(): Observable<BadEvent[]> {
    return this.getArray('bad-events');
  }

  getBadEventById(id: string): Observable<BadEvent> {
    return this.get(`bad-events/${id}`);
  }

  updateBadEvent(cat: BadEvent): Observable<BadEvent> {
    return this.put('bad-events', cat);
  }

  createBadEvent(cat: BadEvent): Observable<BadEvent> {
    return this.post('bad-events', cat);
  }

  deleteBadEvent(event: BadEvent): Observable<EventApp> {
    return this.delete(`bad-events/${event.id}`);
  }
}
