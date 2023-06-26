import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexTooltip, ApexDataLabels, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';
import { LoginResult } from 'src/app/core/model/loginresult.model';
import { InternalTopComponent } from './internal-top/internal-top.component';
import { InternalBodyComponent } from './internal-body/internal-body.component';
import * as moment from 'moment';

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
  selector: 'app-internal-view',
  templateUrl: './internal-view.component.html',
  styleUrls: ['./internal-view.component.scss']
})
export class InternalViewComponent implements OnInit {
  @Input('user') user: LoginResult;
  @ViewChild('top') top: InternalTopComponent;
  @ViewChild('body') body: InternalBodyComponent;
  resultTypeCtrl = new FormControl("Year");
  resultTypeOptions = ["Year", "Range"];
  maxDate = new Date();
  from: FormControl = new FormControl(new Date());
  to: FormControl = new FormControl(new Date());
  constructor() { }

  ngOnInit(): void {
    this.from.valueChanges.subscribe(async res=> {
      await this.top.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
      await this.body.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
    })
    this.to.valueChanges.subscribe(async res=> {
      await this.top.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
      await this.body.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
    })
  }

  async resultTypeSelected() {
    if(this.resultTypeCtrl.value.toString() === "Year") {
      await this.top.load({
        dateFrom: moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD"),
        dateTo: moment(new Date(new Date().getFullYear(), 11, 31)).format("YYYY-MM-DD"),
      })
      await this.body.load({
        dateFrom: moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD"),
        dateTo: moment(new Date(new Date().getFullYear(), 11, 31)).format("YYYY-MM-DD"),
      })
    } else {
      this.from.setValue(new Date(new Date().getFullYear(), 0, 1));
      this.to.setValue(new Date(new Date().getFullYear(), 11, 31));
      await this.top.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
      await this.body.load({
        dateFrom: moment(this.from.value).format("YYYY-MM-DD"),
        dateTo: moment(this.to.value).format("YYYY-MM-DD"),
      })
    }
  }

  async pickerYearSelected(event) {
    const year = new Date(event).getFullYear();
    await this.top.load({
      dateFrom: moment(new Date(year, 0, 1)).format("YYYY-MM-DD"),
      dateTo: moment(new Date(year, 11, 31)).format("YYYY-MM-DD"),
    })
    await this.body.load({
      dateFrom: moment(new Date(year, 0, 1)).format("YYYY-MM-DD"),
      dateTo: moment(new Date(year, 11, 31)).format("YYYY-MM-DD"),
    })
  }

}
