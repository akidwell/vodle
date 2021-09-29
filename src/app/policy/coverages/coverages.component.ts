import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementCoverageLocationComponent } from '../endorsement-coverage-location/endorsement-coverage-location.component';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from './coverages';

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
  
  constructor(private route: ActivatedRoute, private userAuth: UserAuth) { 
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
    }); 
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
  
  @Output() status: EventEmitter<any> = new EventEmitter();

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
        group.coverages.push(coverage);
        this.endorsementCoveragesGroups.push(group);
      }
      return result;
    }
    return false;
  }

}
