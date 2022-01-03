import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserAuth } from './user-auth';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthObject } from './auth-object';
import { OktaAuthService } from '@okta/okta-angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  tokenJSON: IAuthObject | undefined;
  constructor(private userAuth: UserAuth, private http: HttpClient, private config: ConfigService, private jwtHelper: JwtHelperService, private oktaAuth: OktaAuthService, private router: Router) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(isAuthenticated => {
      console.log('first ', isAuthenticated)
      if (isAuthenticated) {
        this.login2();
      } else {
        console.log('okta login', isAuthenticated)
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
      .set('OKTA-Authorization', 'Bearer ' + this.oktaAuth.getAccessToken())
  }

  private _headers = new HttpHeaders();

  login() {
    this.oktaAuth.signInWithRedirect({
      originalUri: '/home'
    });
  }

  login2() {
    this.userAuth.init();
    this.getAuthToken().subscribe({
      next: token => {
        if (token != null && token != "") {
          this.userAuth.bearerToken = JSON.parse(JSON.stringify(token)).data;
          this.userAuth.ApiBearerToken = JSON.parse(JSON.stringify(token)).data;
          console.log(token)
          localStorage.setItem('jwt_token', this.userAuth.bearerToken);
        }
      },
      error: err => console.log("!!! " + err) 
    });
  }

  getAuthToken(): Observable<string> {
    const headers = this._headers.append('OKTA-Authorization', 'Bearer ' + this.oktaAuth.getAccessToken());
    return this.http.get<string>(this.config.apiBaseUrl + 'api/userauth/gettoken', { headers: headers })
      .pipe(
        tap(async token => {
          if (token == null) {
            console.log("No token");
          }
          else {
            const tokenString = JSON.parse(JSON.stringify(token));
            if (tokenString.data == null) {
              this.router.navigate(['/access-denied']);
            }
            else {
              this.processAuthClaims(this.jwtHelper.decodeToken(tokenString.data));
            }
          }
        }),
        catchError(err => {
          console.log("Error: " + err.message);
          return "";
        })
      )
  }

  processAuthClaims(token: IAuthObject) {
    console.log(token);
    this.userAuth.userId = token.id;
    this.userAuth.userName = token.userName;
    this.userAuth.isAuthenticated = token.valid == 'True';
    this.userAuth.canExecuteImport = token.CanExecuteImport == 'True';
    this.userAuth.isApiAuthenticated = token.valid == 'True';
    this.userAuth.canEditPolicy = token.CanExecuteImport == 'True';
    this.userAuth.userRole = token.userRole;
    this.userAuth.loaded();

    console.log(this.userAuth);
    if (!this.userAuth.isAuthenticated) {
      this.router.navigate(['/access-denied']);
    }
    else if (this.router.url == '/access-denied') {
      this.router.navigate(['/home']);
    }
  }

  async logout() {
    // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
    this.userAuth.init();
    localStorage.removeItem('jwt_token');
    await this.oktaAuth.signOut();
    //this.oktaAuth.tokenManager.clear();
  }
}
