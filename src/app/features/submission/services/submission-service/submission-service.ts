import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { Submission } from '../../models/submission';

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
