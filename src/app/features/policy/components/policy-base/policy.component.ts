import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';

@Component({
  selector: 'rsps-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['../../../../app.component.css', './policy.component.css']
})
export class PolicyComponent implements OnInit {
  policyTabvalidatedSub!: Subscription;
  coverageTabvalidatedSub!: Subscription;
  reinsuranceTabvalidatedSub!: Subscription;
  isPolicyValidated = false;
  isCoveragesValidated = false;
  isReinsuranceValidated = false;
  authSub: Subscription;
  canEditPolicy = false;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,
    private endorsementStatusService: EndorsementStatusService, private router: Router,
    private config: ConfigService, public headerPaddingService: HeaderPaddingService) {
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
      this.doRedirect();

    this.route.data.subscribe(() => {
      setTimeout(() =>
        this.endorsementStatusService.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0)
      ,0);
    });
  }
  doRedirect() {
    const urlString = this.router.url.split('/').slice(0,-1).join('/')+'/information';
    setTimeout(()=> {
      this.router.navigate([urlString], { state: { bypassFormGuard: true } });
    });
  }

  ngOnDestroy(): void {
    this.policyTabvalidatedSub?.unsubscribe();
    this.coverageTabvalidatedSub?.unsubscribe();
    this.reinsuranceTabvalidatedSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }
}
