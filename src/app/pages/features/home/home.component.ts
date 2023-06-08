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
import { MatTableDataSource } from "@angular/material/table";  
import { ReservationService } from 'src/app/core/services/reservation.service';
import { UserService } from 'src/app/core/services/user.service';


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

  dataSource = new MatTableDataSource<any>();
  customerDataSource = new MatTableDataSource<any>();
  staffDataSource = new MatTableDataSource<any>();

  isAdvanceSearch = false;
  isLoadingFilter = false;

  summary: any[];
  vetSummary: any[];
  slides: SlideInterface[] = [
    { url: '../../../../assets/img/vector/app_banner-long.png', title: 'banner' },
    { url: '../../../../assets/img/vector/home-banner-contact.jpg', title: 'contact' },
    { url: '../../../../assets/img/vector/home-banner-black.jpg', title: 'black' }
  ];
  constructor(
    private deviceService: DeviceDetectorService,
    private storageService: StorageService,
    private reservationService: ReservationService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: Snackbar
  ) {
    this.user = this.storageService.getLoginUser();
    this.getReservations();
    this.getCustomers();
    this.getStaff();
  }

  ngOnInit(): void {
    const device = this.deviceService.getDeviceInfo();
    this.storageService.saveDeviceInfo(JSON.stringify(device));
  }

  async getReservations() {
    this.isLoading = true;
    await this.reservationService.getByAdvanceSearch({
      isAdvance: this.isAdvanceSearch,
    })
      .subscribe(async res => {
        if (res.success)
          this.dataSource.data = res.data.length > 0 ? res.data.map((d) => { }) : [];
      }, async (err) => {
        this.isLoading = false;
      });

  }

  async getCustomers() {
    this.userService.getCustomers().subscribe(async res => {
      (res.success)
      this.customerDataSource.data = res.data.length > 0 ? res.data.map((d) => { }) : [];
    });
  }

  async getStaff() {
    this.userService.getStaff().subscribe(async res => {
      (res.success)
      this.staffDataSource.data = res.data.length > 0 ? res.data.map((d) => { }) : [];
    });
  }

}
