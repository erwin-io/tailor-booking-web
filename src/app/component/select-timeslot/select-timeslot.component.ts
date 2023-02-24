import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { ReservationService } from 'src/app/core/services/reservation.service';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ScheduleDialogComponent } from '../schedule-dialog/schedule-dialog.component';

@Component({
  selector: 'app-select-timeslot',
  templateUrl: './select-timeslot.component.html',
  styleUrls: ['./select-timeslot.component.scss'],
})
export class SelectTimeslotComponent implements OnInit {
  data: {
    reservationId?: string;
    reschedule?: boolean;
    reservationDate: Date;
    selectTime: string;
    durationInHours: number;
    minDate: Date;
  };
  selectTimeSlotForm: FormGroup;
  isProcessing = false;
  appointmentTime;
  conFirm = new EventEmitter();
  isLoading = false;
  error;
  availableTimeSlot = [];
  constructor(
    private appconfig: AppConfigService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: Snackbar,
    private reservationService: ReservationService,
    public dialogRef: MatDialogRef<SelectTimeslotComponent>
  ) {
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    this.selectTimeSlotForm = this.formBuilder.group({
      reservationDate: [this.data.reservationDate, Validators.required],
      selectTime: [this.data.selectTime, Validators.required],
    });
    console.log(this.selectTimeSlotForm.value);
    this.getReservationForADay(
      moment(this.data.reservationDate).format('YYYY-MM-DD'),
      this.timeSlotOptions(this.data.durationInHours)
    );
    this.f['reservationDate'].valueChanges.subscribe(async (selectedValue) => {
      this.getReservationForADay(
        moment(selectedValue).format('YYYY-MM-DD'),
        this.timeSlotOptions(Number(this.data.durationInHours))
      );
    });
  }

  async onSubmit(): Promise<void> {
    if (this.selectTimeSlotForm.valid) {
      if (this.data.reschedule) {
        const time = this.selectTimeSlotForm.value.selectTime;
        const param = {
          reservationId: this.data.reservationId,
          reservationDate: moment(
            this.selectTimeSlotForm.value.reservationDate
          ).format('YYYY-MM-DD'),
          time: time.split(':')[1].length === 1 ? `${time.split(':')[0]}:0${Number(time.split(':')[1])}` : time
        };
        console.log(param);
        const dialogData = new AlertDialogModel();
        dialogData.title = 'Save';
        dialogData.message =
          'Are you sure you want to reschedule reservation?';
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
          closeOnNavigation: true,
        });

        dialogRef.componentInstance.alertDialogConfig = dialogData;
        dialogRef.componentInstance.conFirm.subscribe(
          async (confirmed: any) => {
            if (confirmed) {
              this.isProcessing = true;
              dialogRef.componentInstance.isProcessing = this.isProcessing;
              await this.reservationService
                .rescheduleReservation(param)
                .subscribe(
                  async (res) => {
                    if (res.success) {
                      this.conFirm.emit(true);
                      this.snackBar.snackbarSuccess('Appointment rescheduled!');
                      dialogRef.close();
                      this.isProcessing = false;
                      dialogRef.componentInstance.isProcessing =
                        this.isProcessing;
                    } else {
                      this.isLoading = false;
                      this.error = Array.isArray(res.message)
                        ? res.message[0]
                        : res.message;
                      this.snackBar.snackbarError(this.error);
                      dialogRef.componentInstance.isProcessing =
                        this.isProcessing;
                    }
                  },
                  async (err) => {
                    this.isProcessing = false;
                    this.error = Array.isArray(err.message)
                      ? err.message[0]
                      : err.message;
                    this.snackBar.snackbarError(this.error);
                    dialogRef.componentInstance.isProcessing =
                      this.isProcessing;
                  }
                );
            }
          }
        );
      } else {
        this.conFirm.emit(this.selectTimeSlotForm.value);
      }
    }
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  get f() {
    return this.selectTimeSlotForm.controls;
  }

  toMinutes = (str) => str.split(':').reduce((h, m) => h * 60 + +m);

  toString = (min) =>
    (Math.floor(min / 60) + ':' + (min % 60)).replace(/\b\d\b/, '0$&');

  // eslint-disable-next-line @typescript-eslint/member-ordering
  timeSlotOptions(hours = 1) {
    const notAvailableHours =
      this.appconfig.config.reservationConfig.timeSlotNotAvailableHours;
    const start = this.toMinutes(
      this.appconfig.config.reservationConfig.timeSlotHours.start
    );
    const end = this.toMinutes(
      this.appconfig.config.reservationConfig.timeSlotHours.end
    );
    const slotOptions = Array.from(
      {
        length:
          Math.floor((end - start) / (60 * Number(hours))) +
          (hours % 2 == 0 ? 1 : 0),
      },
      (_, i) => this.toString(start + i * (60 * Number(hours)))
    );
    return slotOptions.filter((x) => !notAvailableHours.includes(x));
  }

  tConvert(time) {
    if (time.toLowerCase().includes('invalid date')) {
      return;
    }
    time = time.split(':')[1].charAt(1) ? time : time + '0';
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }

  async getReservationForADay(dateString: string, timeSlotOptions: string[]) {
    try {
      this.isLoading = true;
      await this.reservationService
        .getReservationForADay(dateString)
        .subscribe(
          async (res) => {
            if (res.success) {
              const hSlotTaken = res.data.map((r) => {
                const reservationTimeStart = moment(
                  `${r.reservationDate} ${r.time}`
                ).format('HH');
                const appointmentDate = new Date(moment(
                  `${r.reservationDate} ${r.time}`
                ).format('YYYY-MM-DD HH:mm'));
                appointmentDate.setHours(appointmentDate.getHours() + this.data.durationInHours);
                const reservationTimeEnd = moment(appointmentDate).format('HH');
                return {
                  reservationTimeStart,
                  reservationTimeEnd,
                };
              });

              this.availableTimeSlot = timeSlotOptions
                .map((t) => {
                  const h = t.split(':')[0];
                  if (
                    hSlotTaken.filter(
                      (x) =>
                        Number(h) >= Number(x.reservationTimeStart) &&
                        Number(h) < Number(x.reservationTimeEnd)
                    ).length <= 0
                  ) {
                    return t;
                  } else {
                    return null;
                  }
                })
                .filter((x) => x !== null && x !== undefined && x !== '');
              console.log(this.availableTimeSlot);
              this.isLoading = false;
            } else {
              this.error = Array.isArray(res.message)
                ? res.message[0]
                : res.message;
              this.snackBar.snackbarError(this.error);
              this.isLoading = false;
            }
          },
          async (e) => {
            this.error = Array.isArray(e.message) ? e.message[0] : e.message;
            this.snackBar.snackbarError(this.error);
            this.isLoading = false;
          }
        );
    } catch (e) {
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
    }
  }

  getError(key: string) {
    return this.f[key].errors;
  }
}
