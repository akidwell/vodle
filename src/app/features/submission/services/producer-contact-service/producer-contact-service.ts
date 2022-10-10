import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { FuzzyProducerContactSearchResponse } from 'src/app/shared/components/producer-contact-search/producer-contact-search.component';
import { ProducerContactClass } from '../../classes/producer-contact-class';
import { ProducerContact } from '../../models/producer-contact';

@Injectable({
  providedIn: 'root'
})
export class ProducerContactService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  updateProducerContact(producerContact: ProducerContactClass): Observable<ProducerContact> {
    const subJSON = producerContact.toJSON();
    const headers = { 'Content-Type': 'application/json'};
    return this.http.put<ProducerContact>(this.config.apiBaseUrl + 'api/lookups/producer-contact/', subJSON, {headers});
  }
  addProducerContact(producerContact: ProducerContactClass): Observable<ProducerContact> {
    const subJSON = producerContact.toJSON();
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post<ProducerContact>(this.config.apiBaseUrl + 'api/lookups/producer-contact/', subJSON, {headers});
  }
  searchProducerContacts(query: string, producerCode: number) {
    const params = new HttpParams().append('query', query ).append('producerCode', producerCode);
    return this.http
      .get<FuzzyProducerContactSearchResponse>(this.config.apiBaseUrl + 'api/lookups/producer-contact/', {params}).pipe(
        tap(response => {
          console.log(response);
        }),
        map(response => {
          const data: ProducerContactClass[] = [];
          response.results.forEach(element => {
            data.push(new ProducerContactClass(element));
          });
          return data;
        })
      );
  }
}
