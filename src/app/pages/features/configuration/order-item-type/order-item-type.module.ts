import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
import { OrderItemTypeComponent } from './order-item-type.component';
import { OrderItemTypeAddComponent } from './order-item-type-add/order-item-type-add.component';

export const routes: Routes = [
  {
    path: '',
    component: OrderItemTypeComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [OrderItemTypeComponent, OrderItemTypeAddComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderItemTypeModule { }
