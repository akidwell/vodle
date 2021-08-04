import { Component, OnDestroy, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { Subscription } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { VersionService } from './version.service';

@Component({
    selector: 'rsps-version',
    templateUrl: './version.component.html',
    styleUrls: ['../app.component.css']
  })
export class VersionComponent implements OnInit, OnDestroy {
    uiVersion: string = '';
    apiVersion: string = '';
    errorMessage = '';
    sub!: Subscription;
    isAuthenticated: boolean = false;
    userName: string | undefined;

  constructor(private versionService: VersionService, private config: ConfigService, public oktaAuth: OktaAuthService) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated,

    );
  }
  async ngOnInit(): Promise<void> {
    this.uiVersion = this.config.getBuildVersion;
    this.sub = this.versionService.getVersion().subscribe({
      next: version => {
        this.apiVersion = version.version;
      },
      error: err => this.errorMessage = err
    });
    const accessToken = this.oktaAuth.getAccessToken();
      this.isAuthenticated = await this.oktaAuth.isAuthenticated();
  
      const userClaims = await this.oktaAuth.getUser();
  
      // user name is exposed directly as property
      this.userName = userClaims.name;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
    login() {
      this.oktaAuth.signInWithRedirect({
        originalUri: '/home'
      })    
    }

    async logout() {
      // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
      await this.oktaAuth.signOut();
    }

}