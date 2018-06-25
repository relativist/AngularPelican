import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user-service';
import {User} from '../shared/models/user';
import {CategoryService} from '../shared/services/category-service';
import {Category} from '../shared/models/category';
import {EventService} from '../shared/services/event-service';
import {EventApp} from '../shared/models/event-app';
import * as moment from 'moment';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ProgressDay} from '../shared/models/progress-day';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoaded = false;
  user: User;
  format = 'DD.MM.YYYY';
  events: EventApp[] = [];
  filteredEvents: EventApp[] = [];
  progresses: ProgressDay[] = [];
  categories: Category[] = [];
  actualCategories: Category[] = [];
  selectedProgressDay: ProgressDay;

  constructor(private us: UserService,
              private cs: CategoryService,
              private es: EventService) {
  }

  ngOnInit() {
    this.us.getUserById('1').subscribe((u: User) => {
      this.user = u;
      this.isLoaded = true;
    });

    combineLatest(
      this.us.getUserById('1'),
      this.es.getEvents(),
      this.cs.getCategories()
    ).subscribe((data: [User, EventApp[], Category[]]) => {
      this.user = data[0];
      this.events = data[1];
      this.categories = data[2];
      this.categories.forEach(e => e.name = this.prettyCatName(e));
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.actualCategories = this.categories.filter(e => e.deprecated === false);
      const first = moment(this.events[0].date, this.format);
      let today = moment();
      today = today.subtract(30, 'd');
      if (first.isBefore(today)) {
        today = moment();
        this.progresses.push(this.calculateProcessDay(moment().format(this.format)));
        for (let i = 0; i < 29; i++) {
          today = today.subtract(1, 'd');
          this.progresses.push(this.calculateProcessDay(today.format(this.format)));
        }
      } else {
        today = moment();
        this.progresses.push(this.calculateProcessDay(moment().format(this.format)));
        for (let i = 0; i < 50; i++) {
          const t2 = today.subtract(1, 'd');
          this.progresses.push(this.calculateProcessDay(t2.format(this.format)));
          if (t2.date() === first.date()) {
            break;
          }
        }
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
        const cat = this.categories.filter(c => c.id === eventApp.category_id)[0];
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
    if (cat.category_parent_id !== 0) {
      const idx = this.categories.findIndex(e => e.id === cat.category_parent_id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
  }

}
