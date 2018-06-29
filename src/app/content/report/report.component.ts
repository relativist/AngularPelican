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
  format = 'DD.MM.YYYY';

  seven = [];
  month = [];
  allTheTime = [];
  categoriesDisposable: Category[] = [];
  reportBySubCategory = [];
  reportByCat7 = [];
  reportByCat30 = [];
  reportByCat360 = [];
  sub1: Subscription;

  constructor(private us: UserService,
              private cs: CategoryService,
              private authService: AuthService,
              private es: EventService) {
  }

  ngOnInit() {
    const userId = this.authService.user.id;
    this.user = this.authService.user;
    this.sub1 = combineLatest(
      this.es.getEvents(userId),
      this.cs.getCategories(userId)
    ).subscribe((data: [EventApp[], Category[]]) => {
      this.events = data[0];
      this.categories = data[1];
      this.categories.forEach(e => e.name = this.prettyCatName(e));
      this.categories = this.categories.sort((a, b) => a.name.localeCompare(b.name));
      this.seven = this.getAvgProcessedDays(7);
      this.month = this.getAvgProcessedDays(30);
      this.allTheTime = this.getAvgProcessedDays(this.events.length - 1);
      this.categoriesDisposable = this.categories.filter(e => e.disposable);
      this.reportBySubCategory = this.getReportBySubCategories();
      this.isLoaded = true;
      this.reportByCat7 = this.getReportByCategories(7);
      this.reportByCat30 = this.getReportByCategories(30);
      this.reportByCat360 = this.getReportByCategories(360);
    });


  }

  private getReportBySubCategories(): any {
    // категории у которых дети
    // MAP: <cat.name, [subCat.name, avgPercent]>
    const parents = this.categories.filter(e => this.hasChildren(e));
    const parentMap = [];
    parents.forEach(parent => {
      const childrenMap = [];
      const children = this.categories.filter(c => c.category_parent_id === parent.id);
      children.forEach(child => {
        //  сумма прогрессов для этого ребенка за (7, 30, all)
        const childEvents = this.events.filter(e => e.category_id === child.id && this.moreOrEqualDate(e.date, 360));

        if (childEvents.length === 0) {
          return;
        }
        const score = childEvents
          .reduce((previousValue, currentValue) => previousValue += this.calculateProcessDayPerCategory(currentValue, child), 0);
        childrenMap.push({name: child.name, value: score});
      });
      if (childrenMap.length > 0) {
        parentMap.push({name: parent.name, value: childrenMap});
      }
    });
    // console.log(parentMap);
    return parentMap;
  }

  getReportByCategories(days: number): any {
    const parents = this.categories.filter(e => this.hasChildren(e));
    const parentMap = [];

    parents.forEach(parent => {
      let score = 0;
      this.events
        .filter(e => this.moreOrEqualDate(e.date, days))
        .forEach(event => {
          if (this.isEventOfParentCategory(event.category_id, parent.id)) {
            score += this.calculateProcessDayPerCategory(event, this.categories.filter(c => c.id === event.category_id)[0]);
          }
        });
      if (score !== 0) {
        parentMap.push({name: parent.name, value: score});
      }
    });
    // console.log(parentMap);
    return parentMap;
  }

  private hasChildren(cat: Category): boolean {
    const idx = this.categories.findIndex(e => e.category_parent_id === cat.id);
    return idx >= 0;
  }

  private getAvgProcessedDays(days: number): any {
    let today = moment();
    const minDay = today.subtract(days, 'd');
    today = moment();
    const progress: ProgressDay[] = [];
    for (let i = 0; i < this.events.length; i++) {
      const btw = moment(this.events[i].date, this.format);
      if (btw.isSameOrAfter(minDay) && btw.isSameOrBefore(today)) {
        progress.push(this.calculateProcessDay(this.events[i].date));
      }
    }

    let avgScore = 0;
    if (progress.length > 0) {
      avgScore = progress.reduce((previousValue, currentValue) => previousValue += currentValue.percent, 0) / progress.length;
    }
    const result = [];
    result.push({name: 'Done', value: avgScore});
    result.push({name: 'Remain', value: 100 - avgScore});
    return result;
  }

  prettyCatName(cat: Category): string {
    let prefix = '';
    if (cat.category_parent_id !== 0) {
      const idx = this.categories.findIndex(e => e.id === cat.category_parent_id);
      prefix = this.categories[idx].name + ': ';
    }
    return prefix + cat.name;
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
    const percent = (100 * cat.disposable_done / cat.disposable_capacity);
    return percent > 100 ? 100 : percent;
  }

  private moreOrEqualDate(date: string, days: number) {
    let today = moment();
    const minDay = today.subtract(days, 'd');
    today = moment();
    const btw = moment(date, this.format);
    return btw.isSameOrAfter(minDay) && btw.isSameOrBefore(today);
  }

  private calculateProcessDayPerCategory(event: EventApp, cat: Category): number {
    let score = 0;
    if (cat && cat.simple) {
      score = cat.score;
    }

    if (event.score > 0) {
      score = event.score * 100 / cat.score;
    }
    // console.log(event.date + ' ' + cat.name + ': ' + score);
    return score;
  }

  private isEventOfParentCategory(catId: number, parentId: number) {
    const cats = this.categories.filter(cat => cat.id === catId);
    if (cats.length > 0) {
      return cats[0].category_parent_id === parentId;
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
