import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './content/home-page/home-page.component';
import {ContentComponent} from './content/content.component';
import {ManageCategoryComponent} from './content/manage/manage-category/manage-category.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'content', component: ContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {
}
