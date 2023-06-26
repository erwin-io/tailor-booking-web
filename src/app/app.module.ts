import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './core/interceptors/token.interceptors';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './pages/features/features.component';
import { MenuListItemComponent } from './pages/features/ui/menu-list-item/menu-list-item.component';
import { FormFieldErrorComponent } from './shared/form-field-error/form-field-error.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { AppConfigService } from './core/services/app-config.service';
import { ScheduleDialogComponent } from './component/schedule-dialog/schedule-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerModule } from './core/directive/mat-timepicker/src/lib/mat-timepicker.module';
import { SelectPeopleComponent } from './component/select-people/select-people.component';
import { UpdateUserPasswordComponent } from './component/update-user-password/update-user-password.component';
import { ViewCustomerInfoComponent } from './component/view-customer-info/view-customer-info.component';
import { MessageComponent } from './component/message/message.component';
import { CallService } from './core/services/call.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { YearPickerDialogComponent } from './component/year-picker-dialog/year-picker-dialog.component';
import { CalendarPickerDialogComponent } from './component/calendar-picker-dialog/calendar-picker-dialog.component';
import { NumberLeadZeroPipePipe } from './core/pipe/number-lead-zero.pipe.pipe';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddPaymentComponent } from './component/add-payment/add-payment.component';
import { UpdateReferenceNumberComponent } from './component/update-reference-number/update-reference-number.component';
import { ReceiptComponent } from './pages/receipt/receipt.component';
import { UserLogsComponent } from './pages/features/user-logs/user-logs.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { DateConstant } from './core/constant/date.constant';
import { MatYearMonthPickerModule } from './component/mat-year-month-picker/mat-year-month-picker.module';


@NgModule({
  declarations: [
    AppComponent,
    MenuListItemComponent,
    FeaturesComponent,
    ProfileComponent,
    FormFieldErrorComponent,
    SnackbarComponent,
    AlertDialogComponent,
    ScheduleDialogComponent,
    SelectPeopleComponent,
    UpdateUserPasswordComponent,
    ViewCustomerInfoComponent,
    MessageComponent,
    YearPickerDialogComponent,
    CalendarPickerDialogComponent,
    NumberLeadZeroPipePipe,
    AddPaymentComponent,
    UpdateReferenceNumberComponent,
    ReceiptComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatTimepickerModule,
    NgApexchartsModule,
    NgxMaterialTimepickerModule,
    MatYearMonthPickerModule
  ],
  providers: [
    CallService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500} },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config : AppConfigService) =>  () => config.loadAppConfig()
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
