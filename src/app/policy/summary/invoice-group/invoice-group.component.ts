import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { InvoiceData, newInvoiceDetail } from '../invoice';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { PolicyService } from '../../policy.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { InvoiceMasterComponent } from './invoice-master/invoice-master.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { PolicyIssuanceRequest } from '../policy-issuance-service/policy-issuance-request';
import { PolicyIssuanceService } from '../policy-issuance-service/policy-issuance.service';
import { ErrorDialogService } from 'src/app/error-handling/error-dialog-service/error-dialog-service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog-service/confirmation-dialog.service';
import { PolicyHistoryService } from 'src/app/navigation/policy-history/policy-history.service';
import { deepClone } from 'src/app/helper/deep-clone';
import { PolicyInformation } from '../../policy';

@Component({
  selector: 'rsps-invoice-group',
  templateUrl: './invoice-group.component.html',
  styleUrls: ['./invoice-group.component.css']
})
export class InvoiceGroupComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  invoiceCollapsed: boolean = false;
  authSub: Subscription;
  canEditPolicy: boolean = false;
  title: string = "Transaction Summary";
  addSub!: Subscription;
  updateSub!: Subscription;
  showInvalid: boolean = false;
  invalidMessage: string = "";
  showBusy: boolean = false;
  issuanceSub!: Subscription;
  invoiceCopy!: InvoiceData;

  @Input() public policyInfo!: PolicyInformation;
  @Input() public invoice!: InvoiceData;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) invoiceGroupForm!: NgForm;
  @ViewChild(InvoiceMasterComponent) header!: InvoiceMasterComponent;
  @ViewChildren(InvoiceDetailComponent) components: QueryList<InvoiceDetailComponent> | undefined;

  constructor(private userAuth: UserAuth, private router: Router, private policyService: PolicyService, private notification: NotificationService, public datepipe: DatePipe, private endorsementStatusService: EndorsementStatusService, private policyIssuanceService: PolicyIssuanceService, private messageDialogService: ErrorDialogService, private confirmationDialogService: ConfirmationDialogService, private policyHistoryService: PolicyHistoryService) {
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
    this.authSub.unsubscribe();
    this.addSub?.unsubscribe();
    this.updateSub?.unsubscribe();
    this.issuanceSub?.unsubscribe();
  }

  addNewInvoiceDetail(): void {
    let newDetail = newInvoiceDetail();
    newDetail.invoiceNumber = this.invoice.invoiceNumber;
    newDetail.lineNumber = this.getNextSequence();
    this.invoice.invoiceDetail.push(newDetail);
    this.collapsePanel(false);
  }

  collapsePanel(isCollapsed: boolean) {
    this.invoiceCollapsed = isCollapsed;
    if (isCollapsed) {
      this.title = "Transaction Summary - " + this.invoice.invoiceNumber + " - " + this.datepipe.transform(this.invoice.invoiceDate, 'MM/dd/yyyy') + " - " + this.invoice.invoiceStatusDescription;
    }
    else {
      this.title = "Transaction Summary";
    }
  }

  getNextSequence(): number {
    if (this.invoice.invoiceDetail.length == 0) {
      return 1;
    }
    else {
      return Math.max(...this.invoice.invoiceDetail.map(o => o.lineNumber)) + 1;
    }
  }
  get canSave(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

  get canPost(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

  get canVoid(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && (this.invoice.proFlag == 0 || this.invoice.proFlag == 3))) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

  get canExport(): boolean {
    return this.invoice != null && ((this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 3) || this.invoice.invoiceStatus == "P") && this.endorsementStatusService.isValidated() && !this.endorsementStatusService.directQuote && this.invoice.endorsementNumber == 0 && this.canEditPolicy
  }

  get canAddDetail(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.endorsementStatusService.isValidated() && this.canEditPolicy
  }

  get showFooter(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus != "V")
  }

  get totalNetAmount(): number {
    let total: number = 0;
    this.invoice.invoiceDetail.forEach(element => {
      total += Number.isNaN(Number(element.netAmount)) ? 0 : Number(element.netAmount)
    });
    return total;
  }

  async clickSave() {
    this.showBusy = true;
    await this.tempSave(true);
    this.showBusy = false;
  }

  async tempSave(refresh: boolean): Promise<void> {
    if (this.isValid()) {
      if (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) {
        if (this.invoice.invoiceStatus == "N") {
          this.invoice.invoiceStatus = "T";
          this.invoice.proFlag = 0;
          const isSaved = await this.save(refresh);
        }
        else if (this.isDirty()) {
          const isSaved = await this.save(refresh);
        }
      }
    }
    else {
      this.showInvalidControls();
    }

  }

  async post(): Promise<void> {
    if (this.isValid()) {
      if (this.invoice.effectiveDate != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0))) {
        this.showBusy = true;
        this.invoiceCopy = deepClone(this.invoice);
        this.invoice.invoiceStatus = "T";
        this.invoice.proFlag = 3;
        this.invoice.invoiceDate = new Date();
        this.invoice.invoiceDate.setHours(0, 0, 0, 0);
        let effectiveDate = new Date(this.invoice.effectiveDate);
        let dueDate = new Date();
        dueDate.setDate(effectiveDate.getDate() + 30);
        this.invoice.dueDate = dueDate;
        if (effectiveDate < this.invoice.invoiceDate) {
          this.invoice.dueDate.setDate(this.invoice.invoiceDate.getDate() + 30);
        }
        const isSaved = await this.save(false);
        if (isSaved) {
          if (this.canExport) {
            await this.export();
          }
          this.refreshPage();
        }
        else {
          // Restore before Post changes
          this.invoice = deepClone(this.invoiceCopy);
        }
        this.showBusy = false;
      }
    }
    else {
      this.showInvalidControls();
    }
  }

  async export(): Promise<void> {
    const parm: PolicyIssuanceRequest = { policyId: this.invoice.policyId, endorsementNumber: this.invoice.endorsementNumber };
    this.showBusy = true;
    const results$ = this.policyIssuanceService.postPolicyIssuance(parm);
    await lastValueFrom(results$).then(
      importPolicyResponse => {
        this.showBusy = false;
        if (importPolicyResponse.isPolicyIssued) {
          this.messageDialogService.open("Export to Issuance", "Successful");
        }
        else if (importPolicyResponse.errorMessage.indexOf("already exist") > 0) {
          this.messageDialogService.open("Export to Issuance", "Policy already imported");
        }
        else {
          this.messageDialogService.open("Export to Issuance failed", "Error Message: " + importPolicyResponse.errorMessage);
        }
      },
      error => {
        this.showBusy = false;
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open("Export to Issuance failed", "Error Message: " + errorMessage);
      }
    );
  }

  private async save(refresh: boolean = false): Promise<boolean> {
    if (this.invoice.isNew) {
      return await this.addInvoice(refresh);
    }
    else {
      return await this.updateInvoice(refresh);
    }
  }

  private async addInvoice(refresh: boolean = false): Promise<boolean> {
    const results$ = this.policyService.addPolicyInvoice(this.invoice);
    return await lastValueFrom(results$)
      .then(async result => {
        return this.refresh(result == null, refresh);
      },
        (error) => {
          this.showBusy = false;
          this.showInvoiceNotSaved();
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open("Invoice Save Error", errorMessage);
          return false;
        });
  }

  private async updateInvoice(refresh: boolean = false): Promise<boolean> {
    const results$ = this.policyService.updatePolicyInvoice(this.invoice);
    return await lastValueFrom(results$)
      .then(async result => {
        return this.refresh(result == null, refresh);
      },
        (error) => {
          this.showBusy = false;
          this.showInvoiceNotSaved();
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open("Invoice Save Error", errorMessage);
          return false;
        });
  }

  private async refresh(isSuccesful: boolean, refresh: boolean = false): Promise<boolean> {
    if (isSuccesful) {
      this.markPristine();
      await this.endorsementStatusService.refresh();
      if (refresh) {
        // If a Void then make sure the policy dates were not affected by a trigger
        if (this.invoice.invoiceStatus == "V") {
          const results$ = this.policyService.getPolicyInfo(this.invoice.policyId);
          await lastValueFrom(results$).then((policy) => {
            this.policyInfo.policyCancelDate = policy.policyCancelDate;
            this.policyInfo.policyExtendedExpDate = policy.policyExtendedExpDate;
          });
        }
        this.refreshPage();
      }
      this.showInvoiceSaved();
      return true;
    }
    else {
      this.showInvoiceNotSaved();
      return false;
    }
  }

  private refreshPage() {
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url])
  }

  private markPristine() {
    this.invoice.isNew = false;
    this.invoice.isUpdated = false;
    this.invoice.invoiceDetail.forEach(c => { c.isUpdated = false; c.isNew = false; })
    this.header.invoiceMasterForm.form.markAsPristine();
    if (this.components != null) {
      for (let child of this.components) {
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
    const voidConfirm = await this.confirmationDialogService.open("Void Confirmation", "Are you sure you want to void this invoice?");
    if (voidConfirm) {
      this.showBusy = true;
      if (await this.voidInvoice()) {
        this.showBusy = false;
        this.confirmationDialogService.open("Delete Confirmation", "Would you also like to delete the related endorsement?")
          .then(async deleteEndorsement => {
            if (deleteEndorsement) {
              this.router.navigate(['/home']);
              this.showBusy = true;
              const results$ = this.policyService.deleteEndorsement(this.invoice.policyId, this.invoice.endorsementNumber);
              await lastValueFrom(results$).then(() => {
                this.policyHistoryService.removePolicy(this.invoice.policyId, this.invoice.endorsementNumber);
                this.showBusy = false;
                this.messageDialogService.open("Invoice Voided", "Transaction was deleted succesfully!");
              },
                error => {
                  this.showBusy = false;
                  const errorMessage = error.error?.Message ?? error.message;
                  this.messageDialogService.open("Invoice Void failed", "Error Message: " + errorMessage);
                }
              );
            }
          });
      }
      else {
        // Restore before Void changes
        this.invoice = deepClone(this.invoiceCopy);
        this.showBusy = false;
      }
    }
  }

  private async voidInvoice(): Promise<boolean> {
    if (this.isValid()) {
      this.invoiceCopy = deepClone(this.invoice);
      this.invoice.invoiceStatus = "V";
      this.invoice.proFlag = 0;
      this.invoice.voidDate = new Date();
      return await this.save(true);
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
      };
    }
    if (this.components != null) {
      for (let child of this.components) {
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
      for (let child of this.components) {
        if (child.invoiceDetailForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  showInvalidControls(): void {
    let invalid = [];
    // Loop through each child component to see it any of them have invalid controls
    if (this.components != null) {
      for (let child of this.components) {
        for (let name in child.invoiceDetailForm.controls) {
          if (child.invoiceDetailForm.controls[name].invalid) {
            invalid.push(name);
          }
        }
      }
    }
    this.invalidMessage = "";
    // Compile all invalid controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }
    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}