import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PolicyInformation } from 'src/app/features/policy/models/policy';
import { UCLimit } from '../../classes/UCLimit';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { LimitsPatternHelperService } from '../../services/limits-pattern-helper/limits-pattern-helper.service';
import { UnderlyingCoverageService } from '../../services/underlying-coverage/underlying-coverage.service';

@Component({
  selector: 'rsps-underlying-coverage-limit-basis',
  templateUrl: './underlying-coverage-limit-basis.component.html',
  styleUrls: ['./underlying-coverage-limit-basis.component.css']
})
export class UnderlyingCoverageLimitBasisComponent implements OnInit {
  canEditPolicy: boolean = true;
  authSub: Subscription;
  policyInfo!: PolicyInformation;
  isLimitsPatternValid: boolean = true;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;
  @Input() ucLimit!: UCLimit;
  @Output() onLimitChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteThisLimit: EventEmitter<UCLimit> = new EventEmitter();

  constructor(private route: ActivatedRoute, public UCService: UnderlyingCoverageService, private userAuth: UserAuth, private limitsPatternHelperService: LimitsPatternHelperService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
   }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }
  limitChange(): void{
    this.ucLimit.limitDisplay = this.limitsPatternHelperService.parseLimitsPattern(this.ucLimit.limitDisplay || '', 1)
    this.onLimitChange.emit();
  }
  deleteLimit(): void {
    if(this.ucLimit.isUserAdded) {
      this.deleteThisLimit.emit(this.ucLimit);
    };
  }
}
