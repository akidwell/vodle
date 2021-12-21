import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: any;
  private http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  loadAppConfig() {
    return this.http.get('./assets/config/config.json')
      .toPromise()
      .then(config => {
        this.appConfig = config;
      });
  }

  get apiBaseUrl(): string {
    return this.appConfig.apiBaseUrl;
  }

  get getBuildVersion(): string {
    return this.appConfig.buildVersion;
  }

  get oktaPostLogoutRedirectUri(): string {
    return this.appConfig.oktaPostLogoutRedirectUri;
  }

  get oktaClientId(): string {
    return this.appConfig.oktaClientId;
  }

  get oktaIssuer(): string {
    return this.appConfig.oktaIssuer;
  }

  get oktaScopes(): string {
    return this.appConfig.oktaScopes;
  }
  get oktaRedirectUri(): string {
    return this.appConfig.oktaRedirectUri;
  }
  get preventForcedRedirect(): string {
    return this.appConfig.preventForcedRedirect;
  }
}
