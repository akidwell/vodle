import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { IApplication } from './application';

@Injectable({
    providedIn: 'root'
})
export class ApplicationsService {

    constructor(private http: HttpClient, private config: ConfigService) { }

    getApplications(): Observable<IApplication[]> {
        return this.http.get<IApplication[]>(this.config.apiBaseUrl + 'api/applications');
    }

}
