import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { Producer } from '../../models/producer';
import { Submission } from '../../models/submission';
import { SubmissionStatus, SubmissionStatusResult } from '../../models/submission-status';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(private http: HttpClient, private config: ConfigService) { }
  getSubmission(id: number): Observable<Submission> {
    return this.http.get<Submission>(this.config.apiBaseUrl + 'api/submissions/' + id.toString())
      .pipe(
        map((receivedData: Submission) => {
          return receivedData;
        }));
  }
  updateSubmissionStatus(submissionStatus: SubmissionStatus): Observable<SubmissionStatusResult> {
    return this.http.post<SubmissionStatusResult>(this.config.apiBaseUrl + 'api/submissions/status', submissionStatus);
  }

  renew(id: number): Observable<SubmissionStatusResult> {
    return this.http.get<SubmissionStatusResult>(this.config.apiBaseUrl + 'api/submissions/' + id.toString() + '/renew');
  }

  // producerSearch(query: string): Observable<Producer[]> {
  //   const params = new HttpParams().append('query', query);
  //   return this.http.get<Producer[]>(this.config.apiBaseUrl + 'api/producer-branch/', { params })
  //     .pipe(
  //       map((receivedData: Producer[]) => {
  //         console.log(receivedData);
  //         return receivedData;
  //       }));
  // }
  // createSubmission(insured: Insured): Observable<Insured> {
  //   return this.http.post<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured);
  // }
  // updateSubmission(insured: Insured): Observable<Insured> {
  //   return this.http.put<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured)
  //     .pipe(
  //       map((receivedData: Insured) => {
  //         const data: insuredANI[] = [];
  //         receivedData.additionalNamedInsureds.forEach(element => {
  //           data.push(new insuredANI(this, element));
  //         });
  //         receivedData.additionalNamedInsureds = data;
  //         receivedData.contacts.forEach(c => { c.isPrimary ? c.isPrimaryTracked = true : null;});
  //         return receivedData;
  //       }));
  //}

}
