import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';
import { Insured } from '../../models/insured';
import { SubmissionActivityService } from '../../services/submission-activity-service/submission-activity.service';

@Component({
  selector: 'rsps-insured-submission-activity',
  templateUrl: './insured-submission-activity.component.html',
  styleUrls: ['./insured-submission-activity.component.css']
})
export class InsuredSubmissionActivityComponent implements OnInit {

  @Input('submissionResults') submissionResults: SubmissionSearchResponses[] = [];

  searchSub!: Subscription;
  loadingSub!: Subscription;
  loading = false;
  version = '';
  sub!: Subscription;
  insured!: Insured;
  insuredCode!: number;


  constructor(private subActivityService: SubmissionActivityService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.insured = data['insuredData'].insured;
      this.insuredCode = this.insured.insuredCode ?? 0;
    });
    this.sub = this.subActivityService.getSubmissionActivityByInsuredCode(this.insuredCode).subscribe({
      next: results => {
        this.submissionResults = results;
      }
    });
  }
}
