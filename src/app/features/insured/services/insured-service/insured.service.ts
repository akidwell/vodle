import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { InsuredClass } from '../../classes/insured-class';
import { Insured } from '../../models/insured';
import { InsuredContact } from '../../models/insured-contact';
import { InsuredDupeRequest } from '../../models/insured-dupe-request';
import { InsuredDupeResponse } from '../../models/insured-dupe-response';

@Injectable({
  providedIn: 'root'
})
export class InsuredService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getInsured(id: number): Observable<InsuredClass> {
    return this.http.get<Insured>(this.config.apiBaseUrl + 'api/insureds/' + id.toString())
      .pipe(
        map((receivedData: Insured) => {
          const data: insuredANI[] = [];
          receivedData.additionalNamedInsureds.forEach(element => {
            data.push(new insuredANI(this, element));
          });
          receivedData.additionalNamedInsureds = data;
          receivedData.contacts.forEach(c => { c.isPrimary ? c.isPrimaryTracked = true : null; });
          return new InsuredClass(receivedData);
        }));
  }
  addInsured(insured: InsuredClass): Observable<InsuredClass> {
    return this.http.post<InsuredClass>(this.config.apiBaseUrl + 'api/insureds/', insured)
      .pipe(
        map((receivedData: Insured) => {
          const data: insuredANI[] = [];
          receivedData.additionalNamedInsureds.forEach(element => {
            data.push(new insuredANI(this, element));
          });
          receivedData.additionalNamedInsureds = data;
          receivedData.contacts.forEach(c => { c.isPrimary ? c.isPrimaryTracked = true : null; });
          return new InsuredClass(receivedData);
        }));
  }
  updateInsured(insured: InsuredClass): Observable<Insured> {
    const subJSON = insured.toJSON();
    return this.http.put<Insured>(this.config.apiBaseUrl + 'api/insureds/', subJSON).pipe(
      map((receivedData: Insured) => {
        const data: insuredANI[] = [];
        receivedData.additionalNamedInsureds.forEach(element => {
          data.push(new insuredANI(this, element));
        });
        receivedData.additionalNamedInsureds = data;
        receivedData.contacts.forEach(c => { c.isPrimary ? c.isPrimaryTracked = true : null; });
        return receivedData;
      }));
  }

  deleteInsuredContact(contact: InsuredContact): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + contact.insuredCode + '/contacts/' + contact.insuredContactId);
  }

  deleteInsuredAdditionalNamedInsured(aniData: insuredANI): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + aniData.insuredCode + '/additional-insureds/' + aniData.addInsuredCode);
  }

  checkDuplicates(request: InsuredDupeRequest): Observable<InsuredDupeResponse[]> {
    return this.http.post<InsuredDupeResponse[]>(this.config.apiBaseUrl + 'api/insureds/check-duplicates/', request);
  }
}
