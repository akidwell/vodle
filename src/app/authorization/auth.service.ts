import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserAuth } from './user-auth';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthObject } from './auth-object';
import { OktaAuthService } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  tokenJSON: IAuthObject | undefined;
  constructor(private userAuth: UserAuth, private http: HttpClient, private config: ConfigService, private jwtHelper: JwtHelperService, private oktaAuth: OktaAuthService,) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {
      console.log('first ',isAuthenticated)
      if (isAuthenticated) {
        this.login2();
      } else {
        this.login();
      }
    });
  }

  isAuthenticated() {
    if (this.userAuth.isAuthenticated == 'True') {
      return true;
    } else {
      return false;
    }
}
header = {
  headers: new HttpHeaders()
    .set('OKTA-Authorization',  'Bearer ' +this.oktaAuth.getAccessToken())
  }

login(){
  this.oktaAuth.signInWithRedirect({
    originalUri: '/home'
  });
}
login2() {
  this.userAuth.init();
  this.getAuthToken().subscribe({
    next: token => {
      this.userAuth.bearerToken = JSON.parse(JSON.stringify(token)).data;
      console.log(token)
      localStorage.setItem('jwt_token', this.userAuth.bearerToken);
    },
    //error: err => this.errorMessage = err
  });
}
  getAuthToken(): Observable<string>{
    return  this.http.get<string>(this.config.apiBaseUrl + 'api/userauth/gettoken', this.header)
    .pipe(
      tap(token => {
        this.processAuthClaims(this.jwtHelper.decodeToken(JSON.parse(JSON.stringify(token)).data));
      }),
      )
  }
  processAuthClaims(token: IAuthObject) {
    console.log(token);
    this.userAuth.userName = token.name;
    this.userAuth.isAuthenticated = token.valid;

    this.userAuth.canExecuteImport = token.CanExecuteImport;
    console.log(this.userAuth);
  }
  async logout() {
    // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
    this.userAuth.init();
    localStorage.removeItem('jwt_token');
    await this.oktaAuth.signOut();
  }
}
