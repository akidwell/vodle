import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VersionComponent } from './core/components/version/version.component';
import { ApplicationsComponent } from './core/components/applications/applications.component';
import { ReportsComponent } from './core/components/reports/reports.component';
import { NavigationComponent } from './core/components/navigation/navigation.component';
import { OktaAuthModule } from '@okta/okta-angular';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { UserComponent } from './core/components/user/user.component';
import { NgbAlert, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './core/components/error-handling/global-error-handler';
import { ServerErrorInterceptor } from './core/interceptors/server-error-interceptor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './app-reuse-strategy';
import { BusyModule } from './core/components/busy/busy.module';
import { PreInitService, preInitServiceFactory } from './core/services/config/preInit.service';
import { DirectivesModule } from './shared/directives/directives.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PipesModule } from './shared/pipes/pipes.module';
import { MessageDialogService } from './core/services/message-dialog/message-dialog-service';

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
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    OktaAuthModule,
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
    DirectivesModule,
    NoopAnimationsModule,
    PipesModule
  ],
  providers: [
    PreInitService,
    MessageDialogService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [PreInitService, Injector],
      useFactory: preInitServiceFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: NgbAlert, useClass: NgbModule, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

