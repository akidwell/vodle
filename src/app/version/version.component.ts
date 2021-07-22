import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private versionService: VersionService, private config: ConfigService) {}

  ngOnInit(): void {
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

}