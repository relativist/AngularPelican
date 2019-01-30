import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {ContentComponent} from './content/content.component';
import {LoginComponent} from './login/login.component';
import {NotfoundComponent} from './content/shared/components/notfound/notfound.component';
import {AuthGuard} from './content/shared/services/auth-guard';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {RegisterComponent} from './register/register.component';
const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'content', component: ContentComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  // {path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
})

export class AppRoutingModule {
}
