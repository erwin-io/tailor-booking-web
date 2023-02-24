import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { SelectTimeslotComponent } from "src/app/component/select-timeslot/select-timeslot.component";
import { ViewClientInfoComponent } from "src/app/component/view-client-info/view-client-info.component";
import { ReservationStatusEnum } from "src/app/core/enums/reservation-status.enum";
import { RoleEnum } from "src/app/core/enums/role.enum copy";
import { Messages } from "src/app/core/model/messages.model";
import { Reservation } from "src/app/core/model/reservation.model";
import { AppConfigService } from "src/app/core/services/app-config.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { StorageService } from "src/app/core/storage/storage.service";
import { Snackbar } from "src/app/core/ui/snackbar";
import { AlertDialogModel } from "src/app/shared/alert-dialog/alert-dialog-model";
import { AlertDialogComponent } from "src/app/shared/alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-view-reservation',
  templateUrl: './view-reservation.component.html',
  styleUrls: ['./view-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewReservationComponent implements OnInit {
  reservation: Reservation;
  currentUserId: string;
  mediaWatcher: Subscription;
  isLoading = false;
  isProcessing = false;
  isUploading = false;
  isLoadingRoles = false;
  error;
  statusEnum = ReservationStatusEnum;
  roleEnum = RoleEnum;
  allowedAction = {
    approval: false,
    complete: false,
    cancelation: false,
    reschedule: false
  };
  reservationAction = {
    approval: false,
    complete: false,
    cancelation: false,
    reschedule: false,
  };
  messages: any[] = [];
  currentMessagePage = 0;
  loadingMessage = false;
  isSendingMessage = false;
  connect = false;
  tabIndex = 1;
  diagnosisAndTreatment: FormControl = new FormControl(null, [Validators.required]);

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private reservationService: ReservationService,
    private snackBar: Snackbar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    public router: Router,
  ) {
    this.initAllowedAction();
  }

  get getSelectedIndex() {
    return this.connect ? 1 : 0;
  }

  ngOnInit(): void {
    this.currentUserId = this.storageService.getLoginUser().userId;
    const reservationId = this.route.snapshot.paramMap.get('reservationId');
    this.initReservation(reservationId);
  }

  initAllowedAction() {
    this.allowedAction.approval =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString();
    this.allowedAction.complete =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString();
    this.allowedAction.cancelation =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString() ||
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.FRONTDESK.toString();
    this.allowedAction.reschedule =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString() ||
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.FRONTDESK.toString();

      console.log(this.allowedAction);
  }

  initReservationAction() {
    this.reservationAction.approval = this.reservation.reservationStatus.reservationStatusId ===
    this.statusEnum.PENDING.toString();
    this.reservationAction.complete = this.reservation.reservationStatus.reservationStatusId ===
      this.statusEnum.APPROVED.toString();
    this.reservationAction.cancelation = this.reservation.reservationStatus.reservationStatusId ===
      this.statusEnum.PENDING.toString();
    this.reservationAction.reschedule = this.reservation.reservationStatus.reservationStatusId ===
    this.statusEnum.PENDING.toString();
  }

  initReservation(reservationId: string) {
    this.isLoading = true;
    try {
      this.reservationService.getById(reservationId).subscribe(
        (res) => {
          if (res.success) {
            console.log(res.data);
            this.reservation = res.data;
            this.initReservationAction();
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.error = Array.isArray(res.message)
              ? res.message[0]
              : res.message;
            this.snackBar.snackbarError(this.error);
            if (this.error.toLowerCase().includes('not found')) {
              this.router.navigate(['/reservations/']);
            }
          }
        },
        async (err) => {
          this.isLoading = false;
          this.error = Array.isArray(err.message)
            ? err.message[0]
            : err.message;
          this.snackBar.snackbarError(this.error);
          if (this.error.toLowerCase().includes('not found')) {
            this.router.navigate(['/reservations/']);
          }
        }
      );
    } catch (e) {
      this.isLoading = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.snackbarError(this.error);
      if (this.error.toLowerCase().includes('not found')) {
        this.router.navigate(['/reservations/']);
      }
    }
  }

  async onReschedule() {
    const dialogRef = this.dialog.open(SelectTimeslotComponent, {
      closeOnNavigation: true,
      panelClass: 'select-timeslot-dialog',
    });
    dialogRef.componentInstance.data = {
      reservationDate: new Date(moment(this.reservation.reservationDate).format("YYYY-MM-DD")),
      selectTime: moment(new Date( `${this.reservation.reservationDate} ${this.reservation.time}`)).format("HH:mm"),
      durationInHours: 1,
      minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      reservationId: this.reservation.reservationId,
      reschedule: true
    };
    dialogRef.componentInstance.conFirm.subscribe(async (data: { appointmentDate: Date; selectTime: string}) => {
        this.currentUserId = this.storageService.getLoginUser().userId;
        const reservationId = this.route.snapshot.paramMap.get('reservationId');
        this.initReservation(reservationId);
      dialogRef.close();
    });
  }

  changeStatus(reservationStatusId: number) {
    const status = [2,3,4];
    if(!status.includes(reservationStatusId)){
      return;
    }
    const params = {
      reservationId: this.reservation.reservationId,
      reservationStatusId: reservationStatusId,
      isUpdatedByClient: false
    };
    const dialogData = new AlertDialogModel();
    if(reservationStatusId === 2) {
      dialogData.title = 'Confirm Approve';
      dialogData.message = 'Approve reservation?';
    }
    else if(reservationStatusId === 3) {
      dialogData.title = 'Confirm Complete';
      dialogData.message = 'Complete reservation?';
    }
    else if(reservationStatusId === 4) {
      dialogData.title = 'Confirm Complete';
      dialogData.message = 'Complete reservation?';
    }
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
    dialogRef.componentInstance.conFirm.subscribe(async (confirm: any) => {
      if(confirm) {
        this.isProcessing = true;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        try {
          this.reservationService
            .updateReservationStatus(params)
            .subscribe(
              async (res) => {
                if (res.success) {
                  dialogRef.close();
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  if(reservationStatusId === this.statusEnum.APPROVED) {
                    this.snackBar.snackbarSuccess("Reservation approved!");
                  }
                  else if(reservationStatusId === this.statusEnum.COMPLETED) {
                    this.snackBar.snackbarSuccess("Reservation completed!");
                  }
                  else if(reservationStatusId === this.statusEnum.CANCELLED) {
                    this.snackBar.snackbarSuccess("Reservation cancelled!");
                  }
                  this.initReservation(this.reservation.reservationId);
                } else {
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  this.error = Array.isArray(res.message)
                    ? res.message[0]
                    : res.message;
                  this.snackBar.snackbarError(this.error);
                }
              },
              async (err) => {
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                this.error = Array.isArray(err.message)
                  ? err.message[0]
                  : err.message;
                this.snackBar.snackbarError(this.error);
              }
            );
        } catch (e) {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(e.message) ? e.message[0] : e.message;
          this.snackBar.snackbarError(this.error);
        }
      }
    });
  }

  async viewClientInfo(userId) {
    const dialogRef = this.dialog.open(ViewClientInfoComponent, {
      closeOnNavigation: false,
      maxWidth: '500px',
      width: '500px',
    });
    dialogRef.componentInstance.userId = userId;
  }
}
