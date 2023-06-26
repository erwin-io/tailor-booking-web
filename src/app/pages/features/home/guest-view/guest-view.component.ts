import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginResult } from 'src/app/core/model/loginresult.model';
import { StorageService } from 'src/app/core/storage/storage.service';
import { Snackbar } from 'src/app/core/ui/snackbar';
import { SlideInterface } from 'src/app/shared/image-slider/types/slide.interface';

@Component({
  selector: 'app-guest-view',
  templateUrl: './guest-view.component.html',
  styleUrls: ['./guest-view.component.scss']
})
export class GuestViewComponent implements OnInit {

  isLoading;
  user: LoginResult;

  summary: any[];
  vetSummary: any[];
  slides: SlideInterface[] = [
    { url: '../../../../assets/img/vector/app_banner-long.png', title: 'banner' },
    { url: '../../../../assets/img/vector/home-banner-contact.jpg', title: 'contact' },
    { url: '../../../../assets/img/vector/home-banner-black.jpg', title: 'black' }
  ];
  constructor(
    private deviceService: DeviceDetectorService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private snackBar: Snackbar
  ) {
    this.user = this.storageService.getLoginUser();
  }

  ngOnInit(): void {
    const device = this.deviceService.getDeviceInfo();
    this.storageService.saveDeviceInfo(JSON.stringify(device));
  }

}
