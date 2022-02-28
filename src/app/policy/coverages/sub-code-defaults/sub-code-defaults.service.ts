import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { SubCodeDefaults } from './subCodeDefaults';

@Injectable({
  providedIn: 'root'
})
export class SubCodeDefaultsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getSubCodeDefaults(programId: number, coverageDescriptionId: number, policySymbol: string): Observable<SubCodeDefaults> {
    const params = new HttpParams().append('programId', programId).append('coverageDescriptionId', coverageDescriptionId).append('policySymbol', policySymbol);
    return this.http.get<SubCodeDefaults>(this.config.apiBaseUrl + 'api/lookups/sub-code-defaults', { params })
  }

}
