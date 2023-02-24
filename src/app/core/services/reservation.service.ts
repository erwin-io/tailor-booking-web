import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, catchError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ApiResponse } from "../model/api-response.model";
import { Reservation } from "../model/reservation.model";
import { AppConfigService } from "./app-config.service";
import { IServices } from "./interface/iservices";

@Injectable({
  providedIn: 'root',
})
export class ReservationService implements IServices {
  constructor(private http: HttpClient, private appconfig: AppConfigService) {}

  getByAdvanceSearch(params: any): Observable<ApiResponse<Reservation[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.getByAdvanceSearch,
          {params}
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
      );
  }

  getById(reservationId: string): Observable<ApiResponse<Reservation>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.getById +
          reservationId
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
      );
  }

  getReservationForADay(dateString: string): Observable<ApiResponse<Reservation[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.getReservationForADay +
          dateString
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
      );
  }

  createReservation(data: any): Observable<ApiResponse<Reservation>> {
    return this.http
      .post<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.createClientReservation,
        data
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
      );
  }

  rescheduleReservation(data: any): Observable<ApiResponse<Reservation>> {
    return this.http
      .put<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.rescheduleReservation,
        data
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
      );
  }

  updateReservationStatus(data: any): Observable<ApiResponse<Reservation>> {
    return this.http
      .put<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reservation.updateReservationStatus,
        data
      )
      .pipe(
        tap((_) => this.log('reservation')),
        catchError(this.handleError('reservation', []))
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
