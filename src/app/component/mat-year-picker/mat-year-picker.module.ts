import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatYearPickerComponent } from './mat-year-picker.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [MatYearPickerComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [MatYearPickerComponent],
  entryComponents: [MatYearPickerComponent],
})
export class MatYearPickerModule { }
