import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/core/services/reports.service';
import { Report } from 'src/app/core/model/report.model';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ReservationService } from 'src/app/core/services/reservation.service';
import * as moment from 'moment';
import { SalesModel } from 'src/app/core/model/sales.model';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { DateConstant } from 'src/app/core/constant/date.constant';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  error: string;
  pageSize = 10;
  isProcessing = false;
  maxDate = new Date();
  dailyCtrl: FormControl = new FormControl(new Date());
  weekCtrl: FormControl = new FormControl(new Date());
  selectedWeekCtrl: FormControl = new FormControl(null);
  weekOptions = [];
  monthCtrl: FormControl = new FormControl(new Date());
  yearCtrl: FormControl = new FormControl(new Date());
  from: FormControl = new FormControl(new Date());
  to: FormControl = new FormControl(new Date());
  resultTypeCtrl: FormControl;
  resultTypeOptions = [];
  isLoading = false;

  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;

  get filterDirty() {
    return (
      this.resultTypeCtrl.dirty ||
      this.dailyCtrl.dirty ||
      this.weekCtrl.dirty ||
      this.selectedWeekCtrl.dirty ||
      this.monthCtrl.dirty ||
      this.yearCtrl.dirty ||
      this.from.dirty ||
      this.to.dirty
    );
  }

  dataSource = new MatTableDataSource<SalesModel>();
  displayedColumns = [];
  loaderData = [];
  @ViewChild('paginator', { static: false }) paginator: MatPaginator;

  constructor(
    private reservationService: ReservationService,
    private reportsService: ReportsService,
    private snackBar: Snackbar,
    private dialog: MatDialog,
    public router: Router,
    private appConfig: AppConfigService
  ) {
    this.resultTypeOptions = this.appConfig.config.lookup.resultType;
  }

  async ngOnInit(): Promise<void> {

    this.resultTypeCtrl = new FormControl(1);
    this.displayedColumns = [
      'customerName',
      'amount',
      'paymentDate',
      'referenceNo',
      'paymentType',
      'reservationCode',
      'tailorName',
    ];
    this.generateLoaderData(this.pageSize);
  }

  async generateReport() {
    this.resultTypeCtrl.markAsPristine();
    this.dailyCtrl.markAsPristine();
    this.weekCtrl.markAsPristine();
    this.selectedWeekCtrl.markAsPristine();
    this.monthCtrl.markAsPristine();
    this.yearCtrl.markAsPristine();
    this.from.markAsPristine();
    this.to.markAsPristine();
    await this.getData();
  }

  async print() {
    this.iframe.nativeElement.contentWindow.print();
  }

  async export() {
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.iframe.nativeElement.contentWindow.document);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let fileName = this.getReportDateLabel();
    XLSX.writeFile(wb, `Sales Report (${fileName}).xlsx`);
  }

  async getData() {
    try {
      let params;
      if (Number(this.resultTypeCtrl.value) === 1) {
        params = {
          dateFrom: moment(this.dailyCtrl.value).format('YYYY-MM-DD'),
          dateTo: moment(this.dailyCtrl.value).format('YYYY-MM-DD'),
        };
      } else if (Number(this.resultTypeCtrl.value) === 2) {
        const week = this.selectedWeekCtrl.value;
        params = {
          dateFrom: moment(week.firstDate).format('YYYY-MM-DD'),
          dateTo: moment(week.lastDate).format('YYYY-MM-DD'),
        };
      } else if (Number(this.resultTypeCtrl.value) === 3) {
        const date = new Date(this.monthCtrl.value), y = date.getFullYear(), m = date.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);
        params = {
          dateFrom: moment(firstDay).format('YYYY-MM-DD'),
          dateTo: moment(lastDay).format('YYYY-MM-DD'),
        };
      } else if (Number(this.resultTypeCtrl.value) === 4) {
        const currentYear = new Date(this.yearCtrl.value).getFullYear();
        const firstDay = new Date(currentYear, 0, 1);
        const lastDay = new Date(currentYear, 11, 31);
        params = {
          dateFrom: moment(firstDay).format('YYYY-MM-DD'),
          dateTo: moment(lastDay).format('YYYY-MM-DD'),
        };
      } else {
        params = {
          dateFrom: moment(this.from.value).format('YYYY-MM-DD'),
          dateTo: moment(this.to.value).format('YYYY-MM-DD'),
        };
      }
      this.isLoading = true;
      await this.reportsService.getSalesAdvance(params).subscribe(
        async (res) => {
          if (res.success) {
            this.dataSource.data = res.data;
            const reportData = res.data.map((x) => {
              return {
                paymentId: x.paymentId,
                customerName: x.customerName,
                amount: `₱${x.amount}`,
                paymentDate: x.paymentDate,
                paymentType: x.paymentType,
                referenceNo: x.referenceNo,
                reservationCode: x.reservationCode,
                tailorName: x.tailorName,
              };
            });
            this.loadReport(reportData);
            this.dataSource.paginator = this.paginator;
            this.isLoading = false;
          } else {
            this.error = Array.isArray(res.message)
              ? res.message[0]
              : res.message;
            this.snackBar.snackbarError(this.error);
            this.isLoading = false;
          }
        },
        async (err) => {
          this.error = Array.isArray(err.message)
            ? err.message[0]
            : err.message;
          this.snackBar.snackbarError(this.error);
          this.isLoading = false;
        }
      );
    } catch (e) {
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
    }
  }

  generateLoaderData(length: number) {
    for (let i = 0; i < length; i++) {
      this.loaderData.push(i);
    }
  }

  resultTypeSelected() {
    this.dataSource.data = [];
    if(this.resultTypeCtrl.value === 1) {

    } else if(this.resultTypeCtrl.value === 2) {
      this.pickerWeekSelected(this.monthCtrl.value);
    } else if(this.resultTypeCtrl.value === 3) {
    } else if(this.resultTypeCtrl.value === 4) {
    } else {
    }
  }

  pickerWeekSelected(event = new Date()) {
    console.log(event);
    const selectedDate = new Date(event);
    var date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const month = selectedDate.getMonth()
    const dates = [];
    while (date.getMonth() === month) {
      dates.push(moment(new Date(date)).format("YYYY-MM-DD HH:mm:ss"));
      date.setDate(date.getDate() + 1);
    }
    
    const weekList = Object.values(dates.reduce((acc, date) => {
      const yearWeek = `${moment(date).year()}-${moment(date).week()}`;
      if (!acc[yearWeek]) {
        acc[yearWeek] = [];
      }
      acc[yearWeek].push(date);
      return acc;
    }, {})).map((x: any)=> {
      return {
        name: moment(x[0]).format("MMM DD") + ' - ' + moment(x[x.length -1]).format("MMM DD, YYYY"),
        firstDate: moment(x[0]).format("YYYY-MM-DD"),
        lastDate: moment(x[x.length -1]).format("YYYY-MM-DD")
      };
    });

    this.weekOptions = weekList;
    if(this.selectedWeekCtrl.value === null || this.selectedWeekCtrl.value === undefined) {
      this.selectedWeekCtrl.setValue(this.weekOptions[0]);
    }
    this.dataSource.data = [];
  }

  pickerMonthSelected(event) {
    this.monthCtrl.setValue(event);
    this.monthCtrl.markAsDirty();
    this.dataSource.data = [];
  }

  pickerYearSelected(event) {
    this.yearCtrl.setValue(event);
    this.monthCtrl.markAsDirty();
    this.dataSource.data = [];
  }

  initPrint() {
    this.loadReport(this.dataSource.data);
  }

  loadReport(data: any[]) {
    const columns = [
      { key: 'paymentId', value: '	Payment #', width: 10 },
      { key: 'customerName', value: 'Customer', width: 15 },
      { key: 'amount', value: 'Amount', width: 10 },
      { key: 'paymentDate', value: 'Payment Date', width: 10 },
      { key: 'paymentType', value: 'Payment type', width: 10 },
      { key: 'referenceNo', value: 'Ref #', width: 5 },
      { key: 'reservationCode', value: 'Reservation Code', width: 15 },
      { key: 'tailorName', value: 'Tailor', width: 10 },
    ];
    let subReportName = this.getReportDateLabel();
    this.iframe.nativeElement.contentWindow.document.dispatchEvent(new CustomEvent('loadReport', { detail: { 
      columns, 
      pageName: "Arbons-Tailoring", 
      reportName: "Sales report", 
      subReportName, 
      data,
      footerText: "Total: ₱" + data.map(x=>x.amount.replace("₱", "")).reduce((partialSum, a) => Number(partialSum) + Number(a), 0)
    } }));
  }

  getReportDateLabel() {
    let dateLabel;
    if (Number(this.resultTypeCtrl.value) === 1) {
      dateLabel = moment(this.dailyCtrl.value).format('MMM DD, YYYY');
    } else if (Number(this.resultTypeCtrl.value) === 2) {
      
      const localDate = new Date(this.dailyCtrl.value);
      const first = localDate.getDate() - localDate.getDay(); // First day of the week
      const last = first + 6; // last day is the first day + 6

      const firstday = new Date(localDate.setDate(first));
      const lastday = new Date(new Date(localDate.setDate(last)).setMonth(firstday.getMonth() + 1));
      const dateFrom = new Date(new Date(firstday).setHours(0,0,0,0));
      const dateTo = new Date(new Date(lastday.setDate(lastday.getDate() + 1)).setHours(0,0,0,0));

      dateLabel = `${moment(dateFrom).format('MMM DD, YYYY')} - ${moment(dateTo).format('MMM DD, YYYY')}`;
    } else if (Number(this.resultTypeCtrl.value) === 3) {
      dateLabel = moment(this.monthCtrl.value).format('MMMM YYYY');
    } else if (Number(this.resultTypeCtrl.value) === 4) {
      dateLabel = moment(this.yearCtrl.value).format('YYYY');
    } else {
      dateLabel = `${moment(this.from.value).format('MMM DD, YYYY')} - ${moment(this.to.value).format('MMM DD, YYYY')}`;
    }
    return dateLabel;
  }
}
