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
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { AuthInterceptor } from './authorization/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { UserComponent } from './user/user.component';
import { NgbAlert, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './error-handling/global-error-handler';
import { ServerErrorInterceptor } from './error-handling/server-error-interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './app-reuse-strategy';
import { BusyModule } from './busy/busy.module';
import { DirectivesModule } from './directives/directives.module';

@NgModule({
  declarations: [
    AppComponent,
    VersionComponent,
    ApplicationsComponent,
    ReportsComponent,
    NavigationComponent,
    UserComponent
  ],
  imports: [
    OktaAuthModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('jwt_token');
        }
      }
    }),
    NgbModule,
    FontAwesomeModule,
    NgbAlertModule,
    FormsModule,
    NgSelectModule,
    BusyModule,
    DirectivesModule
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
    {
      provide: OKTA_CONFIG, deps: [ConfigService], useFactory: (configService: ConfigService) => {
        let okta_config = {
          clientId: configService.oktaClientId,
          issuer: configService.oktaIssuer,
          redirectUri: configService.oktaRedirectUri,
          scopes: ['openid', 'profile', 'email'],
          pkce: true,
          postLogoutRedirectUri: configService.oktaPostLogoutRedirectUri,
        };
        return okta_config;
      }
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: NgbAlert, useClass: NgbModule, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
