import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OrderItem } from 'src/app/core/model/reservation.model';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  isLoading = false;
  details: OrderItem;
  attachments;
  fullScreenImage;
  toggleFullScreen = false;
  @ViewChild('fullscreen', {static: false}) fullscreen: ElementRef<HTMLElement>;;
  constructor(public dialogRef: MatDialogRef<ItemDetailsComponent>) { }

  ngOnInit(): void {
    this.isLoading = true;
    console.log(this.details);
    this.isLoading = false;
  }

  fullScreen(src) {
    this.fullScreenImage = src;
    this.toggleFullScreen = true;
  }
  openImageNewTab() {
    
   window.open(this.fullScreenImage,'Image');
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
