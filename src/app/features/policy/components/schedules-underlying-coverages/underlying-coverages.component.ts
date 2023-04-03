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
import { ThemePalette } from '@angular/material/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UpdatePolicyChild } from '../../services/update-child/update-child.service';

@Component({
  selector: 'rsps-underlying-coverages',
  templateUrl: './underlying-coverages.component.html',
  styleUrls: ['./underlying-coverages.component.css']
})
export class UnderlyingCoveragesComponent implements OnInit {
  underlyingCoverages!: UCCoverage[];
  authSub: Subscription;
  canEditPolicy = false;
  deleteSub!: Subscription;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  ucCollapsed = false;
  endorsementNumber!: number;
  policyId!: number;
  statusSub!: Subscription;
  canEditEndorsement = false;
  color: ThemePalette = 'warn';
  canDrag = false;
  dragDropClass = '';

  @ViewChildren(UnderlyingCoverageDetailComponent) components: QueryList<UnderlyingCoverageDetailComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private policyService: PolicyService, private endorsementStatusService: EndorsementStatusService, private notification: NotificationService, private updatePolicyChild: UpdatePolicyChild) {
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
    this.authSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  addNewUnderlyingCoverage(): void {

    const maxSequence = this.underlyingCoverages.length > 0 ? this.underlyingCoverages.map(x => x.sequence)
      .reduce((prev,current): number => {
        return (prev > current) ? prev : current;
      }) : 0;

    const newUnderlyingCoverage = this.createNewUnderlyingCoverage(maxSequence);
    this.underlyingCoverages.push(new UCCoverage(newUnderlyingCoverage));
    this.ucCollapsed = false;
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
      isNew: true,
      userDefinedCovDesc: null,
      comment: null
    };
  }
  isValid(): boolean {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.ucForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }
  isDirty() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.ucForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }
  save(): void {
    if (this.canEditPolicy && this.isDirty()) {
      this.policyService.updateUnderlyingCoverages(this.underlyingCoverages).subscribe(() => {
        this.notification.show('Underlying Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        if (this.components != null) {
          for (const child of this.components) {
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
  async deleteComponent(index: number, existingCoverage: UnderlyingCoverage) {
    this.deleteSub = this.policyService.deleteUnderlyingCoverage(existingCoverage).subscribe(() => {
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.underlyingCoverages, event.previousIndex, event.currentIndex);
    }
    let sequence = 1;

    this.underlyingCoverages.forEach(c => {
      if (c.sequence != sequence) {
        const match = this.components?.find(l => l.ucData.sequence == c.sequence);
        match?.ucForm.form.markAsDirty();
        c.sequence = sequence;
      }
      sequence++;
    });
  }

  toggleDragDrop() {
    this.ucCollapsed = false;
    // Collapse all coverages
    this.updatePolicyChild.collapseUnderlyingCoverages();
    if (this.canDrag) {
      this.dragDropClass = 'drag';
    }
    else {
      this.dragDropClass = '';
    }
  }
}
