import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserAuth } from './user-auth';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthObject } from './auth-object';
import { OktaAuthService } from '@okta/okta-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  tokenJSON: IAuthObject | undefined;
  constructor(private userAuth: UserAuth, private http: HttpClient, private config: ConfigService, private jwtHelper: JwtHelperService, private oktaAuth: OktaAuthService,private router: Router) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {
      console.log('first ',isAuthenticated)
      if (isAuthenticated) {
        this.login2();
      } else {
        console.log('okta login',isAuthenticated)
        this.login();
      }
    });
  }

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    return !!(await this.oktaAuth.tokenManager.get('accessToken'));
  }

header = {
  headers: new HttpHeaders()
    .set('OKTA-Authorization',  'Bearer ' + this.oktaAuth.getAccessToken())
  }

  // GAM - TEMP - Header test
  private _headers = new HttpHeaders();

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
      // GAM - TEMP - New observable 
      this.userAuth.ApiBearerToken = JSON.parse(JSON.stringify(token)).data;
      console.log(token)
      localStorage.setItem('jwt_token', this.userAuth.bearerToken);
    },
    //error: err => this.errorMessage = err
  });
}
  getAuthToken(): Observable<string>{   
    // GAM - TEMP - Header test
    const headers = this._headers.append('OKTA-Authorization', 'Bearer ' + this.oktaAuth.getAccessToken());
    //return  this.http.get<string>(this.config.apiBaseUrl + 'api/userauth/gettoken', this.header)
    return  this.http.get<string>(this.config.apiBaseUrl + 'api/userauth/gettoken', { headers : headers })
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
    this.userAuth.canEditPolicy = token.CanEditPolicy;

      // GAM - TEMP - New observables 
    this.userAuth.canExecuteImport2 = token.CanExecuteImport == 'True';
    this.userAuth.isApiAuthenticated = token.valid == 'True';

    console.log(this.userAuth);
    if (this.userAuth.isAuthenticated == 'False' )
    {
      this.router.navigate(['/access-denied']);
    }
    else if (this.router.url == '/access-denied')
    {
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
    this.userAuth.init();
    localStorage.removeItem('jwt_token');
    // This will clear the token but commented out for now until logout is working
    await this.oktaAuth.signOut();
    //this.oktaAuth.tokenManager.clear();
  }
}
