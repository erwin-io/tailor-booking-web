import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ChartComponent,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from 'ng-apexcharts';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { forkJoin, Observable } from 'rxjs';
import { LoginResult } from 'src/app/core/model/loginresult.model';
import { FormControl } from '@angular/forms';
import { YearPickerDialogComponent } from 'src/app/component/year-picker-dialog/year-picker-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarPickerDialogComponent } from 'src/app/component/calendar-picker-dialog/calendar-picker-dialog.component';
import { SlideInterface } from 'src/app/shared/image-slider/types/slide.interface';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: LoginResult;
  constructor(
    private storageService: StorageService) {
    this.user = this.storageService.getLoginUser();
  }

  ngOnInit(): void {
  }

}
