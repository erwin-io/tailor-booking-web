import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatYearMonthPickerComponent } from './mat-year-month-picker.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MatYearMonthPickerComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [MatYearMonthPickerComponent],
  entryComponents: [MatYearMonthPickerComponent],
})
export class MatYearMonthPickerModule { }
