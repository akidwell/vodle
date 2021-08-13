import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, pipe, Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { VersionService } from './version.service';
import { UserAuth } from '../authorization/user-auth';
import { AuthService } from '../authorization/auth.service';

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
    userName: string | undefined;
    isAuthenticated: boolean = false;

  constructor(private versionService: VersionService, private config: ConfigService,
      private userAuth: UserAuth, private authService: AuthService) {

  }
  async ngOnInit(): Promise<void> {
    this.uiVersion = this.config.getBuildVersion;
    this.sub = this.versionService.getVersion().subscribe({
      next: version => {
        this.apiVersion = version.version;
      },
      error: err => this.errorMessage = err
    });


  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

logout() {
  this.authService.logout();
}


}
