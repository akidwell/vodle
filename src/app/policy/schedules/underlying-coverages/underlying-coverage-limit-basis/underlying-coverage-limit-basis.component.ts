import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { PolicyInformation } from 'src/app/policy/policy';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';
import { LimitsPatternHelperService } from 'src/app/policy/services/limits-pattern-helper.service';
import { UnderlyingCoverageLimit } from '../../schedules';
import { UnderlyingCoverageService } from '../../services/underlying-coverage.service';

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
  @Input() ucLimit!: UnderlyingCoverageLimit;
  @Output() onLimitChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteThisLimit: EventEmitter<UnderlyingCoverageLimit> = new EventEmitter();
  
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
    this.ucLimit.limit = this.limitsPatternHelperService.parseLimitsPattern(this.ucLimit.limit || '', 1)
    this.onLimitChange.emit();
  }
  deleteLimit(): void {
    if(this.ucLimit.isUserAdded) {
      this.deleteThisLimit.emit(this.ucLimit);
    };
  }
  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }
}
