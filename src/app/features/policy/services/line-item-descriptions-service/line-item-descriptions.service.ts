import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { LineItemDescription } from './line-item-description';

@Injectable({
  providedIn: 'root'
})
export class LineItemDescriptionsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getLineItemDescriptions(state: string, effectiveDate: Date): Observable<LineItemDescription[]> {
    const effectiveDateString = new Date(effectiveDate);
    const params = new HttpParams().append('state', state).append('effectiveDate', effectiveDateString.toISOString().slice(0, 10));
    return this.http.get<LineItemDescription[]>(this.config.apiBaseUrl + 'api/lookups/line-item-descriptions', { params });
  }
}
