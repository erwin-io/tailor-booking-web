import { StorageService } from 'src/app/core/storage/storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppConfigService } from '../services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  sessionTimeout;
  constructor(private authService: AuthService, private router: Router, private storageService: StorageService,
    private appconfig: AppConfigService) {
    this.sessionTimeout = Number(this.appconfig.config.sessionConfig.sessionTimeout);
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      console.log(next);
    const url: string = state.url;
    // this.checkURLRedirect(url, next.queryParams ? Object.entries(next.queryParams) : []);
    if (this.storageService.getSessionExpiredDate()) {
      const today: any = new Date();
      const sessionExpiredDate: any = new Date(
        this.storageService.getSessionExpiredDate()
      );
      const diffTime = today - sessionExpiredDate;
      if (diffTime > 0) {
        this.authService.redirectUrl = url;
        console.log('session expire line 32');
        const user = this.storageService.getLoginUser();
        await this.authService.logout(user?.userId);
        return false;
      } else {
        today.setTime(today.getTime() + this.sessionTimeout * 1000);
        this.storageService.saveSessionExpiredDate(today);
      }
    } else {
      this.authService.redirectUrl = url;
      console.log('session expire line 41');
      const user = this.storageService.getLoginUser();
      await this.authService.logout(user?.userId);
      return false;
    }

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    
    const user = this.storageService.getLoginUser();
    const refresh_token = this.storageService.getRefreshToken();
    // const token = this.getRefreshToken(user.userId, refresh_token);

    if (!user || !refresh_token || refresh_token === '') {
      this.authService.redirectUrl = url;
      this.handleLogout();
      return false;
    }
    // Store the attempted URL for redirecting
    // Navigate to the login page with extras
    this.authService.refreshToken({userId: user.userId, refresh_token}).pipe(
      tap(token => {
        if(!token) {
          this.handleLogout();
          return false;
        }
        else {
          this.storageService.saveAccessToken(token.accessToken);
          this.storageService.saveRefreshToken(token.refreshToken);
          return true;
        }
      })
    );
    return true;
  }

  checkURLRedirect(url, routeParams) {
    if(routeParams.filter(x=>x[0].toLowerCase().includes("redirected") || x[1].toLowerCase().includes("true"))) {
      return;
    }
    const path = url.split("?")[0];
    const urlMigration:{path: string; redirectTo: string, params, urlPathFormat: string}[] = this.appconfig.config.urlMigration;
    let newPath = "";
    const getRouteAndRedirection = urlMigration.filter(x=>x.path.includes(path))[0];
    if(getRouteAndRedirection) {
      newPath = getRouteAndRedirection.urlPathFormat;
      for(let param of routeParams) {
        const paramKey = param[0];
        const paramValue = param[1];
        if(newPath.includes(paramKey)) {
          newPath = newPath.replace(`:${paramKey}`, paramValue);
        }
      }
      
    } else {
      newPath = path;
    }
    console.log(newPath + "");
    this.router.navigate([newPath], { replaceUrl: true, queryParams: { redirected: 'true' }});
  }

  async handleLogout() {
    const user = this.storageService.getLoginUser();
    await this.authService.logout(user?.userId);
  }
}
