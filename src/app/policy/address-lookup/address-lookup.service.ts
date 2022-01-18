import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { AddressLookup } from './addressLookup';

@Injectable({
  providedIn: 'root'
})
export class AddressLookupService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getAddress(zipCode: string): Observable<AddressLookup | null> {
    const params = new HttpParams().append('zipCode', zipCode);
    return this.http.get<AddressLookup>(this.config.apiBaseUrl + 'api/lookups/address', { params })
      .pipe(
        catchError(() => {
          return of(null);
        })
      );
  }
}
