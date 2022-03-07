import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { JobLoggerParameter } from './job-logger-parameter';
import { JobLoggerResponse } from './job-logger-response';

@Injectable({
  providedIn: 'root'
})
export class JobLoggerService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  postJobLogger(parm: JobLoggerParameter): Observable<JobLoggerResponse> {
    return this.http.post<JobLoggerResponse>(this.config.apiBaseUrl + 'api/monitoring/job-logger', parm);
  }
}
