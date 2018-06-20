import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/services/user-service';
import {User} from '../shared/models/user';
import {CategoryService} from '../shared/services/category-service';
import {Category} from '../shared/models/category';
import {EventService} from '../shared/services/event-service';
import {EventApp} from '../shared/models/event-app';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoaded = false;
  user: User;

  constructor(private us: UserService,
              private cs: CategoryService,
              private es: EventService) {
  }

  ngOnInit() {
    this.us.getUserById('1').subscribe((u: User) => {
      this.user = u;
      this.isLoaded = true;
    });

    this.es.getEvents().subscribe((eventApps: EventApp[]) => {
      for (let i = 0; i < eventApps.length; i++) {
        console.log(eventApps[i].date);
      }
    });
  }

}
