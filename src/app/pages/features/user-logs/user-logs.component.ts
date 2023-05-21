import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { ActivityTypeEnum } from 'src/app/core/enums/activity-type.enum';
import { UserTypeEnum } from 'src/app/core/enums/user-type.enum';
import { ActivityLogService } from 'src/app/core/services/activity-log.service';
import { Snackbar } from 'src/app/core/ui/snackbar';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.scss']
})
export class UserLogsComponent implements OnInit {
  error:string;
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];
  isLoading = false;
  loaderData =[];
  isProcessing = false;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  pageSize = 10;
  
  activityTypeIds = [ActivityTypeEnum.USER_LOGIN.toString(), ActivityTypeEnum.USER_LOGOUT.toString()];
  nameCtrl = new FormControl('');
  dateFromCtrl = new FormControl(new Date());
  dateToCtrl = new FormControl(new Date());
  constructor(
    private snackBar: Snackbar,
    private activityLogService: ActivityLogService) { }

  ngOnInit(): void {
    this.displayedColumns = ["username", "name", "activityType", "date", "device" ];
    this.initUserLogs();
  }

  async initUserLogs() {
    try{
      this.isLoading = true;
      await this.activityLogService.getUserLogActivity({
        userTypeId: UserTypeEnum.STAFF,
        activityTypeId: this.activityTypeIds.toString(),
        name: this.nameCtrl.value,
        dateFrom: moment(this.dateFromCtrl.value).format('YYYY-MM-DD'),
        dateTo: moment(this.dateToCtrl.value).format('YYYY-MM-DD'),
      })
      .subscribe(async res => {
        if(res.success){
          this.dataSource.data = res.data.length > 0 ? res.data.map((a)=>{
            return {
              activityLogId: a.activityLogId,
              date: a.date,
              device: `${a.os} ${a.osVersion} ${a.browser}`,
              activityType: a.activityType.activityTypeId === ActivityTypeEnum.USER_LOGIN.toString() ? "Login" : a.activityType.activityTypeId === ActivityTypeEnum.USER_LOGOUT.toString() ? "Logout" : "",
              username: a.user.username,
              name: a.user.staff[0] ? a.user.staff[0]?.name : a.user.username,
            }
          }) : [];
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.snackbarError(this.error);
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.snackbarError(this.error);
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
    }
  }

}
