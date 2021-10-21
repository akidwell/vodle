import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../coverages/coverages';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageComponent } from '../endorsement-coverage/endorsement-coverage.component';

@Component({
  selector: 'rsps-endorsement-location-group',
  templateUrl: './endorsement-location-group.component.html',
  styleUrls: ['./endorsement-location-group.component.css']
})
export class EndorsementLocationGroupComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faMinus = faMinus;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  formStatus!: string;
  anchorId!: string;

  @Input() public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Input() public currentSequence!: number;
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') private locationComponent!: EndorsementCoverageLocationComponent
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
  @ViewChildren(EndorsementCoverageComponent) components:QueryList<EndorsementCoverageComponent> | undefined;
  @ViewChildren("coverageDiv") private coverageDivs!: QueryList<EndorsementCoverageComponent>;

  constructor(private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
     (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
   );
 }
 addNewCoverage(): void {
  const newCoverage: EndorsementCoverage = this.createNewCoverage();
  this.incrementSequence.emit(this.currentSequence + 1);
  this.endorsementCoveragesGroup.coverages.push(newCoverage);
 }

  copyExistingCoverage(existingCoverage: EndorsementCoverage){
    const newCoverage: EndorsementCoverage = JSON.parse(JSON.stringify(existingCoverage));
    newCoverage.sequence = this.currentSequence;
    newCoverage.ecCollapsed = true;
    newCoverage.isNew = true;
    this.incrementSequence.emit(this.currentSequence + 1);
    console.log('new: ', newCoverage, 'existing: ', existingCoverage)
    this.endorsementCoveragesGroup.coverages.push(newCoverage);
  }
  deleteCoverage(existingCoverage: EndorsementCoverage){
    const index = this.endorsementCoveragesGroup.coverages.indexOf(existingCoverage, 0);
    if (index > -1) {
      this.endorsementCoveragesGroup.coverages.splice(index, 1);
    }
  }
  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.endorsementCoveragesGroup.location.locationId;
  }
  ngAfterViewInit() {
    this.coverageDivs.changes.subscribe(() => {
      if (this.coverageDivs && this.coverageDivs.last) {
        setTimeout(() => {
          console.log(this.coverageDivs)
          this.coverageDivs.last.focus();
          console.log(this.coverageDivs)
        }, 0);
      }
    });
  }
  ngOnDestroy() {
  }
  async openLocation(location: EndorsementCoverageLocation) {
    if (this.locationComponent != null) {
      return await this.locationComponent.open(location);
    }
    return false;
  }

  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.endorsementCoveragesForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  createNewCoverage(): EndorsementCoverage {
    const newCoverage: EndorsementCoverage = {
      sequence: this.currentSequence,
      classDescription: '',
      coverageCode: this.endorsementCoveragesGroup.coverages[0].coverageCode,
      coverageId: 0,
      coverageType: '',
      action: 'A',
      claimsMadeOrOccurrence: '',
      deductible: 0,
      deductibleType: '',
      ecCollapsed: true,
      endorsementNumber: this.endorsementCoveragesGroup.coverages[0].endorsementNumber,
      exposureBase: 0,
      exposureCode: '',
      glClassCode: 0,
      includeExclude: '',
      limit: 0,
      limitsPattern: '',
      limitsPatternGroupCode: 998,
      locationId: this.endorsementCoveragesGroup.location.locationId,
      occurrenceOrClaimsMade: true,
      policyId: this.endorsementCoveragesGroup.location.policyId,
      policySymbol: this.endorsementCoveragesGroup.coverages[0].policySymbol,
      premium: 0,
      premiumType: '',
      programId:  this.endorsementCoveragesGroup.coverages[0].programId,
      rateAmount: 0,
      rateBasis: 0,
      retroDate: null,
      subCode: 0,
      isNew: true
    }
    return newCoverage;
  }

  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.endorsementCoveragesForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

}
