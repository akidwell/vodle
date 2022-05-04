import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { PolicyService } from '../../services/policy/policy.service';
import { UnderlyingCoverage } from '../../models/schedules';
import { UnderlyingCoverageDetailComponent } from '../schedules-underlying-coverage-detail/underlying-coverage-detail.component';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { UCCoverage } from '../../classes/UCCoverage';

@Component({
  selector: 'rsps-underlying-coverages',
  templateUrl: './underlying-coverages.component.html',
  styleUrls: ['./underlying-coverages.component.css']
})
export class UnderlyingCoveragesComponent implements OnInit {
  underlyingCoverages!: UCCoverage[];
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

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private endorsementStatusService: EndorsementStatusService, private notification: NotificationService) {
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

    var maxSequence = this.underlyingCoverages.length > 0 ? this.underlyingCoverages.map(x => x.sequence)
    .reduce((prev,current): number => {
      return (prev > current) ? prev : current
    }) : 0;

    var newUnderlyingCoverage = this.createNewUnderlyingCoverage(maxSequence);
    this.underlyingCoverages.push(new UCCoverage(newUnderlyingCoverage));
  }
  //Will create and return a new underlying coverage
  createNewUnderlyingCoverage(maxSequence: number): UnderlyingCoverage {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNumber,
      sequence: maxSequence + 1,
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
    if (this.canEditPolicy && this.isDirty()) {
      this.policyService.updateUnderlyingCoverages(this.underlyingCoverages).subscribe(result => {
        this.notification.show('Underlying Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        if (this.components != null) {
          for (let child of this.components) {
            if (child.ucForm.dirty) {
              child.ucData.isNew = false;
              child.ucForm.form.markAsPristine();
              child.ucForm.form.markAsUntouched();
            }
          }
        }
      });
    }
  }
  async deleteComponent(index: any, existingCoverage: UnderlyingCoverage) {
    this.deleteSub = this.policyService.deleteUnderlyingCoverage(existingCoverage).subscribe(result => {
      this.underlyingCoverages.splice(index,1);
    });
  }
  deleteCoverage(existingCoverage: UCCoverage) {
    const index = this.underlyingCoverages.indexOf(existingCoverage, 0);
    if (!existingCoverage.isNew) {
      this.deleteComponent(index, existingCoverage);
    } else {
      this.underlyingCoverages.splice(index,1);
    }
  }
}
