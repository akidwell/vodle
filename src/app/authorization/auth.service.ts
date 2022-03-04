import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserAuth } from './user-auth';
import { ConfigService } from '../config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OktaAuth } from '@okta/okta-auth-js';
import { IAuthObject } from './auth-object';
import { Router } from '@angular/router';
import { OKTA_AUTH } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  tokenJSON: IAuthObject | undefined;
  public $authenticationState: Observable<any>;

  constructor(private userAuth: UserAuth, private http: HttpClient,  private jwtHelper: JwtHelperService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private router: Router, private config: ConfigService) {
    // Subscribe to authentication state changes
    this.$authenticationState = new Observable((observer: Observer<boolean>) => {
      this.isAuthenticated().then(val => {
        observer.next(val);
      });
    });
    this.$authenticationState.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
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
    this.userAuth.init();
    this.getAuthToken().subscribe({
      next: token => {
        if (token != null && token != "") {
          this.userAuth.bearerToken = JSON.parse(JSON.stringify(token)).data;
          this.userAuth.ApiBearerToken = JSON.parse(JSON.stringify(token)).data;
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
    this.userAuth.userId = token.id;
    this.userAuth.userName = token.userName;
    this.userAuth.isAuthenticated = token.valid == 'True';
    this.userAuth.canExecuteImport = token.CanExecuteImport == 'True';
    this.userAuth.isApiAuthenticated = token.valid == 'True';
    this.userAuth.canEditPolicy = token.CanExecuteImport == 'True';
    this.userAuth.userRole = token.userRole;
    this.userAuth.environment = token.environment;
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
