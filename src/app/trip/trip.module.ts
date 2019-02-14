import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripComponent } from './trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
  CommonModule,
  FormsModule
  ],
  declarations: [
 TripComponent,
 TripDetailComponent
  ]
})
export class TripModule { }
