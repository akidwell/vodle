import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementLocationGroupComponent } from '../endorsement-location-group/endorsement-location-group.component';
import { PolicyInformation } from '../policy';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from './coverages';
import { EndorsementHeaderComponent } from './endorsement-header/endorsement-header.component';

@Component({
  selector: 'rsps-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.css']
})
export class CoveragesComponent implements OnInit {
  endorsementCoveragesGroups!: EndorsementCoveragesGroup[];
  formStatus: any;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  policyInfo!: PolicyInformation;
  
  constructor(private route: ActivatedRoute, private userAuth: UserAuth) { 
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      this.policyInfo = data['policyInfoData'].policyInfo;
    }); 
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
  
  @Output() status: EventEmitter<any> = new EventEmitter();

  @ViewChild(EndorsementHeaderComponent) headerComp!: EndorsementHeaderComponent;
  @ViewChild(EndorsementLocationGroupComponent) groupComp!: EndorsementLocationGroupComponent;
  @ViewChild('modal') private locationComponent: EndorsementCoverageLocationComponent | undefined

  async openLocation() {
    let result: boolean = false;

    if (this.locationComponent != null) {
      let location: EndorsementCoverageLocation =({} as any) as EndorsementCoverageLocation;
      // get policyId from route
      let policyId: number  = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      location.policyId = policyId;

      result = await this.locationComponent.open(location);
      if (result) {
        let coverage: EndorsementCoverage = ({} as any) as EndorsementCoverage;
        let group: EndorsementCoveragesGroup = { coverages: [], location: location }
        coverage.programId = this.policyInfo.programId;
        coverage.coverageCode = this.policyInfo.quoteData.coverageCode;    
        coverage.policySymbol = this.policyInfo.policySymbol;
        coverage.policyId = this.policyInfo.policyId;
        coverage.action = "A";
        group.coverages.push(coverage);
        this.endorsementCoveragesGroups.push(group);
      }
      return result;
    }
    return false;
  }


  isValid() {
    return this.headerComp.endorsementHeaderForm.status == 'VALID' && this.groupComp.isValid();
  }

  isDirty() {
    return this.headerComp.endorsementHeaderForm.dirty || this.groupComp.endorsementCoveragesForm.dirty;
  }

  save() {
    this.headerComp.save();
    //this.groupComp.save();
  }
  
  invalidControls() {
    let invalid = [];
    let controls = this.headerComp.endorsementHeaderForm.controls;
    for (let name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    if (this.groupComp.components != null) {
      for (let child of this.groupComp.components) {
        for (let name in child.endorsementCoveragesForm.controls) {
          if (child.endorsementCoveragesForm.controls[name].invalid) {
            invalid.push(name);
          }
        } 
      }
    }
    return invalid;
  }

}
