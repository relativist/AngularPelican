import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user-service';
import {User} from '../shared/models/user';
import {CategoryService} from '../shared/services/category-service';
import {Category} from '../shared/models/category';
import {EventService} from '../shared/services/event-service';
import {EventApp} from '../shared/models/event-app';
import * as moment from 'moment';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ProgressDay} from '../shared/models/progress-day';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../shared/services/auth.service';
import {ScoreService} from '../shared/services/score-service';
import {Score} from '../shared/models/score';
import PelicanUtils from '../shared/pelicanUtils';
import {mergeMap} from 'rxjs-compat/operator/mergeMap';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/internal/observable/of';
import {timer} from 'rxjs/internal/observable/timer';
import 'rxjs-compat/add/operator/mapTo';
import 'rxjs-compat/add/operator/mergeMap';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService,
              private cs: CategoryService,
              private eventService: EventService,
              private scoreService: ScoreService) {
  }

  isLoaded = false;
  user: User;
  format = 'DD.MM.YYYY';
  events: EventApp[] = [];
  filteredEvents: EventApp[] = [];
  progresses: ProgressDay[] = [];
  categories: Category[] = [];
  actualCategories: Category[] = [];
  selectedProgressDay: ProgressDay;
  sub1: Subscription;
  userScore: Score;


  ngOnInit() {
    this.user = this.authService.user;
    this.sub1 = combineLatest(
      this.eventService.getEvents(this.user.id),
      this.cs.getCategories(this.user.id),
      this.scoreService.getScore(this.user.id)
    ).subscribe((data: [EventApp[], Category[], Score]) => {
      this.events = data[0];
      this.categories = data[1];
      this.userScore = data[2];
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.actualCategories = this.categories
        .filter(e => e.deprecated === false && e.parent !== null)
        .filter(e => e.parent !== null)
        .sort((a, b) => PelicanUtils.prettyCatName(a).localeCompare(PelicanUtils.prettyCatName(b)));
      let today = moment();
      this.progresses.push(this.calculateProcessDay(moment().format(this.format)));
      for (let i = 1; i < 15; i++) {
        today = today.subtract(1, 'd');
        this.progresses.push(this.calculateProcessDay(today.format(this.format)));
      }
      this.selectProgressDay(this.progresses[0]);
      this.isLoaded = true;
    });

  }

  calculateProcessDay(date: string): ProgressDay {
    const foundEvents = this.events.filter(e => e.date === date);
    if (foundEvents && foundEvents.length > 0) {
      let percent = 0;
      const ids: number[] = [];
      for (let i = 0; i < foundEvents.length; i++) {
        ids.push(foundEvents[i].id);
        const eventApp = foundEvents[i];
        const cat = this.categories.filter(c => c.id === eventApp.category.id)[0];
        if (cat !== undefined && cat.simple) {
          percent += cat.score;
          continue;
        }

        percent += PelicanUtils.percentOfEvent(eventApp, cat);
        // if (eventApp.score > 0) {
        //   percent += eventApp.score * 100 / cat.score;
        // }
      }
      if (percent > 100) {
        percent = 100;
      }
      const color = percent >= 100 ? 'success' : percent > 60 ? 'info' : percent > 30 ? 'warning' : 'danger';
      return new ProgressDay(date, ids, color, percent);
    } else {
      return new ProgressDay(date, [], 'danger', 0);
    }
  }

  selectProgressDay(day: ProgressDay) {
    this.filteredEvents = this.events.filter(e => e.date === day.date);
    this.selectedProgressDay = day;
  }

  eventWasEdited(event: EventApp) {
    // update day event content

    const idx = this.events.findIndex(e => e.id === event.id);
    if (idx > -1) {
      if (event.score === 0) {
        // либо удаляем
        // получаем евент по айди и апдейтим score и удаляем сам эвент
        this.eventService.getEventById(event.id).subscribe((prevEvent: EventApp) => {
          console.log('prevEvent:', prevEvent);
        });

        this.eventService.getEventById(event.id)
          .mergeMap((prevEvent: EventApp) => {
            const percentOfEvent = Math.round(PelicanUtils.percentOfEvent(prevEvent, prevEvent.category));
            // console.log('PERCENT DELETE: ', percentOfEvent);
            return this.scoreService.operateScore(this.user.id, -percentOfEvent);
          })
          .mergeMap((newScore: Score) => {
            this.userScore = newScore;
            return this.eventService.deleteEvent(event);
          })
          .subscribe();


        this.events.splice(idx, 1);
      } else {
        // либо обновляем?
        // не предусмотрено.
        // нужно искать дельту между предыдущим и текущим эвентом.
        this.events[idx] = event;
      }
    } else {
      // либо добавляем
      const percentOfEvent = Math.round(PelicanUtils.percentOfEvent(event, event.category));
      // console.log('PERCENT CREATE: ', percentOfEvent);
      this.events.push(event);
      this.scoreService.operateScore(this.user.id, percentOfEvent).subscribe((newScore: Score) => {
        this.userScore = newScore;
      });
    }
    this.filteredEvents = this.events.filter(e => e.date === this.selectedProgressDay.date);
    this.recalculateProgressDay(this.selectedProgressDay.date);
  }

  recalculateProgressDay(date: string): void {
    // recalculate day
    this.selectedProgressDay = this.calculateProcessDay(this.selectedProgressDay.date);
    const pgIdx = this.progresses.findIndex(e => e.date === this.selectedProgressDay.date);
    this.progresses[pgIdx] = this.selectedProgressDay;
  }



  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
