import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContentPageComponent} from './content-page/content-page.component';
import {HomePageComponent} from '../home-page/home-page.component';
import {ContentRoutingModule} from './content-routing.module';
import {ContentComponent} from './content.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import {DropdownDirective} from './shared/directives/dropdown.directive';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import { ManageComponent } from './manage/manage.component';
import { FriendsComponent } from './friends/friends.component';
import { DayDescriptionComponent } from './dashboard/day-description/day-description.component';
import {UserService} from './shared/services/user-service';
import {CategoryService} from './shared/services/category-service';
import {EventService} from './shared/services/event-service';
import {HttpClientModule} from '@angular/common/http';
import { ShowCategoryComponent } from './manage/show-category/show-category.component';
import { ManageCategoryComponent } from './manage/manage-category/manage-category.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HistoryComponent } from './dashboard/history/history.component';
import { ChartComponent } from './report/chart/chart.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {CalculateProcessComponent} from './report/calculate.process.component';
import {ScoreService} from './shared/services/score-service';
import {BadCategoriesComponent} from './bad-category/bad.categories.component';
import {ShowBadCategoryComponent} from './bad-category/show-bad-category/show-category.component';
import {ManageBadBadCategoryComponent} from './bad-category/manage-bad-category/manage-bad.category.component';
import {BadCategoryService} from './shared/services/bad-category-service';
import {PlanComponent} from './plans/plan.component';
import {ShowPlanComponent} from './plans/show-plan/show-category.component';
import {ManagePlanComponent} from './plans/manage-plan/manage-bad.category.component';
import {PlanService} from './shared/services/plan-service';
import {GrandFilterPipe} from './shared/pipes/grandFilterPipe';
import {BadEventDashboardComponent} from './bad-events-dashboard/bad-event-dashboard.component';
import {BadEventDayDescriptionComponent} from './bad-events-dashboard/day-description/bad-event-day-description.component';
import {BadEventHistoryComponent} from './bad-events-dashboard/history/bad-event-history.component';
import {BadEventService} from './shared/services/bad-event-service';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    ContentRoutingModule,
    SharedModule
  ],
  declarations: [
    ContentPageComponent,
    HomePageComponent,
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    DropdownDirective,
    DashboardComponent,
    BadEventDashboardComponent,
    ReportComponent,
    ManageComponent,
    BadCategoriesComponent,
    PlanComponent,
    FriendsComponent,
    DayDescriptionComponent,
    BadEventDayDescriptionComponent,
    BadEventHistoryComponent,
    ShowCategoryComponent,
    ShowBadCategoryComponent,
    ShowPlanComponent,
    ManageBadBadCategoryComponent,
    ManagePlanComponent,
    ManageCategoryComponent,
    HistoryComponent,
    ChartComponent,
    GrandFilterPipe
  ],
  providers: [
    CalculateProcessComponent,
    UserService,
    CategoryService,
    BadCategoryService,
    BadEventService,
    PlanService,
    EventService,
    ScoreService
  ]
})

export class ContentModule {
}
