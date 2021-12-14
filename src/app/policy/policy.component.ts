import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PolicyStatusService } from './services/policy-status.service';

@Component({
  selector: 'rsps-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['../app.component.css', './policy.component.css']
})
export class PolicyComponent implements OnInit {
  policyTabvalidatedSub!: Subscription;
  coverageTabvalidatedSub!: Subscription;
  reinsuranceTabvalidatedSub!: Subscription;
  isPolicyValidated: boolean = false;
  isCoveragesValidated: boolean = false;
  isReinsuranceValidated: boolean = false;
  
  constructor(private policyStatusService: PolicyStatusService) {
    this.policyTabvalidatedSub = this.policyStatusService.policyInfoValidated$.subscribe((isValidated: boolean) => {
      this.isPolicyValidated = isValidated;
    });
    this.coverageTabvalidatedSub = this.policyStatusService.coverageValidated$.subscribe((isValidated: boolean) => {
      this.isCoveragesValidated = isValidated;
    });
    this.reinsuranceTabvalidatedSub = this.policyStatusService.reinsuranceValidated$.subscribe((isValidated: boolean) => {
      this.isReinsuranceValidated = isValidated;
    });
  }

  ngOnInit(): void { }
  
  ngOnDestroy(): void {
    this.policyTabvalidatedSub?.unsubscribe();
    this.coverageTabvalidatedSub?.unsubscribe();
    this.reinsuranceTabvalidatedSub?.unsubscribe();
  }
}