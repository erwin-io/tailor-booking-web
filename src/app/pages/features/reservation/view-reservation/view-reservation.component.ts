import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { ScheduleDialogComponent } from "src/app/component/schedule-dialog/schedule-dialog.component";
import { SelectPeopleComponent } from "src/app/component/select-people/select-people.component";
import { ViewCustomerInfoComponent } from "src/app/component/view-customer-info/view-customer-info.component";
import { ReservationStatusEnum } from "src/app/core/enums/reservation-status.enum";
import { RoleEnum } from "src/app/core/enums/role.enum copy";
import { Messages } from "src/app/core/model/messages.model";
import { Reservation } from "src/app/core/model/reservation.model";
import { Staff } from "src/app/core/model/staff.model";
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
  assignedStaff: { id: string, fullName: string } = null;

  allowedAction = {
    approval: false,
    process: false,
    complete: false,
    decline: false,
  };
  reservationAction = {
    approval: false,
    process: false,
    complete: false,
    decline: false,
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
    this.allowedAction.process =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString();
    this.allowedAction.complete =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString();
    this.allowedAction.decline =
      this.storageService.getLoginUser().role.roleId ===
        this.roleEnum.ADMIN.toString();

      console.log(this.allowedAction);
  }

  initReservationAction() {
    this.reservationAction.approval = this.reservation.reservationStatus.reservationStatusId ===
    this.statusEnum.PENDING.toString();
    this.reservationAction.process = this.reservation.reservationStatus.reservationStatusId ===
    this.statusEnum.APPROVED.toString();
    this.reservationAction.complete = this.reservation.reservationStatus.reservationStatusId ===
      this.statusEnum.PROCESSED.toString();
    this.reservationAction.decline = this.reservation.reservationStatus.reservationStatusId ===
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
            if(res.data.staff && res.data.staff.staffId) {
              this.assignedStaff = { id: res.data.staff.staffId, fullName: res.data.staff.fullName };
            }
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

  assign() {
    const dialogRef = this.dialog.open(SelectPeopleComponent, {
      closeOnNavigation: true,
      panelClass: 'select-staff-dialog',
    });
    dialogRef.componentInstance.typeId = 1;
    dialogRef.componentInstance.conFirm.subscribe(async (data: { id: string, fullName: string }) => {
      if(data){
        this.assignedStaff = data;
      }
      dialogRef.close();
    });
  }

  selectCompletionDate() {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      closeOnNavigation: true,
      panelClass: 'select-date-dialog',
    });
    dialogRef.componentInstance.data = { date: this.reservation.estCompletionDate && this.reservation.estCompletionDate != "" ? this.reservation.estCompletionDate : moment().format("YYYY-MM-DD") };
    dialogRef.componentInstance.canSelectTime = false;
    dialogRef.componentInstance.conFirm.subscribe(async (data: { date: string }) => {
      if(data){
        this.reservation.estCompletionDate = data.date;
      }
      dialogRef.close();
    });
  }

  process() {
    if(!this.assignedStaff || !this.assignedStaff.id) {
      this.snackBar.snackbarError("Please select assigned person!");
      return;
    }
    const params = {
      reservationId: this.reservation.reservationId,
      reservationStatusId: ReservationStatusEnum.PROCESSED.toString(),
      assignedStaffId: this.assignedStaff.id,
      estCompletionDate: this.reservation.estCompletionDate
    };
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm process';
    dialogData.message = 'Process reservation?';
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
            .processOrder(params)
            .subscribe(
              async (res) => {
                if (res.success) {
                  dialogRef.close();
                  this.isProcessing = false;
                  dialogRef.componentInstance.isProcessing = this.isProcessing;
                  this.snackBar.snackbarSuccess("Reservation is now being process!");
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

  changeStatus(reservationStatusId: number) {
    const status = [2,3,4];
    if(!status.includes(reservationStatusId)){
      return;
    }
    const params = {
      reservationId: this.reservation.reservationId,
      reservationStatusId: reservationStatusId,
      isUpdatedByCustomer: false
    };
    const dialogData = new AlertDialogModel();
    if(reservationStatusId === 2) {
      dialogData.title = 'Confirm Approve';
      dialogData.message = 'Approve reservation?';
    }
    else if(reservationStatusId === 3) {
      dialogData.title = 'Confirm process';
      dialogData.message = 'Process reservation?';
    }
    else if(reservationStatusId === 4) {
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
                  else if(reservationStatusId === this.statusEnum.PROCESSED) {
                    this.snackBar.snackbarSuccess("Reservation is now being process!");
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

  async viewCustomerInfo(userId) {
    const dialogRef = this.dialog.open(ViewCustomerInfoComponent, {
      closeOnNavigation: false,
      maxWidth: '500px',
      width: '500px',
    });
    dialogRef.componentInstance.userId = userId;
  }
}
