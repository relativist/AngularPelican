import {User} from '../models/user';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {EventApp} from '../models/event-app';
import {Injectable} from '@angular/core';
import {BaseApi} from './base-api';

@Injectable()
export class EventService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addEvent(event: EventApp): Observable<EventApp> {
    return this.post('events', event);
  }

  getEvents(userId: number): Observable<EventApp[]> {
    return this.getArray(`events?userId=${userId}`);
  }

  getAllEvents(): Observable<EventApp[]> {
    return this.getArray('events');
  }

  getEventById(id: number): Observable<EventApp> {
    return this.get(`events/${id}`);
  }

  updateEvent(event: EventApp): Observable<EventApp> {
    return this.put('events', event);
  }

  deleteEvent(event: EventApp): Observable<EventApp> {
    return this.delete(`events/${event.id}`);
  }

  createEvent(event: EventApp): Observable<EventApp> {
    return this.post('events', event);
  }
}
