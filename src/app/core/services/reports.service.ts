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
export class ReportsService {
  constructor(private http: HttpClient, private appconfig: AppConfigService) {}

  getSalesAdvance(params: any): Observable<ApiResponse<SalesModel[]>> {
    return this.http
      .get<any>(
        environment.apiBaseUrl +
          this.appconfig.config.apiEndPoints.reports.getSalesAdvance,
          {params}
      )
      .pipe(
        tap((_) => this.log('reports')),
        catchError(this.handleError('reports', []))
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
