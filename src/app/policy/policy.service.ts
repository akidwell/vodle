import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { Policy } from './policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(this.config.apiBaseUrl + 'api/policies/' + id.toString())
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

}
