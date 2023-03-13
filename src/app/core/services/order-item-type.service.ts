import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response.model';
import { OrderItemType } from '../model/reservation.model';
import { AppConfigService } from './app-config.service';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class OrderItemTypeService implements IServices {

  constructor(private http: HttpClient, private appconfig: AppConfigService) { }

  get(): Observable<ApiResponse<OrderItemType[]>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.orderItemType)
    .pipe(
      tap(_ => this.log('orderItemType')),
      catchError(this.handleError('orderItemType', []))
    );
  }

  getById(orderItemTypeId: string): Observable<ApiResponse<OrderItemType>> {
    return this.http.get<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.orderItemType + orderItemTypeId)
    .pipe(
      tap(_ => this.log('orderItemType')),
      catchError(this.handleError('orderItemType', []))
    );
  }

  add(data: any): Observable<ApiResponse<OrderItemType>> {
    return this.http.post<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.orderItemType, data)
    .pipe(
      tap(_ => this.log('orderItemType')),
      catchError(this.handleError('orderItemType', []))
    );
  }

  udpdate(data: any): Observable<ApiResponse<OrderItemType>> {
    return this.http.put<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.orderItemType, data)
    .pipe(
      tap(_ => this.log('orderItemType')),
      catchError(this.handleError('orderItemType', []))
    );
  }

  delete(orderItemTypeId: string): Observable<ApiResponse<OrderItemType>> {
    return this.http.delete<any>(environment.apiBaseUrl + this.appconfig.config.apiEndPoints.orderItemType + orderItemTypeId)
    .pipe(
      tap(_ => this.log('orderItemType')),
      catchError(this.handleError('orderItemType', []))
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

