import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from '../shared/services/category-service';
import {EventService} from '../shared/services/event-service';
import {UserService} from '../shared/services/user-service';
import {EventApp} from '../shared/models/event-app';
import {Category} from '../shared/models/category';
import {User} from '../shared/models/user';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ProgressDay} from '../shared/models/progress-day';
import * as moment from 'moment';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from '../shared/services/auth.service';
import {CalculateProcessComponent} from './calculate.process.component';
import {BadEvent} from '../shared/models/BadEvent';
import {BadEventService} from '../shared/services/bad-event-service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit, OnDestroy {

  isLoaded = false;
  user: User;
  events: EventApp[] = [];
  categories: Category[] = [];
  badEvents: BadEvent[] = [];
  format = 'DD.MM.YYYY';

  avg7 = [];
  avg30 = [];
  avg90 = [];
  categoriesDisposable: Category[] = [];
  reportBySubCategory = [];
  reportByCat7 = [];
  reportByCat30 = [];
  reportByCat90 = [];
  reportBadEvents7 = [];
  reportBadEvents30 = [];
  reportBadEvents90 = [];
  sub1: Subscription;

  constructor(private us: UserService,
              private cs: CategoryService,
              private authService: AuthService,
              private eventService: EventService,
              private badEventService: BadEventService,
              private calc: CalculateProcessComponent) {
  }

  ngOnInit() {
    const userId = this.authService.user.id;
    this.user = this.authService.user;
    this.sub1 = combineLatest(
      this.eventService.getEvents(userId),
      this.cs.getCategories(userId),
      this.badEventService.getBadEvents(userId)
    ).subscribe((data: [EventApp[], Category[], BadEvent[]]) => {
      this.events = data[0];
      this.categories = data[1];
      this.badEvents = data[2];
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.avg7 = this.calc.getAvgProcessedDays(7, this.events, this.categories);
      this.avg30 = this.calc.getAvgProcessedDays(30, this.events, this.categories);
      this.avg90 = this.calc.getAvgProcessedDays(90, this.events, this.categories);
      this.categoriesDisposable = this.categories.filter(e => e.disposable);
      this.reportBySubCategory = this.calc.getReportBySubCategories(this.categories, this.events);
      this.isLoaded = true;
      this.reportByCat7 = this.calc.getReportByCategories(7, this.events, this.categories);
      this.reportByCat30 = this.calc.getReportByCategories(30, this.events, this.categories);
      this.reportByCat90 = this.calc.getReportByCategories(90, this.events, this.categories);
      this.reportBadEvents7 = this.calc.getReportByBadEvents(7, this.badEvents);
      this.reportBadEvents30 = this.calc.getReportByBadEvents(30, this.badEvents);
      this.reportBadEvents90 = this.calc.getReportByBadEvents(90, this.badEvents);
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
        if (cat && cat.simple) {
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

  getCatColorClass(cat: Category): string {
    const percent = this.getCatPercent(cat);
    return percent < 60 ? 'danger' : percent >= 100 ? 'success' : 'warning';
  }

  getCatPercent(cat: Category): number {
    const percent = (100 * cat.disposableDone / cat.disposableCapacity);
    return percent > 100 ? 100 : percent;
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
