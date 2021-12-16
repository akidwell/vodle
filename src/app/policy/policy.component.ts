import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from '../authorization/user-auth';
import { EndorsementStatusService } from './services/endorsement-status.service';

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
  authSub: Subscription;
  canEditPolicy: boolean = false;

  constructor(private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    this.policyTabvalidatedSub = this.endorsementStatusService.policyInfoValidated$.subscribe((isValidated: boolean) => {
      this.isPolicyValidated = isValidated;
    });
    this.coverageTabvalidatedSub = this.endorsementStatusService.coverageValidated$.subscribe((isValidated: boolean) => {
      this.isCoveragesValidated = isValidated;
    });
    this.reinsuranceTabvalidatedSub = this.endorsementStatusService.reinsuranceValidated$.subscribe((isValidated: boolean) => {
      this.isReinsuranceValidated = isValidated;
    });
  }

  ngOnInit(): void { }
  
  ngOnDestroy(): void {
    this.policyTabvalidatedSub?.unsubscribe();
    this.coverageTabvalidatedSub?.unsubscribe();
    this.reinsuranceTabvalidatedSub?.unsubscribe();
    this.authSub.unsubscribe();
  }
}