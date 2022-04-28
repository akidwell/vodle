import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { ConfigService } from "src/app/core/services/config/config.service";
import { AdditionalNamedInsured, insuredANI } from "src/app/shared/components/additional-named-insured/additional-named-insured";
import { Insured } from "../../models/insured";
import { InsuredContact } from "../../models/insured-contact";

@Injectable({
    providedIn: 'root'
})
export class InsuredService {

    constructor(private http: HttpClient, private config: ConfigService) { }

    getInsured(id: number): Observable<Insured> {
        return this.http.get<Insured>(this.config.apiBaseUrl + 'api/insureds/' + id.toString());
    }
    addInsured(insured: Insured): Observable<Insured> {
        return this.http.post<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured);
    }
    updateInsured(insured: Insured): Observable<Insured> {
        return this.http.put<Insured>(this.config.apiBaseUrl + 'api/insureds/', insured);
    }
    getInsuredContacts(id: number): Observable<InsuredContact[]> {
        return this.http.get<InsuredContact[]>(this.config.apiBaseUrl + 'api/insureds/' + id.toString() + '/contacts/');
    }
    addInsuredContact(contact: InsuredContact): Observable<InsuredContact> {
        return this.http.post<InsuredContact>(this.config.apiBaseUrl + 'api/insureds/contacts/', contact);
    }
    updateInsuredContact(contact: InsuredContact): Observable<boolean> {
        return this.http.put<boolean>(this.config.apiBaseUrl + 'api/insureds/contacts/', contact);
    }
    deleteInsureContact(contact: InsuredContact): Observable<boolean> {
        return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + contact.insuredCode + '/contacts/' + contact.insuredContactId);
    }
    getInsuredAdditionalNamedInsured(insuredId: number): Observable<insuredANI[]> {
        return this.http.get<AdditionalNamedInsured[]>(this.config.apiBaseUrl + 'api/insureds/' + insuredId + '/additional-insureds')
            .pipe(
                map((receivedData: AdditionalNamedInsured[]) => {
                    var data: insuredANI[] = [];
                    receivedData.forEach(element => {
                        data.push(new insuredANI(this, element))
                    });
                    return data;
                }));
    }

    addInsuredAdditionalNamedInsured(aniData: insuredANI): Observable<insuredANI> {
        return this.http.post<insuredANI>(this.config.apiBaseUrl + 'api/insureds/additional-insureds/', aniData);
    }

    updateInsuredAdditionalNamedInsured(aniData: insuredANI): Observable<boolean> {
        return this.http.put<boolean>(this.config.apiBaseUrl + 'api/insureds/additional-insureds/', aniData);
    }
    deleteInsuredAdditionalNamedInsured(aniData: insuredANI): Observable<boolean> {
        return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/insureds/' + aniData.insuredCode + '/additional-insureds/' + aniData.addInsuredCode);
    }
}