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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading;
  user: LoginResult;

  summary: any[];
  vetSummary: any[];
  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private snackBar: Snackbar
  ) {
    this.user = this.storageService.getLoginUser();
  }

  ngOnInit(): void {}

}
