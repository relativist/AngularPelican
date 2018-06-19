import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContentPageComponent} from './content-page/content-page.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ContentRoutingModule} from './content-routing.module';
import {ContentComponent} from './content.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import {DropdownDirective} from './shared/directives/dropdown.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { ManageComponent } from './manage/manage.component';
import { FriendsComponent } from './friends/friends.component';
import { DayDescriptionComponent } from './day-description/day-description.component';

@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule
  ],
  declarations: [
    ContentPageComponent,
    HomePageComponent,
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    DropdownDirective,
    DashboardComponent,
    ReportComponent,
    ManageComponent,
    FriendsComponent,
    DayDescriptionComponent
  ],
  providers: [
  ]
})

export class ContentModule {
}
