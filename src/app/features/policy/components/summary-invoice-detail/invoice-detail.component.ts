import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { PolicyInformation } from 'src/app/features/policy/models/policy';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { InvoiceData, InvoiceDetail } from '../../models/invoice';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { LineItemDescription } from '../../services/line-item-descriptions-service/line-item-description';
import { LineItemDescriptionsService } from '../../services/line-item-descriptions-service/line-item-descriptions.service';

@Component({
  selector: 'rsps-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  authSub: Subscription;
  canEditPolicy: boolean = false;
  isReadOnly: boolean = true;
  lineitemDescriptions$: Observable<LineItemDescription[]> | undefined;
  lineitemDescriptions!: LineItemDescription[];
  itemDescriptionSub!: Subscription;
  policyInfo!: PolicyInformation;
  deleteSub!: Subscription;

  @Input() public invoice!: InvoiceData;
  @Input() public invoiceDetail!: InvoiceDetail;
  @Input() index!: number;
  @ViewChild('modalConfirmation') modalConfirmation: any;
  @ViewChild(NgForm, { static: false }) invoiceDetailForm!: NgForm;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private lineItemDescriptionsService: LineItemDescriptionsService, private modalService: NgbModal, private policyService: PolicyService, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );

    this.route.parent?.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
  }

  ngOnInit(): void {
    this.itemDescriptionSub = this.lineItemDescriptionsService.getLineItemDescriptions(this.policyInfo.riskLocation.state, this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.lineitemDescriptions = reisuranceCodes;
        this.lineitemDescriptions$ = of(reisuranceCodes);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Don't make dirty if readonly will still populate invoice but just not save it for readonly
      if ((this.invoiceDetail.isNew || this.invoiceDetail.isUpdated) && this.canEditPolicy) {
        this.invoiceDetailForm.form.markAsDirty();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  openDeleteConfirmation(): void {
    this.modalService.open(this.modalConfirmation, { backdrop: 'static', centered: true }).result.then((result) => {
      if (result == 'Yes') {
        this.deleteDetail();
      }
    });
  }

  async deleteDetail() {
    if (this.invoiceDetail.isNew) {
      setTimeout(() => {
        this.invoiceDetailForm.form.markAsPristine();
        this.invoiceDetailForm.form.markAsUntouched();
        this.removeDetailFromList();
      });    
    } else {
      this.deleteSub = this.policyService.deletePolicyInvoiceDetails(this.invoice.policyId, this.invoice.endorsementNumber, this.invoiceDetail.invoiceNumber ?? 0, this.invoiceDetail.lineNumber).subscribe(result => {
        setTimeout(() => {
          this.invoiceDetailForm.form.markAsPristine();
          this.invoiceDetailForm.form.markAsUntouched();
          this.removeDetailFromList();
          this.notification.show('Invoice Detail deleted.', { classname: 'bg-success text-light', delay: 5000 });
        });        
      });
    }
  }

  removeDetailFromList() {
    const index = this.invoice.invoiceDetail.indexOf(this.invoiceDetail, 0);
    if (index > -1) {
      this.invoice.invoiceDetail.splice(index, 1);
    }
    let counter: number = 0;
    this.invoice.invoiceDetail.forEach(c => c.lineNumber = (counter += 1));
  }

  get canEditDetail(): boolean {
    return this.invoiceDetail != null && this.invoiceDetail.lineNumber > 1 && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

  changeFeeAmount(event: any): void {
    this.invoiceDetail.netAmount =  this.invoiceDetail.feeAmount - this.invoiceDetail.commissionAmount;
  }

  changedDescription(event: any): void {
    let match = this.lineitemDescriptions.find(c => c.code == event);
    if (match != null) {
      this.invoiceDetail.lineItemDescription = match.description;
      this.invoiceDetail.transactionType = match.transType;
      this.invoiceDetail.percentCharge = match.percentCharge;
    }
    else {
      this.invoiceDetail.lineItemDescription = "";
      this.invoiceDetail.transactionType = 1;
      this.invoiceDetail.percentCharge = null;
    }
  }
}
