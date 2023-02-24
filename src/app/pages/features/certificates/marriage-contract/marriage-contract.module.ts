import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarriageContractComponent } from './marriage-contract.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: MarriageContractComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    MarriageContractComponent
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
export class MarriageContractModule { }
