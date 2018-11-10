import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {EventApp} from '../shared/models/event-app';
import {ProgressDay} from '../shared/models/progress-day';
import * as moment from 'moment';
import {Category} from '../shared/models/category';
import {EventService} from '../shared/services/event-service';
import {CategoryService} from '../shared/services/category-service';
import {AuthService} from '../shared/services/auth.service';
import {UserService} from '../shared/services/user-service';

@Injectable()
export class CalculateProcessComponent implements OnInit, OnDestroy {

  format = 'DD.MM.YYYY';

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  getAvgProcessedDays(days: number, events: EventApp[], categories: Category[]): any {
    let today = moment();
    const minDay = today.subtract(days, 'd');
    today = moment();
    const progress: ProgressDay[] = [];

    let curDate = moment().subtract(days - 1, 'd');
    let done = 0;
    let remain = 0;

    while (!curDate.isAfter(moment())) {
      const tmp = this.calculateProcessDay(curDate.format(this.format), events, categories).percent;
      done += tmp;
      remain += (100 - tmp);
      curDate = curDate.add(1, 'd');
    }
    // curDate = curDate.add(1, 'd');
    // console.log(curDate.format(this.format));

    // for (let i = 0; i < events.length; i++) {
    //   const btw = moment(events[i].date, this.format);
    //   if (btw.isSameOrAfter(minDay) && btw.isSameOrBefore(today)) {
    //     progress.push(this.calculateProcessDay(events[i].date, events, categories));
    //   }
    // }
    //
    // let avgScore = 0;
    // if (progress.length > 0) {
    //   avgScore = progress.reduce((previousValue, currentValue) => previousValue += currentValue.percent, 0) / progress.length;
    // }
    // const result = [];
    // result.push({name: 'Done', value: avgScore});
    // result.push({name: 'Remain', value: 100 - avgScore});
    // return result;

    const result = [];
    result.push({name: 'Done', value: done});
    result.push({name: 'Remain', value: remain});
    return result;
  }

  calculateProcessDay(date: string, events: EventApp[], categories: Category[]): ProgressDay {
    const foundEvents = events.filter(e => e.date === date);
    if (foundEvents && foundEvents.length > 0) {
      let percent = 0;
      const ids: number[] = [];
      for (let i = 0; i < foundEvents.length; i++) {
        ids.push(foundEvents[i].id);
        const eventApp = foundEvents[i];
        const cat = categories.filter(c => c.id === eventApp.categoryId)[0];
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

  getReportByCategories(days: number, events: EventApp[], categories: Category[]): any {
    const parents = categories.filter(e => this.hasChildren(e, categories));
    const parentMap = [];

    parents.forEach(parent => {
      let score = 0;
      events.filter(e => this.moreOrEqualDate(e.date, days))
        .forEach(event => {
          if (this.isEventOfParentCategory(event.categoryId, parent.id, categories)) {
            score += this.calculateProcessDayPerCategory(event, categories.filter(c => c.id === event.categoryId)[0]);
          }
        });
      if (score !== 0) {
        parentMap.push({name: parent.name, value: score});
      }
    });
    return parentMap;
  }

  private moreOrEqualDate(date: string, days: number) {
    let today = moment();
    const minDay = today.subtract(days, 'd');
    today = moment();
    const btw = moment(date, this.format);
    return btw.isSameOrAfter(minDay) && btw.isSameOrBefore(today);
  }

  private hasChildren(cat: Category, caterories: Category[]): boolean {
    const idx = caterories.findIndex(e => e.categoryParentId === cat.id);
    return idx >= 0;
  }

  private isEventOfParentCategory(catId: number, parentId: number, categories: Category[]) {
    const cats = categories.filter(cat => cat.id === catId);
    if (cats.length > 0) {
      return cats[0].categoryParentId === parentId;
    }
    return false;
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

  getReportBySubCategories(categories: Category[], events: EventApp[]): any {
    // категории у которых дети
    // MAP: <cat.name, [subCat.name, avgPercent]>
    const parents = categories.filter(e => this.hasChildren(e, categories));
    const parentMap = [];
    parents.forEach(parent => {
      const childrenMap = [];
      const children = categories.filter(c => c.categoryParentId === parent.id);
      children.forEach(child => {
        //  сумма прогрессов для этого ребенка за (7, 30, all)
        const childEvents = events.filter(e => e.categoryId === child.id && this.moreOrEqualDate(e.date, 360));

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
}
