import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';

@Injectable({
  providedIn: 'root'
})
export class SubmissionActivityService {


  constructor(private http: HttpClient, private config: ConfigService) { }

  getSubmissionActivityByInsuredCode(insuredCode: number): Observable<SubmissionSearchResponses[]> {
    return this.http.get<SubmissionSearchResponses[]>(this.config.apiBaseUrl + 'api/submissions/submission-activity/' + insuredCode);
  }
}