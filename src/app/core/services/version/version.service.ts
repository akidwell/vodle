import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { newVersion, Version } from '../../models/version';
import { ConfigService } from '../../services/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getVersion(): Observable<Version> {
    return this.http.get<Version>(this.config.apiBaseUrl + 'api/monitoring/version');
  }

  handleError(err: HttpErrorResponse): Observable<Version> {
    // Turned off message until we can send without needing token, this would come up before login!
    // this.errorDialogService.open("Service Error","Cannot connect to the Backend Api. Message: " + err.message);
    return of(newVersion());
  }
}
