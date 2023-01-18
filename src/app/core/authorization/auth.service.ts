import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserAuth } from './user-auth';
import { ConfigService } from '../services/config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { IAuthObject } from './auth-object';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  tokenJSON: IAuthObject | undefined;

  constructor(private userAuth: UserAuth, private http: HttpClient, private jwtHelper: JwtHelperService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router, private config: ConfigService, private oktaAuthState: OktaAuthStateService) {
    this.oktaAuthState.authState$.subscribe((isAuthenticated: AuthState) => {
      if (isAuthenticated) {
        this.login();
      }
    });
  }

  async isAuthenticated() {
    // Checks if there is a current accessToken in the TokenManger.
    const accessToken = await this.oktaAuth.getAccessToken();
    const idToken = await this.oktaAuth.getIdToken();
    return !!(accessToken || idToken);
  }

  header = {
    headers: new HttpHeaders()
      .set('OKTA-Authorization', 'Bearer ' + this.oktaAuth.getAccessToken())
  };

  private _headers = new HttpHeaders();

  login() {
    this.userAuth.init();
    this.getAuthToken().subscribe({
      next: token => {
        if (token != null && token != '') {
          this.userAuth.bearerToken = JSON.parse(JSON.stringify(token)).data;
          localStorage.setItem('jwt_token', this.userAuth.bearerToken);
        }
        this.userAuth.isAuthenticating = false;
      },
      error: err => {
        console.error('login error ' + err.message);
        this.userAuth.isAuthenticating = false;
        throw err;
      }
    });
  }

  getAuthToken(): Observable<string> {
    const headers = this._headers.append('OKTA-Authorization', 'Bearer ' + this.oktaAuth.getAccessToken());
    return this.http.get<string>(this.config.apiBaseUrl + 'api/userauth/gettoken', { headers: headers })
      .pipe(
        tap(async token => {
          if (token == null) {
            console.warn('No token');
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
        // Let error get caught later
        // catchError(err => {
        //   console.error('Error: ' + err.message);
        //   return '';
        // })
      );
  }

  processAuthClaims(token: IAuthObject) {
    this.userAuth.userId = token.id;
    this.userAuth.userName = token.userName;
    this.userAuth.isAuthenticated = token.valid == 'True';
    this.userAuth.canExecuteImport = token.CanExecuteImport == 'True';
    this.userAuth.canEditPolicy = token.CanExecuteImport == 'True';
    this.userAuth.canEditInsured = token.CanEditInsured == 'True';
    this.userAuth.canEditSubmission = token.CanEditSubmission == 'True';
    this.userAuth.canEditQuote = token.CanEditQuote == 'True';
    this.userAuth.userRole = token.userRole;
    this.userAuth.environment = token.environment;
    this.userAuth.isApiAuthenticated = token.valid == 'True';
    this.userAuth.loaded();
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
