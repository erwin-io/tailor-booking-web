import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { StorageService } from '../storage/storage.service';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionActivityService {
  sessionInterval: any;
  isSessionExpired = false;
  sessionTimeout = 0;
  constructor(
    private appconfig: AppConfigService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private storageService: StorageService
  ) {
    this.sessionTimeout = Number(
      this.appconfig.config.sessionConfig.sessionTimeout
    );
  }

  start() {
    this.stop();
    this.isSessionExpired = false;
    this.sessionInterval = setInterval(() => {
      this.checkSessionExpredDate();
    }, 1000);
  }

  stop() {
    clearInterval(this.sessionInterval);
    this.isSessionExpired = true;
  }

  async checkSessionExpredDate() {
    if (this.storageService.getSessionExpiredDate()) {
      const today: any = new Date();
      const sessionExpiredDate: any = new Date(
        this.storageService.getSessionExpiredDate()
      );
      const diffTime = today - sessionExpiredDate;
      if (diffTime > 0) {
        this.stop();
            
        const dialogData = new AlertDialogModel();
        dialogData.title = 'Session expired';
        dialogData.message = 'Your session expired'
        dialogData.confirmButton = {
          visible: false,
          text: 'ok',
          color: 'primary',
        };
        dialogData.dismissButton = {
          visible: true,
          text: 'ok',
        };
        const dialogRef = this.dialog.open(AlertDialogComponent, {
          maxWidth: '400px',
          closeOnNavigation: true,
        });

        console.log('logout');
        dialogRef.componentInstance.alertDialogConfig = dialogData;
        dialogRef.afterClosed().subscribe(()=>{
          console.log('logout');
          this.handleLogout();
        });
      }
    } else {
    }
  }

  handleLogout() {
    this.stop();
    this.storageService.saveAccessToken(null);
    this.storageService.saveRefreshToken(null);
    this.storageService.saveLoginUser(null);
    window.location.href = 'auth/login';
    this.authService.logout();
  }

  resetSession() {
    console.log('reset');
    const today = new Date();
    today.setTime(today.getTime() + this.sessionTimeout * 1000);
    this.storageService.saveSessionExpiredDate(today);
  }
}
