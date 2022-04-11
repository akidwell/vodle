import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { SubCodeDefaults } from '../../models/subCodeDefaults';

@Injectable({
  providedIn: 'root'
})
export class SubCodeDefaultsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getSubCodeDefaults(programId: number, coverageDescriptionId: number, policySymbol: string, isClaimsMade: boolean): Observable<SubCodeDefaults> {
    let params = new HttpParams().append('programId', programId).append('coverageDescriptionId', coverageDescriptionId).append('policySymbol', policySymbol).append('isClaimsMade', isClaimsMade);
    return this.http.get<SubCodeDefaults>(this.config.apiBaseUrl + 'api/lookups/sub-code-defaults', { params })
  }

}
