import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faPlus, faArrowUp, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoverage } from '../coverages/coverages';

@Component({
  selector: 'rsps-endorsement-coverage',
  templateUrl: './endorsement-coverage.component.html',
  styleUrls: ['./endorsement-coverage.component.css']
})
export class EndorsementCoverageComponent implements OnInit {
  ecCollapsed = true;
  faPlus = faPlus;
  faArrowUp = faAngleUp;
  color = "blue"
  authSub: Subscription;
  canEditPolicy: boolean = false;
    constructor(private dropdowns: DropDownsService, private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
     (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
   );
  }

  ngOnInit(): void {
  }
  @Input()
  public coverage!: EndorsementCoverage;
  
  @Output() status: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgForm,  { static: false })endorsementCoveragesForm!: NgForm;
  formStatus!: string;
}
