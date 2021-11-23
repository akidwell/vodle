import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Code } from 'src/app/drop-downs/code';
import { PolicyInformation } from 'src/app/policy/policy';
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
  @Input() ucLimit!: UnderlyingCoverageLimit;
  @Output() onLimitChange: EventEmitter<any> = new EventEmitter();
  @Output() deleteThisLimit: EventEmitter<UnderlyingCoverageLimit> = new EventEmitter();
  constructor(private route: ActivatedRoute, public UCService: UnderlyingCoverageService, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
   }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
  }
  limitChange(): void{
    this.onLimitChange.emit();
  }
  deleteLimit(): void {
    console.log('happens')
    if(this.ucLimit.isUserAdded) {
      this.deleteThisLimit.emit(this.ucLimit);
    };
  }
}
