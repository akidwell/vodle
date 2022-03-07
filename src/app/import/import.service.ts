import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { ImportPolicy } from './interfaces/import-policy';
import { ImportRequest } from './interfaces/import-request';
import { ImportResult } from './interfaces/import-response';

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
