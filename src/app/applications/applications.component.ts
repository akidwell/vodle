import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IApplication } from './application';
import { ApplicationService } from './application.service';

@Component({
  selector: 'rsps-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['../app.component.css', './applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  errorMessage = '';
  applications: IApplication[] = [];
  sub!: Subscription;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.sub = this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
