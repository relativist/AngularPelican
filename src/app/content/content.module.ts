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
import {UserService} from './shared/services/user-service';
import {CategoryService} from './shared/services/category-service';
import {EventService} from './shared/services/event-service';
import {HttpClientModule} from '@angular/common/http';
import { ShowCategoryComponent } from './manage/show-category/show-category.component';
import { ManageCategoryComponent } from './manage/manage-category/manage-category.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    ContentRoutingModule,
    ReactiveFormsModule,
    FormsModule
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
    DayDescriptionComponent,
    ShowCategoryComponent,
    ManageCategoryComponent
  ],
  providers: [
    UserService,
    CategoryService,
    EventService
  ]
})

export class ContentModule {
}
