import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { newEndorsementCoverage, EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from '../coverages/coverages';
import { EndorsementCoverageLocationComponent, LocationResult } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverageComponent } from '../endorsement-coverage/endorsement-coverage.component';
import { PolicyInformation } from '../policy';

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
  policyInfo!: PolicyInformation;
  endorsementNumber!: number;
  
  @Input() public endorsementCoveragesGroup!: EndorsementCoveragesGroup;
  @Input() public currentSequence!: number;
  @Output() incrementSequence: EventEmitter<number> = new EventEmitter();
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild('modal') private locationComponent!: EndorsementCoverageLocationComponent
  @ViewChild(NgForm, { static: false }) endorsementCoveragesForm!: NgForm;
  @ViewChildren(EndorsementCoverageComponent) components:QueryList<EndorsementCoverageComponent> | undefined;
  @ViewChildren("coverageDiv") private coverageDivs!: QueryList<EndorsementCoverageComponent>;
  @Output() deleteThisGroup: EventEmitter<EndorsementCoveragesGroup> = new EventEmitter();

  constructor(private userAuth: UserAuth,private route: ActivatedRoute) {
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

    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });

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
    this.authSub.unsubscribe();
  }

  async openLocation(location: EndorsementCoveragesGroup) {
    if (this.locationComponent != null) {
      var result = await this.locationComponent.open(location,this);
      if (result == LocationResult.delete) {
        this.deleteThisGroup.emit(this.endorsementCoveragesGroup);
      }
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

  createNewCoverage(): EndorsementCoverage {
    let newCoverage = newEndorsementCoverage();
    newCoverage.sequence = this.currentSequence;
    newCoverage.locationId = this.endorsementCoveragesGroup.location.locationId;
    newCoverage.endorsementNumber = this.endorsementNumber;
    newCoverage.programId = this.policyInfo.programId;
    newCoverage.coverageCode = this.policyInfo.quoteData.coverageCode;
    newCoverage.policySymbol = this.policyInfo.policySymbol;
    newCoverage.policyId = this.endorsementCoveragesGroup.location.policyId;

    return newCoverage;
  }

  calcTotal(): number {
    let total: number = 0;
    this.endorsementCoveragesGroup.coverages.forEach( group => { total += (group.premium.toString() == "" ? 0 : group.premium ?? 0)});
    return total;
  }
}
