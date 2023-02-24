import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaptismalComponent } from './baptismal.component';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: BaptismalComponent,
    pathMatch: 'full'
  },
];
@NgModule({
  declarations: [
    BaptismalComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([])
  ]
})
export class BaptismalModule { }
