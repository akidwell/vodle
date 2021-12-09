import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { InvoiceStatusData } from '../summary/invoice';

@Injectable({
  providedIn: 'root'
})
export class PolicyStatusService {
  status = new BehaviorSubject<string>("");
  readonly = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private config: ConfigService) { }

  refreshPolicyStatus(policyId: number, endorsementNo: number) {
    this.http.get<InvoiceStatusData>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/invoice-status').subscribe(
      data => {
        this.status.next(data?.invoiceStatusDescription ?? "");
        // GAM - commented out until bugfix
        const editFlag = data == null ? true : (data.invoiceStatus == "N" || (data.invoiceStatus == "T" && data.proFlag == 0));
        this.readonly.next(!editFlag);
      }
    );
  }
}
