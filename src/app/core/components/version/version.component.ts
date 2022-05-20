import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config/config.service';
import { VersionService } from '../../services/version/version.service';

@Component({
  selector: 'rsps-version',
  templateUrl: './version.component.html'
})
export class VersionComponent implements OnInit, OnDestroy {
  uiVersion = '';
  apiVersion = '';
  errorMessage = '';
  sub!: Subscription;

  constructor(private versionService: VersionService, private config: ConfigService) { }

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

}
