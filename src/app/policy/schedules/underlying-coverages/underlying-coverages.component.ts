import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { PolicyService } from '../../policy.service';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { UnderlyingCoverage } from '../schedules';
import { UnderlyingCoverageDetailComponent } from './underlying-coverage-detail/underlying-coverage-detail.component';

@Component({
  selector: 'rsps-underlying-coverages',
  templateUrl: './underlying-coverages.component.html',
  styleUrls: ['./underlying-coverages.component.css']
})
export class UnderlyingCoveragesComponent implements OnInit {
  underlyingCoverages!: UnderlyingCoverage[];
  authSub: Subscription;
  canEditPolicy: boolean = false;
  deleteSub!: Subscription;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  ucCollapsed = false;
  endorsementNumber!: number;
  policyId!: number;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  @ViewChildren(UnderlyingCoverageDetailComponent) components: QueryList<UnderlyingCoverageDetailComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.underlyingCoverages = data['underlyingCoverages'].underlyingCoverages;
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
    this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
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
      primaryCoverageCode: 0,
      limitsPatternGroupCode: 0,
      limitsPattern: '',
      policyNumber: '',
      carrierCode: 0,
      underlyingScheduleLimitData: [],
      isNew: true
    }
  }
  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.ucForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }
  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.ucForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }
  save(): void {
    this.policyService.updateUnderlyingCoverages(this.underlyingCoverages).subscribe(result => {
      console.log(result)
    });;
  }
  async deleteComponent(index: any, existingCoverage: UnderlyingCoverage) {

    this.deleteSub = this.policyService.deleteUnderlyingCoverage(existingCoverage).subscribe(result => {
      this.underlyingCoverages.splice(index,1);
    });
  }
  deleteCoverage(existingCoverage: UnderlyingCoverage) {
    const index = this.underlyingCoverages.indexOf(existingCoverage, 0);
    console.log(index)
    if (index > -1) {
      this.deleteComponent(index, existingCoverage);
    }
  }
}
