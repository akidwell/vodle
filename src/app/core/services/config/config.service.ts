import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: any;

  constructor() {
  }

  setAppConfig(appConfig: any) {
    this.appConfig = appConfig;
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
  get defaultPolicyHistorySize(): number {
    return this.appConfig.defaultPolicyHistorySize;
  }
  get defaultApiVersion(): string {
    return this.appConfig.apiVersion;
  }
  get apiSwitchIsActive(): boolean {
    return this.appConfig.apiSwitch;
  }
}
