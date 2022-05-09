import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { AddressVerificationRequest } from '../../models/address-verification-request';
import { AddressVerificationResponse } from '../../models/address-verification-response';

@Injectable({
  providedIn: 'root'
})
export class AddressVerificationService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getAddressVerification(request: AddressVerificationRequest): Observable<AddressVerificationResponse> {
    return this.http.post<AddressVerificationResponse>(this.config.apiBaseUrl + 'api/lookups/address-verification/',request);
  }

}