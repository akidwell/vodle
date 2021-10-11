import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EndorsementCoverageComponent } from '../endorsement-coverage/endorsement-coverage.component';
import { PolicyService } from '../policy.service';
import { EndorsementCoveragesGroup } from './coverages';

@Component({
  selector: 'rsps-coverages',
  templateUrl: './coverages.component.html',
  styleUrls: ['./coverages.component.css']
})
export class CoveragesComponent implements OnInit {
  endorsementCoveragesGroups! : EndorsementCoveragesGroup[];
  formStatus: any;
  coveragesSequence!: number;
  coveragesSub!: Subscription;
  notification: any;

  constructor(private route: ActivatedRoute, private policyService: PolicyService) {
   }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      //This flattens the sequence number over all the coverages data and gets the highest value. This value will be used for adding any new coverage.
      this.coveragesSequence = this.getNextCoverageSequence(this.endorsementCoveragesGroups);
      this.saveEndorsementCoverages = this.saveEndorsementCoverages;
    });
  }
  onIncrement(newSeq : number) {
    this.coveragesSequence = newSeq;
  }
  getNextCoverageSequence(allGroups: EndorsementCoveragesGroup[]) {
    return allGroups.map(group => group.coverages.map(coverage => coverage.sequence)).reduce(
      (locGroup, seq) => locGroup.concat(seq),[]).reduce(
        (a,b) => Math.max(a,b)) + 1;
  }
  getProgramId(firstGroup: EndorsementCoveragesGroup){
    return firstGroup.coverages[0].programId;
  }
  @Output() status: EventEmitter<any> = new EventEmitter();
  saveEndorsementCoverages(): any {
    console.log(this.endorsementCoveragesGroups)
    this.coveragesSub = this.policyService.updateEndorsementGroups(this.endorsementCoveragesGroups).subscribe(() => {
        this.notification.show('Coverages successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
    });
  }
  policyInfo(policyInfo: any) {
    throw new Error('Method not implemented.');
  }
  };
