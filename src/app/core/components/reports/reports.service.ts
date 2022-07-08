import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../services/config/config.service';
import { IReport } from './report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getReports(): Observable<IReport[]> {
    return this.http.get<IReport[]>(this.config.apiBaseUrl + 'api/lookups/reports');
  }

}
