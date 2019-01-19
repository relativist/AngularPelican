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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

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

  constructor(private authService: AuthService,
              private cs: CategoryService,
              private es: EventService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
    this.sub1 = combineLatest(
      this.es.getEvents(this.user.id),
      this.cs.getCategories(this.user.id)
    ).subscribe((data: [EventApp[], Category[]]) => {
      this.events = data[0];
      this.categories = data[1];
      // this.categories.forEach(e => e.name = this.prettyCatName(e));
      // this.categories.forEach(e => e.name = this.prettyCatName(e));
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.actualCategories = this.categories.filter(e => e.deprecated === false && e.parent !== null);
      const first = moment(this.events[0].date, this.format);
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
        if (eventApp.score > 0) {
          percent += eventApp.score * 100 / cat.score;
        }
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
    const contains = this.events.findIndex(e => e.id === event.id);
    if (contains >= 0) {
      this.events[contains] = event;
    } else {
      this.events.push(event);
    }
    this.filteredEvents = this.events.filter(e => e.date === this.selectedProgressDay.date);

    // recalculate day
    this.selectedProgressDay = this.calculateProcessDay(this.selectedProgressDay.date);
    const pgIdx = this.progresses.findIndex(e => e.date === this.selectedProgressDay.date);
    this.progresses[pgIdx] = this.selectedProgressDay;

    // update dropDown names
    // this.categories.forEach(e => e.name = this.prettyCatName(e));
  }

  prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.parent !== null) {
      const idx = this.categories.findIndex(e => e.id === cat.parent.id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
