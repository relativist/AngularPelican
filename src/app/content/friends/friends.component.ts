import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user-service';
import {Subscription} from 'rxjs/Subscription';
import {User} from '../shared/models/user';
import {EventService} from '../shared/services/event-service';
import {CategoryService} from '../shared/services/category-service';
import {AuthService} from '../shared/services/auth.service';
import {CalculateProcessComponent} from '../report/calculate.process.component';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Category} from '../shared/models/category';
import {EventApp} from '../shared/models/event-app';
import {BadEventService} from '../shared/services/bad-event-service';
import {BadEvent} from '../shared/models/BadEvent';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  sub1: Subscription;
  users: User[];
  categories: Category[];
  events: EventApp[];
  badEvents: BadEvent[];
  usersData = [];
  usersData30 = [];
  usersBadData7 = [];
  usersBadData30 = [];
  isLoaded = false;

  constructor(private us: UserService,
              private catService: CategoryService,
              private authService: AuthService,
              private eventService: EventService,
              private badEventService: BadEventService,
              private calc: CalculateProcessComponent) {
  }

  ngOnInit() {
    this.sub1 = combineLatest(
      this.us.getUsers(),
      this.eventService.getAllEvents(),
      this.catService.getAllCategories(),
      this.badEventService.getAllBadEvent()
    )
      .subscribe((data: [User[], EventApp[], Category[], BadEvent[]]) => {
          this.users = data[0];
          this.events = data[1];
          this.categories = data[2];
          this.badEvents = data[3];
          // console.log('init', this.badEvents);

          this.users.forEach(u => {

            if (u.id === this.authService.user.id) {
              return;
            }

            const userEvents = this.events.filter(e => e.user.id === u.id);

            if (userEvents.length === 0) {
              return;
            }

            const userBadEvents = this.badEvents.filter(e => e.user.id === u.id);
            const userCategories = this.categories.filter(c => c.user.id === u.id);
            const avg7 = this.calc.getAvgProcessedDays(7, userEvents, userCategories);
            const cat_value7 = this.calc.getReportByCategories(7, userEvents, userCategories);

            const avg30 = this.calc.getAvgProcessedDays(30, userEvents, userCategories);
            const cat_value30 = this.calc.getReportByCategories(30, userEvents, userCategories);

            const reportByBadEvents7 = this.calc.getReportByBadEvents(7, userBadEvents);
            const reportByBadEvents30 = this.calc.getReportByBadEvents(30, userBadEvents);

            this.usersData.push({
              name: u.name,
              progress7: avg7,
              category7: cat_value7,
              progress30: avg30,
              category30: cat_value30,
              badEvent7: reportByBadEvents7,
              badEvent30: reportByBadEvents30
            });

          });
          this.isLoaded = true;
        }
      )
    ;
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
