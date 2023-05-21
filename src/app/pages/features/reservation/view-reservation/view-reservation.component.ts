import { Component, ViewEncapsulation, OnInit, ViewChild } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription, startWith } from "rxjs";
import { ScheduleDialogComponent } from "src/app/component/schedule-dialog/schedule-dialog.component";
import { SelectPeopleComponent } from "src/app/component/select-people/select-people.component";
import { ViewCustomerInfoComponent } from "src/app/component/view-customer-info/view-customer-info.component";
import { ReservationStatusEnum } from "src/app/core/enums/reservation-status.enum";
import { RoleEnum } from "src/app/core/enums/role.enum";
import { Messages } from "src/app/core/model/messages.model";
import { OrderItem, Reservation } from "src/app/core/model/reservation.model";
import { Staff } from "src/app/core/model/staff.model";
import { AppConfigService } from "src/app/core/services/app-config.service";
import { ReservationService } from "src/app/core/services/reservation.service";
import { StorageService } from "src/app/core/storage/storage.service";
import { Snackbar } from "src/app/core/ui/snackbar";
import { AlertDialogModel } from "src/app/shared/alert-dialog/alert-dialog-model";
import { AlertDialogComponent } from "src/app/shared/alert-dialog/alert-dialog.component";
import { ItemDetailsComponent } from "./item-details/item-details.component";
import { EntityStatusEnum } from "src/app/core/enums/entity-status.enum";
import { AddPaymentComponent } from "src/app/component/add-payment/add-payment.component";
import { UpdateReferenceNumberComponent } from "src/app/component/update-reference-number/update-reference-number.component";
import { PaymentService } from "src/app/core/services/payment.service";
import { ReceiptComponent } from "src/app/pages/receipt/receipt.component";
import { PrintDialogComponent } from "src/app/component/print-dialog/print-dialog.component";

@Component({
  selector: 'app-view-reservation',
  templateUrl: './view-reservation.component.html',
  styleUrls: ['./view-reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewReservationComponent implements OnInit {
  reservation: Reservation = null;
  currentUserId: string;
  mediaWatcher: Subscription;
  isLoading = false;
  isProcessing = false;
  isUploading = false;
  isLoadingRoles = false;
  error;
  statusEnum = ReservationStatusEnum;
  roleEnum = RoleEnum;
  serviceFee = new FormControl(0, [Validators.required]);
  otherFee = new FormControl(0, [Validators.required]);
  assignedStaff: { id: string, fullName: string } = null;

  allowedAction = {
    payment: false,
    approval: false,
    process: false,
    complete: false,
    decline: false,
  };
  reservationAction = {
    payment: false,
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

  dataSourceItems = new MatTableDataSource<any>();
  displayedItemsColumns = [];
  @ViewChild('paginatorItems', {static: false}) paginatorItems: MatPaginator;
  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private reservationService: ReservationService,
    private paymentService: PaymentService,
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

  get serviceFeeValue() {
    return this.reservation ? this.reservation.serviceFee : 0;
  }

  get otherFeeValue() {
    return this.reservation ? this.reservation.otherFee : 0;
  }

  get isPaid() {
    return this.reservation ? this.reservation.payments.some(x=>!x.isVoid) : false;
  }

  get payment() {
    return this.reservation ? this.reservation.payments.filter(x=>!x.isVoid)[0] : null;
  }

  get totalAmountToPay() {
    return this.reservation ? Number(this.reservation.serviceFee) + Number(this.reservation.otherFee) : 0;
  }

  get reservationStatusId() {
    return this.reservation ? Number(this.reservation.reservationStatus?.reservationStatusId) : null;
  }

  ngOnInit(): void {
    this.currentUserId = this.storageService.getLoginUser().userId;
    const reservationId = this.route.snapshot.paramMap.get('reservationId');
    this.initReservation(reservationId);
  }

  ngAfterViewInit() {
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

    this.allowedAction.payment =
    this.storageService.getLoginUser().role.roleId ===
      this.roleEnum.ADMIN.toString() ||
    this.storageService.getLoginUser().role.roleId ===
      this.roleEnum.CASHIER.toString();
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
        async (res) => {
          if (res.success) {
            if(res.data.staff && res.data.staff.staffId) {
              this.assignedStaff = { id: res.data.staff.staffId, fullName: res.data.staff.fullName };
            }
            const items = res.data?.orderItems.filter(x=>x.entityStatus.entityStatusId === EntityStatusEnum.ACTIVE.toString());
            
            this.reservation = res.data;
            this.serviceFee.setValue(res.data.serviceFee);
            this.otherFee.setValue(res.data.otherFee);
            this.initItems(items);
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

  initItems(items: OrderItem[]) {
    if(items && items.length > 0) {
      this.displayedItemsColumns = ['orderItemType', 'quantity', 'remarks', 'controls'];
      this.dataSourceItems.data = items.map(x=> {
        return {
          orderItemType: x.orderItemType.name,
          quantity: x.quantity,
          remarks: x.remarks,
          orderItemAttachments: x.orderItemAttachments
        }
      });
      this.dataSourceItems.paginator = this.paginatorItems;
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
    dialogRef.componentInstance.title = "Select date";
    dialogRef.componentInstance.dateFieldName = "Estimated completion date";
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
    if(!this.reservation.estCompletionDate || !this.reservation.estCompletionDate) {
      this.snackBar.snackbarError("Please select estimated completion date!");
      return;
    }
    if(Number(this.serviceFee.value) <= 0) {
      this.snackBar.snackbarError("Please enter the service fee amount!");
      this.serviceFee.setErrors({ required: true });
      this.serviceFee.markAsTouched();
      return;
    }
    const params = {
      reservationId: this.reservation.reservationId,
      reservationStatusId: ReservationStatusEnum.PROCESSED.toString(),
      assignedStaffId: this.assignedStaff.id,
      estCompletionDate: this.reservation.estCompletionDate,
      serviceFee: this.serviceFee.value
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
    const status = [2,3,4,5];
    if(!status.includes(reservationStatusId)){
      return;
    }
    let params: any = {
      reservationId: this.reservation.reservationId,
      reservationStatusId: reservationStatusId,
      isUpdatedByCustomer: false
    };
    if(reservationStatusId.toString() === "4") {
      params = {
        reservationId: this.reservation.reservationId,
        reservationStatusId: reservationStatusId,
        isUpdatedByCustomer: false,
        otherFee: this.otherFee.value.toString()
      };
    }
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
    else if(reservationStatusId === 5) {
      dialogData.title = 'Confirm Decline';
      dialogData.message = 'Decline reservation?';
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

  async serviceFeeChange(value) {
    if(value && Number(value) > 0) {
      this.serviceFee.setErrors(null);
      this.serviceFee.markAsPristine();
    } else {
      this.serviceFee.setErrors({ required: true});
      this.serviceFee.markAsTouched();
    }
  }
  async otherFeeChange(value) {
    if(value && Number(value) > 0) {
      this.otherFee.setErrors(null);
      this.otherFee.markAsPristine();
    } else {
      this.otherFee.setErrors({ required: true});
      this.otherFee.markAsTouched();
    }
  }

  async pay() {
    const dialogRef = this.dialog.open(AddPaymentComponent, {
      maxWidth: '1000px',
      closeOnNavigation: true,
      panelClass: 'payment-dialog',
    });
    dialogRef.componentInstance.data = {
      newReservation: false,
      reservationId: this.reservation.reservationId,
      paymentDate: new Date(),
    };
    dialogRef.componentInstance.conFirm.subscribe((data: any) => {
      dialogRef.close();
    
      const dialogRefPrint = this.dialog.open(PrintDialogComponent, {
        maxWidth: '1000px',
        width: '500px',
        maxHeight: '720px',
        closeOnNavigation: true,
        panelClass: 'print-dialog',
      });
      dialogRefPrint.componentInstance.reservationId = this.reservation.reservationId;
      dialogRefPrint.componentInstance.conFirm.subscribe((data: any) => {
        dialogRefPrint.close();
      });
      this.currentUserId = this.storageService.getLoginUser().userId;
      const reservationId = this.route.snapshot.paramMap.get('reservationId');
      this.initReservation(reservationId);
    });
  }

  async uppdateReference() {
    const dialogRef = this.dialog.open(UpdateReferenceNumberComponent, {
      closeOnNavigation: false,
      maxWidth: '500px',
      width: '500px',
    });
    dialogRef.componentInstance.data = {
      paymentId: this.payment.paymentId
    };
    dialogRef.componentInstance.conFirm.subscribe((data: any) => {
      dialogRef.close();
      this.currentUserId = this.storageService.getLoginUser().userId;
      const reservationId = this.route.snapshot.paramMap.get('reservationId');
      this.initReservation(reservationId);
    });
  }

  async voidPayment() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm void';
    dialogData.message = 'Void payment?';
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
    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        await this.paymentService
          .void({
            paymentId: this.payment.paymentId,
          })
          .subscribe(
            async (res) => {
              if (res.success) {
                this.isProcessing = false;
                dialogRef.componentInstance.isProcessing = this.isProcessing;
                this.snackBar.snackbarSuccess("Payment void!");
                const reservationId = this.route.snapshot.paramMap.get('reservationId');
                await this.initReservation(reservationId);
                dialogRef.close();
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
      // dialogRef.close();
    });
  }

  async viewItemDetails(details: OrderItem) {
    const dialogRef = this.dialog.open(ItemDetailsComponent, {
      closeOnNavigation: false,
      maxWidth: '500px',
      width: '500px',
    });
    dialogRef.componentInstance.details = details;
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
