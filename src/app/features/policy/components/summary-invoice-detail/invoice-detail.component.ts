import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
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
  canEditPolicy = false;
  isReadOnly = true;
  lineitemDescriptions$: Observable<LineItemDescription[]> | undefined;
  lineitemDescriptions!: LineItemDescription[];
  itemDescriptionSub!: Subscription;
  policyInfo!: PolicyInformation;
  deleteSub!: Subscription;

  @Input() public invoice!: InvoiceData;
  @Input() public invoiceDetail!: InvoiceDetail;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) invoiceDetailForm!: NgForm;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private lineItemDescriptionsService: LineItemDescriptionsService, private modalService: NgbModal, private policyService: PolicyService, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService, private confirmationDialogService: ConfirmationDialogService) {
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
    this.authSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
  }

  openDeleteConfirmation(): void {
    this.confirmationDialogService.open('Delete Confirmation', 'Are you sure you want to delete this Invoice Detail?').then((result: boolean) => {
      if (result) {
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
      this.deleteSub = this.policyService.deletePolicyInvoiceDetails(this.invoice.policyId, this.invoice.endorsementNumber, this.invoiceDetail.invoiceNumber ?? 0, this.invoiceDetail.lineNumber).subscribe(() => {
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
    let counter = 0;
    this.invoice.invoiceDetail.forEach(c => c.lineNumber = (counter += 1));
  }

  get canEditDetail(): boolean {
    return this.invoiceDetail != null && this.invoiceDetail.lineNumber > 1 && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

  changeFeeAmount(): void {
    this.invoiceDetail.netAmount = this.invoiceDetail.feeAmount - this.invoiceDetail.commissionAmount;
  }

  changedDescription(event: string): void {
    const match = this.lineitemDescriptions.find(c => c.code == event);
    if (match != null) {
      this.invoiceDetail.lineItemDescription = match.description;
      this.invoiceDetail.transactionType = match.transType;
      this.invoiceDetail.percentCharge = match.percentCharge;
    }
    else {
      this.invoiceDetail.lineItemDescription = '';
      this.invoiceDetail.transactionType = 1;
      this.invoiceDetail.percentCharge = null;
    }
  }
}
