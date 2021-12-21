import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from '../authorization/user-auth';
import { EndorsementStatusService } from './services/endorsement-status.service';
import { Router } from '@angular/router';
import { ConfigService } from '../config/config.service';

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

  constructor(private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService, private router: Router, private config: ConfigService) {
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

  ngOnInit(): void {
    //If the policy module is loaded and the user is not trying to access policy information we need to redirect them to policy information
    if (this.router.url.split('/').slice(-1)[0] != 'information' && !this.config.preventForcedRedirect)
      this.doRedirect()
  }
  doRedirect() {
    var urlString = this.router.url.split('/').slice(0,-1).join('/')+'/information'
    setTimeout(()=> {
      this.router.navigate([urlString])
    })
  }

  ngOnDestroy(): void {
    this.policyTabvalidatedSub?.unsubscribe();
    this.coverageTabvalidatedSub?.unsubscribe();
    this.reinsuranceTabvalidatedSub?.unsubscribe();
    this.authSub.unsubscribe();
  }
}
