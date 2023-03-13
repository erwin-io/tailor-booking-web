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
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScheduleDialogComponent implements OnInit {
  data: any;
  time;
  date: FormControl = new FormControl();
  // time:FormControl = new FormControl([null, Validators.required]);
  defaultValue: Date;
  isProcessing = false;
  conFirm = new EventEmitter();
  isLoading = false;
  canSelectTime = false;
  error;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: Snackbar,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>
  ) {
    dialogRef.disableClose = true;
    this.date.addValidators([Validators.required]);
  }
  ngOnInit(): void {
    this.date.setValue(this.data.date);
    this.time = this.data.time;
  }

  get formValid() {
    return (
      this.date.valid &&
      this.canSelectTime ? (this.time &&
      (this.data.date != this.date.value ||
        this.time != this.data.time)) : true
    );
  }

  onSubmit(): void {
    if (this.formValid) {
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
          const param = {
            date: moment(this.date.value).format(
              'YYYY-MM-DD'
            ),
            time: this.canSelectTime ? moment(this.time).format('hh:mm') : null,
          };
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
