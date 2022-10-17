import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IReport } from './report';
import { ReportsService } from './reports.service';

@Component({
  selector: 'rsps-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  errorMessage = '';
  reports: IReport[] = [];
  sub!: Subscription;

  constructor(private reportService: ReportsService) { }

  ngOnInit(): void {
    this.sub = this.reportService.getReports().subscribe({
      next: reports => {
        this.reports = reports;
      },
      error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
