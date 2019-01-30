import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoaderComponent} from './components/loader/loader.component';
import {GrandFilterPipe} from './pipes/grandFilterPipe';

@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    LoaderComponent
  ]
})

export class SharedModule {
}
