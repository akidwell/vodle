import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EndorsementCoverageComponent } from '../endorsement-coverage/endorsement-coverage.component';
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

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      //This flattens the sequence number over all the coverages data and gets the highest value. This value will be used for adding any new coverage.
      this.coveragesSequence = this.getNextCoverageSequence(this.endorsementCoveragesGroups);
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

  };
