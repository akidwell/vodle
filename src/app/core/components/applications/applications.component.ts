import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IApplication } from './application';
import { ApplicationsService } from './applications.service';

@Component({
  selector: 'rsps-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {
  errorMessage = '';
  applications: IApplication[] = [];
  sub!: Subscription;

  constructor(private applicationsService: ApplicationsService) { }

  ngOnInit(): void {
    this.sub = this.applicationsService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
