import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BYPASS_LOG } from '../interceptors/token.interceptors';
import { ApiResponse } from '../model/api-response.model';
import { AppConfigService } from './app-config.service';
import { SalesModel } from '../model/sales.model';

@Injectable({
  providedIn: 'root',
})
export class MonitoringService {
  constructor(private http: HttpClient, private appconfig: AppConfigService) {}

  getTotalCustomers(): Observable<ApiResponse<SalesModel[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.monitoring.getTotalCustomers
      )
      .pipe(
        tap((_) => this.log('monitoring')),
        catchError(this.handleError('monitoring', []))
      );
  }

  getTotalCorporatePeople(): Observable<ApiResponse<SalesModel[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.monitoring.getTotalCorporatePeople
      )
      .pipe(
        tap((_) => this.log('monitoring')),
        catchError(this.handleError('monitoring', []))
      );
  }

  getTotalSales(params: any): Observable<ApiResponse<SalesModel[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.monitoring.getTotalSales,
          {params}
      )
      .pipe(
        tap((_) => this.log('monitoring')),
        catchError(this.handleError('monitoring', []))
      );
  }

  getTotalClosedBooking(params: any): Observable<ApiResponse<SalesModel[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.monitoring.getTotalClosedBooking,
          {params}
      )
      .pipe(
        tap((_) => this.log('monitoring')),
        catchError(this.handleError('monitoring', []))
      );
  }

  getReservationMonitoring(params: any): Observable<ApiResponse<any>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.monitoring.getReservationMonitoring,
          {params}
      )
      .pipe(
        tap((_) => this.log('monitoring')),
        catchError(this.handleError('monitoring', []))
      );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(
        `${operation} failed: ${
          Array.isArray(error.error.message)
            ? error.error.message[0]
            : error.error.message
        }`
      );
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
