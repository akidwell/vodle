import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class APIVersionService {
  private _apiVersion ='1.0';
  apiVersion$ = new BehaviorSubject<string>('1.0');

  constructor(private config: ConfigService) {
    this._apiVersion = this.config.defaultApiVersion;
    this.apiVersion$.next(this.config.defaultApiVersion);
  }

  get apiVersion(): string {
    return this._apiVersion;
  }

  set apiVersion(version: string) {
    this._apiVersion = version;
    this.apiVersion$.next(version);
  }
}
