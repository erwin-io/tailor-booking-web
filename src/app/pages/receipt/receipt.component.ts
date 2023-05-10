import { Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { EntityStatusEnum } from 'src/app/core/enums/entity-status.enum';
import { Customer } from 'src/app/core/model/customer.model';
import { ReservationService } from 'src/app/core/services/reservation.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReceiptComponent implements OnInit {
  data: {
    customer: Customer;
    serviceFee: number;
    otherFee: number;
    paymentDate: string;
  } = {
    customer: new Customer(),
    serviceFee: 0,
    otherFee: 0,
    paymentDate: moment().format("YYYY-MM-DD")
  };
  
  conFirm = new EventEmitter();
  constructor(private reservationService: ReservationService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    window.addEventListener("message", (event)=> {
      if (event.data === 'print'){
        window.print();
      }
    }, false);
   
    const reservationId = this.route.snapshot.paramMap.get('reservationId');
    this.initReservation(reservationId)
  }
  

  initReservation(reservationId: string) {
    try {
      this.reservationService.getById(reservationId).subscribe(
        async (res) => {
          if (res.success) {
            this.data.customer = res.data.customer;
            this.data.serviceFee = res.data.serviceFee;
            this.data.otherFee = res.data.otherFee;
            const paymentDate = res.data.payments.filter(x=>!x.isVoid)[0]?.paymentDate;
            this.data.paymentDate = paymentDate && paymentDate !== "" ? paymentDate : moment().format("YYYY-MM-DD");
          } else {
          }
        },
        async (err) => {
        }
      );
    } catch (e) {
    }
  }

}
