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

const routes: Routes = [
  {path: 'content', component: ContentComponent, children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'report', component: ReportComponent},
      {path: 'manage', component: ManageComponent},
      {path: 'friends', component: FriendsComponent},
      {path: 'day', component: DayDescriptionComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
})

export class ContentRoutingModule {
}
