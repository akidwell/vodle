import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { PolicyService } from '../../policy.service';
import { UnderlyingCoverage } from '../schedules';

@Component({
  selector: 'rsps-underlying-coverages',
  templateUrl: './underlying-coverages.component.html',
  styleUrls: ['./underlying-coverages.component.css']
})
export class UnderlyingCoveragesComponent implements OnInit {
  underlyingCoverages!: UnderlyingCoverage[];
  authSub: Subscription;
  canEditPolicy: boolean = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  ucCollapsed = false;
  endorsementNumber!: number;
  policyId!: number;
  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.underlyingCoverages = data['underlyingCoverages'].underlyingCoverages;
    });
    this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
    this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
  }
  addNewUnderlyingCoverage(): void {
    var newUnderlyingCoverage = this.createNewUnderlyingCoverage();
    this.underlyingCoverages.push(newUnderlyingCoverage);
  }
  //Will create and return a new underlying coverage
  createNewUnderlyingCoverage(): UnderlyingCoverage {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNumber,
      sequence: this.underlyingCoverages.length + 1,
      primaryCoverageCode: 13,
      limitsPatternGroupCode: 998,
      limitsPattern: '',
      policyNumber: 0,
      carrierCode: 0,
      underlyingScheduleLimitData: []
    }
  }
  onSave(): void {
    console.log('happens')
    this.policyService.updateUnderlyingCoverages(this.underlyingCoverages).subscribe(result => {
      console.log(result)
    });;
  }
}
