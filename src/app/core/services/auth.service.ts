import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

import { catchError, tap } from 'rxjs/operators';
import { IServices } from './interface/iservices';
import { AppConfigService } from './app-config.service';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IServices {

  isLoggedIn = false;
  redirectUrl: string;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private storageService: StorageService,
    private appconfig: AppConfigService) { }

  login(data: any): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.login, data)
    .pipe(
      tap(_ => this.isLoggedIn = true),
      catchError(this.handleError('login', []))
    );
  }

  async logout(userId: string) {
    if(userId && userId !== "") {
      await this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.logout, { userId })
      .pipe(
        tap(_ => this.isLoggedIn = true),
        catchError(this.handleError('logout', []))
      ).toPromise();
    }
    this.storageService.saveAccessToken(null);
    this.storageService.saveRefreshToken(null);
    this.storageService.saveSessionExpiredDate(null);
    this.storageService.saveLoginUser(null);
    this.router.navigate(['/auth/login'], { replaceUrl: true });
    return;
  }

  register(data: any, userType: number){
    if(userType === 1){
      return this.registerStaff(data);
    }
    else{
      return this.registerCustomer(data);
    }
  }

  registerCustomer(data: any): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.register.customer, data)
    .pipe(
      tap(_ => this.log('register')),
      catchError(this.handleError('register', []))
    );
  }

  registerStaff(data: any): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.register.staff, data)
    .pipe(
      tap(_ => this.log('register')),
      catchError(this.handleError('register', []))
    );
  }

  findByUsername(username: string): Observable<any> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.findByUsername + username)
    .pipe(
      tap(_ => this.log('findByUsername')),
      catchError(this.handleError('findByUsername', []))
    );
  }

  refreshToken(data: any): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.refreshToken, data)
    .pipe(
      tap(_ => this.log('refresh token')),
      catchError(this.handleError('refresh token', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
