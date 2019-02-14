import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AgmCoreModule } from '@agm/core';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { createTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  AgmCoreModule,
  RatingModule.forRoot(),
  TabsModule.forRoot(),
  InfiniteScrollModule,
  TranslateModule.forRoot({
  loader: {
  provide: TranslateLoader,
  useFactory: (createTranslateLoader),
  deps: [HttpClient]
  }
  })
  ],
  declarations: [
  SearchComponent,
  SearchDetailComponent
  ]
})
export class SearchModule { }
