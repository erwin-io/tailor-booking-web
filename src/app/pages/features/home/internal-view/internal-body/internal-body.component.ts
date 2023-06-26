import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LoginResult } from 'src/app/core/model/loginresult.model';
import { ChartOptions } from '../internal-view.component';
import { ChartComponent } from 'ng-apexcharts';
import moment from 'moment';
import ApexCharts from 'apexcharts';
import { forkJoin } from 'rxjs';
import { MonitoringService } from 'src/app/core/services/monitoring.service';

@Component({
  selector: 'app-internal-body',
  templateUrl: './internal-body.component.html',
  styleUrls: ['./internal-body.component.scss']
})
export class InternalBodyComponent implements OnInit {
  @Input('user') user: LoginResult;
  public chartOptions: Partial<ChartOptions>;
  salesChart: ApexCharts;
  constructor(
    private monitoringService: MonitoringService) { }

  async ngOnInit(): Promise<void> {
    await this.load({
      dateFrom: moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD"),
      dateTo: moment(new Date(new Date().getFullYear(), 11, 31)).format("YYYY-MM-DD"),
    })
    this.salesChart.zoomX(
      new Date(new Date().getFullYear() - 1, 11, 31).getTime(),
      new Date(new Date().getFullYear(),  11, 31).getTime(),
    )
  }

  async load(params: {dateFrom: string;dateTo: string;}) {
    const result = await this.monitoringService.getReservationMonitoring({...params,assignedUserId: this.user.userId}).toPromise();
    const sales: any[][] = result.data[0].map((x: any)=> {
      return [x.date, x.sales];
    });
    const closedBooking: any[][] = result.data[1].map((x: any)=> {
      return [x.date, x.sales];
    });
    this.chartOptions = {
      series: [
        {
          color: '#512DA8',
          name: 'Total Sales',
          data: sales,
        },
        {
          color: '#D32F2F',
          name: 'Total Closed Bookings',
          data: closedBooking,
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        width: "100%"
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: "datetime",
        labels: {
          format: "MMMM dd, yyyy"
        },
      },
      tooltip: {
        y: {
          formatter: (value, options) => {
            // use series argument to pull original string from chart data
            return options.seriesIndex === 0 ? `₱${value.toFixed(2)}` : value.toString();
          },
        },
      }
    }
    if(this.salesChart) {
      await this.salesChart.updateOptions(this.chartOptions)
    } else {
      this.salesChart = new ApexCharts(document.querySelector("#salesChart"), this.chartOptions);
      await this.salesChart.render();
    }
  }




}
