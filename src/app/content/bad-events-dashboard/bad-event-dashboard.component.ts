import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {User} from '../shared/models/user';
import {Category} from '../shared/models/category';
import * as moment from 'moment';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ProgressDay} from '../shared/models/progress-day';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../shared/services/auth.service';
import {ScoreService} from '../shared/services/score-service';
import {Score} from '../shared/models/score';
import PelicanUtils from '../shared/pelicanUtils';
import 'rxjs-compat/add/operator/mapTo';
import 'rxjs-compat/add/operator/mergeMap';
import {BadCategoryService} from '../shared/services/bad-category-service';
import {BadEventService} from '../shared/services/bad-event-service';
import {BadEvent} from '../shared/models/BadEvent';


@Component({
  selector: 'app-bad-event-dashboard',
  templateUrl: './bad-event-dashboard.component.html',
  styleUrls: ['./bad-event-dashboard.component.scss']
})
export class BadEventDashboardComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService,
              private badCategoryService: BadCategoryService,
              private badEventService: BadEventService,
              private scoreService: ScoreService) {
  }

  isLoaded = false;
  user: User;
  format = 'DD.MM.YYYY';
  events: BadEvent[] = [];
  filteredEvents: BadEvent[] = [];
  progresses: ProgressDay[] = [];
  categories: Category[] = [];
  actualCategories: Category[] = [];
  selectedProgressDay: ProgressDay;
  sub1: Subscription;
  userScore: Score;


  ngOnInit() {
    this.user = this.authService.user;
    this.sub1 = combineLatest(
      this.badEventService.getBadEvents(this.user.id),
      this.badCategoryService.getBadCategories(this.user.id),
      this.scoreService.getScore(this.user.id)
    ).subscribe((data: [BadEvent[], Category[], Score]) => {
      this.events = data[0];
      this.categories = data[1];
      this.userScore = data[2];
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.actualCategories = this.categories
        .sort((a, b) => a.name.localeCompare(b.name));
      let today = moment();
      this.progresses.push(this.calculateBadProcessDay(moment().format(this.format)));
      for (let i = 1; i < 15; i++) {
        today = today.subtract(1, 'd');
        this.progresses.push(this.calculateBadProcessDay(today.format(this.format)));
      }
      this.selectProgressDay(this.progresses[0]);
      this.isLoaded = true;
    });

  }

  calculateBadProcessDay(date: string): ProgressDay {
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
        percent += PelicanUtils.percentOfBadEvent(eventApp);
      }
      if (percent > 100) {
        percent = 100;
      }
      const color = percent >= 100 ? 'danger' : percent > 60 ? 'warning' : percent > 30 ? 'info' : 'success';
      return new ProgressDay(date, ids, color, percent);
    } else {
      return new ProgressDay(date, [], 'success', 0);
    }
  }

  selectProgressDay(day: ProgressDay) {
    this.filteredEvents = this.events.filter(e => e.date === day.date);
    this.selectedProgressDay = day;
  }

  eventWasEdited(event: BadEvent) {
    // update day event content
    // console.log('eventWasEdited', event);
    const idx = this.events.findIndex(e => e.id === event.id);
    if (idx > -1) {
      if (event.date === '') {
        // либо удаляем
        // получаем евент по айди и апдейтим score и удаляем сам эвент
        this.badEventService.getBadEventById(event.id + '')
          .mergeMap((prevEvent: BadEvent) => {
            const percentOfEvent = PelicanUtils.percentOfBadEvent(prevEvent);
            // console.log('PERCENT DELETE: ', percentOfEvent);
            return this.scoreService.operateScore(this.user.id, event.category.score);
          })
          .mergeMap((newScore: Score) => {
            this.userScore = newScore;
            return this.badEventService.deleteBadEvent(event);
          })
          .subscribe();
        this.events.splice(idx, 1);
      } else {
        // либо обновляем?
        // не предусмотрено.
        this.events[idx] = event;
      }
    } else {
      // либо добавляем
      const percentOfEvent = PelicanUtils.percentOfBadEvent(event);
      // console.log('PERCENT CREATE: ', percentOfEvent);
      this.events.push(event);
      this.scoreService.operateScore(this.user.id, -event.category.score).subscribe((newScore: Score) => {
        this.userScore = newScore;
      });
    }
    this.filteredEvents = this.events.filter(e => e.date === this.selectedProgressDay.date);
    this.recalculateProgressDay(this.selectedProgressDay.date);
  }

  recalculateProgressDay(date: string): void {
    // recalculate day
    this.selectedProgressDay = this.calculateBadProcessDay(this.selectedProgressDay.date);
    const pgIdx = this.progresses.findIndex(e => e.date === this.selectedProgressDay.date);
    this.progresses[pgIdx] = this.selectedProgressDay;
  }



  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
