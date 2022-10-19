import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { InvoiceData } from '../../models/invoice';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-invoice-master',
  templateUrl: './invoice-master.component.html',
  styleUrls: ['./invoice-master.component.css']
})
export class InvoiceMasterComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy = false;
  endorsementReasons!: Code[];

  @Input() public invoice!: InvoiceData;
  @ViewChild(NgForm, { static: false }) invoiceMasterForm!: NgForm;

  constructor(private userAuth: UserAuth, private endorsementStatusService: EndorsementStatusService, private dropdowns: DropDownsService,) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  async ngOnInit(): Promise<void> {
    const endorsementReasons$ = this.dropdowns.getEndorsementReasons();
    this.endorsementReasons = await lastValueFrom(endorsementReasons$);
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  get canEditComment(): boolean {
    return (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

}
