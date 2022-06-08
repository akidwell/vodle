import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class APIVersionService {
  apiVersion = '1.0';
  constructor(private config: ConfigService) {
    this.apiVersion = this.config.defaultApiVersion;
  }

  get getApiVersion(): string {
    return this.apiVersion;
  }
  set setApiVersion(version: string) {
    this.apiVersion = version;
  }
}
