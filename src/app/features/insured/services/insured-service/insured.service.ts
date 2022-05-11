import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { Insured } from '../../models/insured';
import { InsuredContact } from '../../models/insured-contact';

@Injectable({
  providedIn: 'root'
})
export class InsuredService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getInsured(id: number): Observable<Insured> {
    return this.http.get<Insured>(this.config.apiBaseUrl + 'api/insureds/' + id.toString())
      .pipe(
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
  addInsured(insured: Insured): Observable<Insured> {
    return this.http.post<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured);
  }
  updateInsured(insured: Insured): Observable<Insured> {
    return this.http.put<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured)
      .pipe(
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

  deleteInsureContact(contact: InsuredContact): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + contact.insuredCode + '/contacts/' + contact.insuredContactId);
  }

  deleteInsuredAdditionalNamedInsured(aniData: insuredANI): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + aniData.insuredCode + '/additional-insureds/' + aniData.addInsuredCode);
  }
}