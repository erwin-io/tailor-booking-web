import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageSliderModule } from 'src/app/shared/image-slider/image-slider.module';
import { MatYearMonthPickerComponent } from 'src/app/component/mat-year-month-picker/mat-year-month-picker.component';
import { MatYearMonthPickerModule } from 'src/app/component/mat-year-month-picker/mat-year-month-picker.module';
import { MatYearPickerModule } from 'src/app/component/mat-year-picker/mat-year-picker.module';
export const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    ImageSliderModule,
    RouterModule.forChild(routes),
    MatYearMonthPickerModule,
    MatYearPickerModule
  ]
})
export class ReportsModule { }
