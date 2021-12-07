import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { LineItemDescription } from './line-item-description';

@Injectable({
  providedIn: 'root'
})
export class LineItemDescriptionsService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getLineItemDescriptions(state: string, effectiveDate: Date): Observable<LineItemDescription[]> {
    const params = new HttpParams().append('state', state).append('effectiveDate', effectiveDate.toString());
    return this.http.get<LineItemDescription[]>(this.config.apiBaseUrl + 'api/line-item-descriptions', { params })
  }
}
