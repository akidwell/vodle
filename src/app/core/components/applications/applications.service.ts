import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/config/config.service';
import { IApplication } from './application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getApplications(): Observable<IApplication[]> {
    return this.http.get<IApplication[]>(this.config.apiBaseUrl + 'api/lookups/applications');
  }

}
