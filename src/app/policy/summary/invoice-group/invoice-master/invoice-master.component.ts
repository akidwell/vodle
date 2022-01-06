import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { EndorsementStatusService } from 'src/app/policy/services/endorsement-status.service';
import { InvoiceData } from '../../invoice';

@Component({
  selector: 'rsps-invoice-master',
  templateUrl: './invoice-master.component.html',
  styleUrls: ['./invoice-master.component.css']
})
export class InvoiceMasterComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy: boolean = false;

  @Input() public invoice!: InvoiceData;
  @ViewChild(NgForm, { static: false }) invoiceMasterForm!: NgForm;

  constructor(private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  get canEditComment(): boolean {
    return (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

}
