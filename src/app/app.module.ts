import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config/config.service';
import { VersionComponent } from './version/version.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ReportsComponent } from './reports/reports.component';
import { NavigationComponent } from './navigation/navigation.component';
import {OKTA_CONFIG, OktaAuthModule} from '@okta/okta-angular';


const config = {
  clientId: '0oa13ty5ui2LT2Osn1d7',
  issuer: 'https://logindev.gaig.com',
  redirectUri: 'callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

@NgModule({
  declarations: [
    AppComponent,
    VersionComponent,
    ApplicationsComponent,
    ReportsComponent,
    NavigationComponent
  ],
  imports: [
    OktaAuthModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => () => configService.loadAppConfig()
    },
    { provide: OKTA_CONFIG, useValue: config },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }