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
  @ViewChild(NgForm,  { static: false })endorsementCoveragesForm!: NgForm;
  formStatus!: string;
  anchorId!: string;

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
    const newCoverage: EndorsementCoverage = existingCoverage;
    newCoverage.sequence = this.currentSequence;
    newCoverage.ecCollapsed = true;
    this.incrementSequence.emit(this.currentSequence + 1);
    console.log('new: ', newCoverage, 'existing: ', existingCoverage)
    this.endorsementCoveragesGroup.coverages.push(newCoverage);
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

  @Input()
  public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Input()
  public currentSequence!: number;
  @Input()
  @Output() status: EventEmitter<any> = new EventEmitter();
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();

  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent   | undefined
  @ViewChildren("coverageDiv") private coverageDivs!: QueryList<EndorsementCoverageComponent>;

  // Modal is used to show import errors
  async triggerModal() {
    const location: EndorsementCoverageLocation = { policyId: 1, taxCode: "test", street: "test", locationId: 1, street2: "test", city: "test", state: "OH", zip: "45202", county: "" };

    return await this.locationComponent?.open(location);
  }
  createNewCoverage(): EndorsementCoverage {
    return {
      sequence: this.currentSequence,
      classDescription: '',
      coverageCode: '',
      coverageId: 0,
      coverageType: '',
      action: 'A',
      claimsMadeOrOccurrence: this.endorsementCoveragesGroup.coverages[0].claimsMadeOrOccurrence,
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
      policySymbol: '',
      premium: 0,
      premiumType: '',
      programId:  this.endorsementCoveragesGroup.coverages[0].programId,
      rateAmount: 0,
      rateBasis: 0,
      retroDate: null,
      sir: 0,
      subCode: 0
    }

  }
}

