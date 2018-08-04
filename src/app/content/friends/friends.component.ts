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
  usersData = [];
  isLoaded = false;

  constructor(private us: UserService,
              private catService: CategoryService,
              private authService: AuthService,
              private eventService: EventService,
              private calc: CalculateProcessComponent) {
  }

  ngOnInit() {
    this.sub1 = combineLatest(
      this.us.getUsers(),
      this.eventService.getAllEvents(),
      this.catService.getAllCategories()
    )
      .subscribe((data: [User[], EventApp[], Category[]]) => {
          this.users = data[0];
          this.events = data[1];
          this.categories = data[2];

          this.users.forEach(u => {
            if (u.id === this.authService.user.id) {
              return;
            }
            const userEvents = this.events.filter(e => e.userId === u.id);
            const userCategories = this.categories.filter(c => c.userId === u.id);
            const avg = this.calc.getAvgProcessedDays(7, userEvents, userCategories);
            const cat_value = this.calc.getReportByCategories(7, userEvents, userCategories);
            this.usersData.push({name: u.name, avg_value: avg, cat_value: cat_value});
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
