import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './config/config.service';
import { VersionComponent } from './version/version.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ReportsComponent } from './reports/reports.component';
import { NavigationComponent } from './navigation/navigation.component';
import {OKTA_CONFIG, OktaAuthModule} from '@okta/okta-angular';
import { AuthInterceptor } from './authorization/auth.interceptor';
import { JwtModule  } from '@auth0/angular-jwt';
import { UserComponent } from './user/user.component';
import { NgbAlert, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './error-handling/global-error-handler';
import { ServerErrorInterceptor } from './error-handling/server-error-interceptor';
import { FontAwesomeModule  } from '@fortawesome/angular-fontawesome';
import { CoveragesComponent } from './policy/coverages/coverages.component'; 
import { FormsModule } from '@angular/forms';
import { InformationComponent } from './policy/information/information.component';
import { SchedulesComponent } from './policy/schedules/schedules.component';
import { ReinsuranceComponent } from './policy/reinsurance/reinsurance.component';
import { SummaryComponent } from './policy/summary/summary.component';
import { PolicyInformationComponent } from './policy/information/policy-information/policy-information.component';
import { AccountInformationComponent } from './policy/information/account-information/account-information.component';
import { NgSelectModule } from '@ng-select/ng-select';

const okta_config = {
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
    NavigationComponent,
    UserComponent,
    CoveragesComponent,
    InformationComponent,
    PolicyInformationComponent,
    SchedulesComponent,
    ReinsuranceComponent,
    SummaryComponent,
    AccountInformationComponent
  ],
  imports: [
    OktaAuthModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
        return localStorage.getItem('jwt_token');
        }
     }
   }),
    NgbModule,
    FontAwesomeModule,
    NgbAlertModule,
    FormsModule,
    NgSelectModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => () => configService.loadAppConfig()
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor
    },
    { provide: OKTA_CONFIG, useValue: okta_config },
    { provide: ErrorHandler, useClass: GlobalErrorHandler},
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: NgbAlert, useClass: NgbModule, multi: true }


  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
