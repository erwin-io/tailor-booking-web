import { Time } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import * as moment from 'moment';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { DateConstant } from 'src/app/core/constant/date.constant';
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleDialogComponent implements OnInit {
  data: any;
  dateCtrl: FormControl = new FormControl();
  timeCtrl: FormControl = new FormControl();
  // time:FormControl = new FormControl([null, Validators.required]);
  defaultValue: Date;
  isProcessing = false;
  conFirm = new EventEmitter();
  isLoading = false;
  canSelectTime = false;
  error;
  title;
  dateFieldName
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: Snackbar,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.dateCtrl.addValidators([Validators.required]);
  }
  ngOnInit(): void {
    this.dateCtrl.setValue(this.data.date);
    this.timeCtrl.setValue(moment(this.data.time, DateConstant.DATE_LANGUAGE).format("hh:mm a"));
  }

  get formValid() {
    return (
      this.dateCtrl.valid &&
      this.canSelectTime ? this.timeCtrl.valid : true
    );
  }

  onSubmit(): void {
    if (this.formValid) {
      const param = {
        date: moment(this.dateCtrl.value).format(
          'YYYY-MM-DD'
        ),
        time: this.canSelectTime ? this.timeCtrl.value : null,
      };
      const dialogData = new AlertDialogModel();
      dialogData.title = 'Confirm date';
      dialogData.confirmButton = {
        visible: true,
        text: 'yes',
        color: 'primary',
      };
      dialogData.dismissButton = {
        visible: true,
        text: 'cancel',
      };
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        maxWidth: '400px',
        closeOnNavigation: true,
      });

      dialogRef.componentInstance.alertDialogConfig = dialogData;
      dialogRef.componentInstance.conFirm.subscribe(async (confirmed: any) => {
        if (confirmed) {
          this.isProcessing = true;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
          this.conFirm.emit(param);
        }
      });
    }
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
