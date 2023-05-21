import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLogsComponent } from './user-logs.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from 'src/app/material/material.module';
export const routes: Routes = [
  {
    path: '',
    component: UserLogsComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [UserLogsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    RouterModule.forChild(routes)
  ]
})
export class UserLogsModule { }
