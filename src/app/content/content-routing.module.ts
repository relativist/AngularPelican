import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentComponent} from './content.component';
import {HomePageComponent} from './home-page/home-page.component';

const routes: Routes = [
  {path: 'content', component: ContentComponent, children: [
      {path: 'login', component: HomePageComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ContentRoutingModule {
}
