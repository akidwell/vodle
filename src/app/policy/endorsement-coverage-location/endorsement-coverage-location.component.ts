import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EndorsementCoverageLocation } from '../coverages/coverages';

@Component({
  selector: 'rsps-endorsement-coverage-location',
  templateUrl: './endorsement-coverage-location.component.html',
  styleUrls: ['./endorsement-coverage-location.component.css']
})
export class EndorsementCoverageLocationComponent implements OnInit {
  location!: EndorsementCoverageLocation;
  isReadOnly: boolean = true;

  constructor (private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  
  @ViewChild('modalPipe') modalPipe: any;
  private modalRef: NgbModalRef | undefined
  
  open(locationInfo: EndorsementCoverageLocation): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.location = locationInfo;
      this.modalRef = this.modalService.open(this.modalPipe)
      this.modalRef.result.then(resolve, resolve)
    })
  }

}
