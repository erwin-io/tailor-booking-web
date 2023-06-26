import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ImageSliderModule } from 'src/app/shared/image-slider/image-slider.module';
import { GuestViewComponent } from './guest-view/guest-view.component';
import { InternalViewComponent } from './internal-view/internal-view.component';
import { InternalTopComponent } from './internal-view/internal-top/internal-top.component';
import { InternalBodyComponent } from './internal-view/internal-body/internal-body.component';
import { MatYearMonthPickerModule } from 'src/app/component/mat-year-month-picker/mat-year-month-picker.module';
import { MatYearPickerModule } from 'src/app/component/mat-year-picker/mat-year-picker.module';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [HomeComponent, GuestViewComponent, InternalViewComponent, InternalTopComponent, InternalBodyComponent],
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
export class HomeModule { }

