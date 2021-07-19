import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VersionService } from './version.service';

@Component({
    selector: 'rsps-version',
    templateUrl: './version.component.html'
  })
export class VersionComponent implements OnInit, OnDestroy {
    version: string = '';
    errorMessage = '';
    sub!: Subscription;

    
  constructor(private versionService: VersionService) {}

 ngOnInit(): void {
    this.sub = this.versionService.getVersion().subscribe({
      next: version => {
        this.version = version.version;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}