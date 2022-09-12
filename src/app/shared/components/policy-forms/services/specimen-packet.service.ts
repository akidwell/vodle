import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { SpecimenPacket } from '../models/specimen-packet';

@Injectable({
  providedIn: 'root'
})
export class SpecimenPacketService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getSpecimentPacketURL(quoteKey: string, forms: string): Observable<SpecimenPacket> {
    const params = new HttpParams().append('quoteKey', quoteKey ?? '').append('forms', forms ?? '');
    return this.http.get<SpecimenPacket>(this.config.apiBaseUrl + 'api/lookups/specimen-packet', { params });
  }

  getGuideline(formName: string) {
    const params = new HttpParams().append('formName', formName);
    const headers = { 'Content-Type': 'application/pdf'};
    return this.http.get(this.config.apiBaseUrl + 'api/lookups/guideline', { params: params,headers, responseType: 'arraybuffer'});
  }
}