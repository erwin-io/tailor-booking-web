import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { OrderItemTypeComponent } from './order-item-type/order-item-type.component';
import { OrderItemTypeModule } from './order-item-type/order-item-type.module';

export const routes: Routes = [
  {
    path: 'item-type',
    component: OrderItemTypeComponent
  },

];


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
})

export class ConfigurationModule { }
