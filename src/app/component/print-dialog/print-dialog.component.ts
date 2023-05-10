import { Component, ElementRef, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintDialogComponent implements OnInit {
  reservationId;
  url;
  conFirm = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) {
   }

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("/receipt/" + this.reservationId);
  }

  print(document) {
    document.contentWindow.postMessage('print', '*')
  }
}

