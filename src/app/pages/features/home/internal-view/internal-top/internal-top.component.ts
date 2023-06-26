import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { LoginResult } from 'src/app/core/model/loginresult.model';
import { MonitoringService } from 'src/app/core/services/monitoring.service';

@Component({
  selector: 'app-internal-top',
  templateUrl: './internal-top.component.html',
  styleUrls: ['./internal-top.component.scss']
})
export class InternalTopComponent implements OnInit {
  isLoading = false;
  totalCustomers = 0;
  totalCorpUsers = 0;
  totalSales = 0;
  totalClosedBooking = 0;
  @Input('user') user: LoginResult;
  constructor(
    private monitoringService: MonitoringService) { 
    }

  async ngOnInit(): Promise<void> {
    await this.load({
      dateFrom: moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD"),
      dateTo: moment(new Date(new Date().getFullYear(), 11, 31)).format("YYYY-MM-DD"),
    });

  }

  async load(params: {dateFrom: string;dateTo: string;}) {
    this.isLoading = true;
    if(['1','2'].includes(this.user.role.roleId.toString())) {
      const result = await forkJoin([
        this.monitoringService.getTotalCustomers(),
        this.monitoringService.getTotalCorporatePeople(),
        this.monitoringService.getTotalSales(params),
        this.monitoringService.getTotalClosedBooking(params)
      ]).toPromise();
      this.totalCustomers = Number(result[0].data);
      this.totalCorpUsers = Number(result[1].data);
      this.totalSales = Number(result[2].data);
      this.totalClosedBooking = Number(result[3].data);
    } else if(['3'].includes(this.user.role.roleId.toString())) {
      const result = await forkJoin([
        this.monitoringService.getTotalSales({...params,assignedUserId: this.user.userId}),
        this.monitoringService.getTotalClosedBooking({...params,assignedUserId: this.user.userId})
      ]).toPromise();
      this.totalSales = Number(result[0].data);
      this.totalClosedBooking = Number(result[1].data);
    } else {
      const result = await forkJoin([
        this.monitoringService.getTotalSales(params),
      ]).toPromise();
      this.totalSales = Number(result[0].data);
    }
    this.isLoading = false;
  }

}
