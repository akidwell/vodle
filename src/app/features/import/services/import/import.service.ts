import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { ImportPolicy } from '../../models/import-policy';
import { ImportRequest } from '../../models/import-request';
import { ImportResult } from '../../models/import-response';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getImportPolicies(): Observable<ImportPolicy[]> {
    return this.http.get<ImportPolicy[]>(this.config.apiBaseUrl + 'api/import-policies')
  }
  
  postImportPolicies(parm: ImportRequest): Observable<ImportResult> {
    return this.http.post<ImportResult>(this.config.apiBaseUrl + 'api/import-policies',parm);
  }
  
}
