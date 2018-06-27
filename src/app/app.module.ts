import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ContentModule} from './content/content.module';
import {SharedModule} from './content/shared/shared.module';
import {LoginComponent} from './login/login.component';
import {UserService} from './content/shared/services/user-service';
import {AuthService} from './content/shared/services/auth.service';
import {AuthGuard} from './content/shared/services/auth-guard';
import {NotfoundComponent} from './content/shared/components/notfound/notfound.component';
import {ContentRoutingModule} from './content/content-routing.module';
import {LoaderComponent} from './content/shared/components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotfoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ContentModule,
    SharedModule
  ],
  providers: [UserService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
