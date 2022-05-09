import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Insured } from '../../models/insured';

@Component({
  selector: 'rsps-insured-account-right',
  templateUrl: './insured-account-right.component.html',
  styleUrls: ['./insured-account-right.component.css']
})
export class InsuredAccountRightComponent implements OnInit {
  canEditInsured = false;
  authSub: Subscription;
  entityType$: Observable<Code[]> | undefined;

  @Input() public insured!: Insured;
  @ViewChild(NgForm, { static: false }) rightPanel!: NgForm;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService, public datepipe: DatePipe) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    this.entityType$ = this.dropdowns.getEntityType();
  }

  get createdUserFormatted() {
    if ((this.insured.createdBy ?? '') != '') {
      return this.insured.createdBy + ' - ' + this.datepipe.transform(this.insured.createdDate, 'MM/dd/YYYY h:mm:ss a');
    }
    return null;
  }

  get modifiedUserFormatted() {
    if ((this.insured.modifiedBy ?? '') != '') {
      return this.insured.modifiedBy + ' - ' + this.datepipe.transform(this.insured.modifiedDate, 'MM/dd/YYYY h:mm:ss a');
    }
    return null;
  }

}
