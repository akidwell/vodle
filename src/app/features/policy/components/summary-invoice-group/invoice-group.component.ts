import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { InvoiceData, newInvoiceDetail } from '../../models/invoice';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PolicyService } from '../../services/policy/policy.service';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceMasterComponent } from '../summary-invoice-master/invoice-master.component';
import { InvoiceDetailComponent } from '../summary-invoice-detail/invoice-detail.component';
import { PolicyIssuanceRequest } from '../../models/policy-issuance-request';
import { PolicyIssuanceService } from '../../services/policy-issuance-service/policy-issuance.service';
import { ConfirmationDialogService } from '../../../../core/services/confirmation-dialog/confirmation-dialog.service';
import { HistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { PolicyInformation } from '../../models/policy';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-invoice-group',
  templateUrl: './invoice-group.component.html',
  styleUrls: ['./invoice-group.component.css']
})
export class InvoiceGroupComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  invoiceCollapsed = false;
  authSub: Subscription;
  canEditPolicy = false;
  title = 'Transaction Summary';
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid = false;
  invalidMessage = '';
  issuanceSub!: Subscription;
  invoiceCopy!: InvoiceData;

  @Input() public policyInfo!: PolicyInformation;
  @Input() public invoice!: InvoiceData;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) invoiceGroupForm!: NgForm;
  @ViewChild(InvoiceMasterComponent) header!: InvoiceMasterComponent;
  @ViewChildren(InvoiceDetailComponent) components: QueryList<InvoiceDetailComponent> | undefined;
  @Output() resetInvoice: EventEmitter<null> = new EventEmitter();

  constructor(private userAuth: UserAuth, private router: Router, private policyService: PolicyService, private notification: NotificationService, public datepipe: DatePipe, private endorsementStatusService: EndorsementStatusService, private policyIssuanceService: PolicyIssuanceService, private messageDialogService: MessageDialogService, private confirmationDialogService: ConfirmationDialogService, private historyService: HistoryService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    if (this.index > 0) {
      this.collapsePanel(true);
    }
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.issuanceSub?.unsubscribe();
  }

  addNewInvoiceDetail(): void {
    const newDetail = newInvoiceDetail();
    newDetail.invoiceNumber = this.invoice.invoiceNumber;
    newDetail.lineNumber = this.getNextSequence();
    this.invoice.invoiceDetail.push(newDetail);
    this.collapsePanel(false);
  }

  collapsePanel(isCollapsed: boolean) {
    this.invoiceCollapsed = isCollapsed;
    if (isCollapsed) {
      this.title = 'Transaction Summary - ' + this.invoice.invoiceNumber + ' - ' + this.datepipe.transform(this.invoice.invoiceDate, 'MM/dd/yyyy') + ' - ' + this.invoice.invoiceStatusDescription;
    }
    else {
      this.title = 'Transaction Summary';
    }
  }

  getNextSequence(): number {
    if (this.invoice.invoiceDetail.length == 0) {
      return 2;
    }
    else {
      return Math.max(...this.invoice.invoiceDetail.map(o => o.lineNumber)) + 1;
    }
  }
  get canSave(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

  get canPost(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

  get canVoid(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && (this.invoice.proFlag == 0 || this.invoice.proFlag == 3))) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

  get canExport(): boolean {
    return this.invoice != null && ((this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 3) || this.invoice.invoiceStatus == 'P') && this.endorsementStatusService.isValidated() && !this.endorsementStatusService.directQuote && this.invoice.endorsementNumber == 0 && this.canEditPolicy;
  }

  get canAddDetail(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy;
  }

  get canReset(): boolean {
    return this.index == 0 && this.invoice != null && this.endorsementStatusService.isValidated() && this.canEditPolicy && this.endorsementStatusService.invoiced && this.invoice.invoiceStatus == 'V' && this.invoice.proFlag == 5;
  }

  get showFooter(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus != 'V');
  }

  get totalNetAmount(): number {
    let total = 0;
    this.invoice.invoiceDetail.forEach(element => {
      total += Number.isNaN(Number(element.netAmount)) ? 0 : Number(element.netAmount);
    });
    return total;
  }

  async clickSave() {
    this.endorsementStatusService.invoiceSaving = true;
    await this.tempSave();
    this.endorsementStatusService.invoiceSaving = false;
  }

  async tempSave(): Promise<void> {
    if (this.isValid()) {
      if (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0)) {
        this.endorsementStatusService.invoiceSaving = true;
        if (this.invoice.invoiceStatus == 'N') {
          this.invoice.invoiceStatus = 'T';
          this.invoice.proFlag = 0;
          await this.save();
        }
        else if (this.isDirty()) {
          await this.save();
        }
        this.endorsementStatusService.invoiceSaving = false;
      }
    }
    else {
      this.showInvalidControls();
    }

  }

  async reset() {
    const confirm = await this.confirmationDialogService.open('Confirmation', 'Would you like to create a new invoice?');
    if (confirm) {
      this.resetInvoice.emit();
    }
  }

  async post(): Promise<void> {
    if (this.isValid()) {
      if (this.invoice.effectiveDate != null && (this.invoice.invoiceStatus == 'N' || (this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 0))) {
        this.endorsementStatusService.invoiceSaving = true;
        this.invoiceCopy = deepClone(this.invoice);
        this.invoice.invoiceStatus = 'T';
        this.invoice.proFlag = 3;
        const isSaved = await this.save();
        if (isSaved) {
          if (this.canExport) {
            await this.export();
          }
        }
        else {
          // Restore before Post changes
          this.invoice = deepClone(this.invoiceCopy);
        }
        this.endorsementStatusService.invoiceSaving = false;
      }
    }
    else {
      this.showInvalidControls();
    }
  }

  async export(): Promise<void> {
    const parm: PolicyIssuanceRequest = { policyId: this.invoice.policyId, endorsementNumber: this.invoice.endorsementNumber };
    this.endorsementStatusService.invoiceSaving = true;
    const results$ = this.policyIssuanceService.postPolicyIssuance(parm);
    await lastValueFrom(results$).then(
      importPolicyResponse => {

        this.endorsementStatusService.invoiceSaving = false;
        if (importPolicyResponse.isPolicyIssued) {
          this.messageDialogService.open('Export to Issuance', 'Successful');
        }
        else if (importPolicyResponse.errorMessage.indexOf('already exist') > 0) {
          this.messageDialogService.open('Export to Issuance', 'Policy already imported');
        }
        else {
          this.messageDialogService.open('Export to Issuance failed', 'Error Message: ' + importPolicyResponse.errorMessage);
        }
      },
      error => {
        this.endorsementStatusService.invoiceSaving = false;
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Export to Issuance failed', 'Error Message: ' + errorMessage);
      }
    );
  }

  private async save(): Promise<boolean> {
    if (this.invoice.isNew) {
      return await this.addInvoice();
    }
    else {
      return await this.updateInvoice();
    }
  }

  private async addInvoice(): Promise<boolean> {
    const results$ = this.policyService.addPolicyInvoice(this.invoice);
    return await lastValueFrom(results$)
      .then(async result => {
        return this.refresh(result == null);
      },
      (error) => {
        this.endorsementStatusService.invoiceSaving = false;
        this.showInvoiceNotSaved();
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Invoice Save Error', errorMessage);
        return false;
      });
  }

  private async updateInvoice(): Promise<boolean> {
    const results$ = this.policyService.updatePolicyInvoice(this.invoice);
    return await lastValueFrom(results$)
      .then(async result => {
        return this.refresh(result == null);
      },
      (error) => {
        this.endorsementStatusService.invoiceSaving = false;
        this.showInvoiceNotSaved();
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Invoice Save Error', errorMessage);
        return false;
      });
  }

  private async refresh(isSuccesful: boolean): Promise<boolean> {
    if (isSuccesful) {
      this.markPristine();
      await this.endorsementStatusService.refresh();
      this.endorsementStatusService.refreshInvoice();
      // If a Void then make sure the policy dates were not affected by a trigger
      if (this.invoice.invoiceStatus == 'V') {
        const results$ = this.policyService.getPolicyInfo(this.invoice.policyId);
        await lastValueFrom(results$).then((policy) => {
          this.policyInfo.policyCancelDate = policy.policyCancelDate;
          this.policyInfo.policyExtendedExpDate = policy.policyExtendedExpDate;
        });
      }
      this.showInvoiceSaved();
      return true;
    }
    else {
      this.showInvoiceNotSaved();
      return false;
    }
  }

  private markPristine() {
    this.invoice.isNew = false;
    this.invoice.isUpdated = false;
    this.invoice.invoiceDetail.forEach(c => { c.isUpdated = false; c.isNew = false; });
    this.header.invoiceMasterForm.form.markAsPristine();
    if (this.components != null) {
      for (const child of this.components) {
        child.invoiceDetailForm.form.markAsPristine();
      }
    }
  }

  private showInvoiceSaved(): void {
    this.notification.show('Invoice Saved.', { classname: 'bg-success text-light', delay: 5000 });
  }

  private showInvoiceNotSaved(): void {
    this.notification.show('Invoice Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
  }

  async confirmVoid(): Promise<void> {
    let undoPost = false;

    // If voiding a Endorsement 0 give the user the option to undo and set back to temp save
    if (this.invoice.endorsementNumber == 0 && this.invoice.invoiceStatus == 'T' && this.invoice.proFlag == 3) {
      undoPost = await this.confirmationDialogService.open('Void Confirmation', 'Do you want to set back to Temp status?');
    }

    if (undoPost) {
      this.endorsementStatusService.invoiceSaving = true;
      await this.undoPost();
      this.endorsementStatusService.invoiceSaving = false;
    }
    else {
      const voidConfirm = await this.confirmationDialogService.open('Void Confirmation', 'Are you sure you want to Void this invoice?');
      if (voidConfirm) {
        this.endorsementStatusService.invoiceSaving = true;
        if (await this.voidInvoice()) {
          this.endorsementStatusService.invoiceSaving = false;
          if (this.invoice.endorsementNumber > 0) {
            this.confirmationDialogService.open('Delete Confirmation', 'Would you also like to Delete the related endorsement?')
              .then(async deleteEndorsement => {
                if (deleteEndorsement) {
                  this.router.navigate(['/home']);
                  this.endorsementStatusService.invoiceSaving = true;
                  const results$ = this.policyService.deleteEndorsement(this.invoice.policyId, this.invoice.endorsementNumber);
                  await lastValueFrom(results$).then(() => {
                    this.historyService.removePolicy(this.invoice.policyId, this.invoice.endorsementNumber);
                    this.messageDialogService.open('Invoice Voided', 'Transaction was deleted succesfully!');
                  },
                  error => {
                    this.endorsementStatusService.invoiceSaving = false;
                    const errorMessage = error.error?.Message ?? error.message;
                    this.messageDialogService.open('Invoice Void failed', 'Error Message: ' + errorMessage);
                  }
                  );
                }
              });
          }
        }
        else {
          // Restore before Void changes
          this.invoice = deepClone(this.invoiceCopy);
          this.endorsementStatusService.invoiceSaving = false;
        }
      }
    }
  }

  private async undoPost(): Promise<boolean> {
    if (this.isValid()) {
      this.invoiceCopy = deepClone(this.invoice);
      this.invoice.invoiceStatus = 'T';
      this.invoice.proFlag = 0;
      this.invoice.voidDate = null;
      if (!(await this.save())) {
        // Restore before Undo
        this.invoice = deepClone(this.invoiceCopy);
        return false;
      }
      return true;
    }
    else {
      this.showInvalidControls();
      return false;
    }
  }

  private async voidInvoice(): Promise<boolean> {
    if (this.isValid()) {
      this.invoiceCopy = deepClone(this.invoice);
      this.invoice.invoiceStatus = 'V';
      this.invoice.proFlag = 0;
      this.invoice.voidDate = new Date();
      return await this.save();
    }
    else {
      this.showInvalidControls();
      return false;
    }
  }

  isValid(): boolean {
    if (this.header != null) {
      if (this.header.invoiceMasterForm.status != 'VALID') {
        return false;
      }
    }
    if (this.components != null) {
      for (const child of this.components) {
        if (child.invoiceDetailForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.header != null) {
      if (this.header.invoiceMasterForm.dirty) {
        return true;
      }
    }
    if (this.components != null) {
      for (const child of this.components) {
        if (child.invoiceDetailForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  showInvalidControls(): void {
    const invalid = [];
    // Loop through each child component to see it any of them have invalid controls
    if (this.components != null) {
      for (const child of this.components) {
        for (const name in child.invoiceDetailForm.controls) {
          if (child.invoiceDetailForm.controls[name].invalid) {
            invalid.push(name);
          }
        }
      }
    }
    this.invalidMessage = '';
    // Compile all invalid controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (const error of invalid) {
        this.invalidMessage += '<br><li>' + error;
      }
    }
    if (this.showInvalid) {
      this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
