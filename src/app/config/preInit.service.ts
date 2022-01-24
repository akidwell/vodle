import { LOCATION_INITIALIZED } from "@angular/common";
import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { ConfigService } from "./config.service";

export function preInitServiceFactory(
  initService: PreInitService,
  injector: Injector
) {
  return () => new Promise(resolve =>
    injector
    .get(LOCATION_INITIALIZED, Promise.resolve(undefined))
        .then(() => resolve(initService.onInit())),
    );
}

@Injectable({providedIn: 'any'})
export class PreInitService {
  constructor(
    private httpBackend: HttpBackend,
    private configService: ConfigService
  ) {
  }

  onInit(): Promise<boolean> {
    const http = new HttpClient(this.httpBackend);
    return http.get('./assets/config/config.json').toPromise()
    .then(config => this.configService.setAppConfig(config))
    .then(_ => true)
  }
}
