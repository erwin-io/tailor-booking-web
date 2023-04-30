import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatTimepickerModule } from 'src/app/core/directive/mat-timepicker/src/lib/mat-timepicker.module';
import { CallService } from 'src/app/core/services/call.service';
import { ViewReservationComponent } from './view-reservation/view-reservation.component';
import { ItemDetailsComponent } from './view-reservation/item-details/item-details.component';
import { ClickOutsideDirective } from 'src/app/core/directive/click-outside.directive';

export const routes: Routes = [
  {
    path: '',
    component: ReservationComponent,
    pathMatch: 'full'
  },
  {
    path: 'details/:reservationId',
    component: ViewReservationComponent
  },
];


@NgModule({
  declarations: [ReservationComponent, ViewReservationComponent, ItemDetailsComponent, 
    ClickOutsideDirective],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatTimepickerModule,
  ]
})
export class ReservationModule { }
