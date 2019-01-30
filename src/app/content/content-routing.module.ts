import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {HomePageComponent} from '../home-page/home-page.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ReportComponent} from './report/report.component';
import {ManageComponent} from './manage/manage.component';
import {FriendsComponent} from './friends/friends.component';
import {DayDescriptionComponent} from './dashboard/day-description/day-description.component';
import {AuthGuard} from './shared/services/auth-guard';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BadCategoriesComponent} from './bad-category/bad.categories.component';
import {PlanComponent} from './plans/plan.component';
import {BadEventDashboardComponent} from './bad-events-dashboard/bad-event-dashboard.component';

const routes: Routes = [
  {
    path: 'content', component: ContentComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'bad-events-dashboard', component: BadEventDashboardComponent},
      {path: 'report', component: ReportComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'bad-category', component: BadCategoriesComponent},
      {path: 'plans', component: PlanComponent},
      {path: 'friends', component: FriendsComponent},
      {path: 'day', component: DayDescriptionComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
})

export class ContentRoutingModule {
}
