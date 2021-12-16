import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { InvoiceData, newInvoiceDetail } from '../invoice';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  issuanceTitle: string = "";
  issuanceMessage: string = "";
  issuanceSub!: Subscription;

  @Input() public invoice!: InvoiceData;
  @Input() index!: number;
  @ViewChild(NgForm, { static: false }) invoiceGroupForm!: NgForm;
  @ViewChild(InvoiceMasterComponent) header!: InvoiceMasterComponent;
  @ViewChildren(InvoiceDetailComponent) components: QueryList<InvoiceDetailComponent> | undefined;
  @ViewChild('modalPipe') modalPipe: any;

  constructor(private userAuth: UserAuth, private router: Router, private policyService: PolicyService, private notification: NotificationService, public datepipe: DatePipe, private endorsementStatusService: EndorsementStatusService, private policyIssuanceService: PolicyIssuanceService, private modalService: NgbModal) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    if (this.index > 0) {
      this.invoiceCollapsed = true;
      this.title += " - " + this.invoice.invoiceNumber + " - " + this.datepipe.transform(this.invoice.invoiceDate, 'M/dd/yyyy') + " - " + this.invoice.invoiceStatusDescription;
    }
  }

  ngAfterViewInit(): void {
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
    this.invoiceCollapsed = false;
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
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.canEditPolicy
  }

  get canPost(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.canEditPolicy
  }

  get canVoid(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.canEditPolicy
  }

  get canExport(): boolean {
    return this.invoice != null && ((this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 3) || this.invoice.invoiceStatus == "P") && this.canEditPolicy
  }

  get canAddDetail(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) && this.canEditPolicy
  }

  get showFooter(): boolean {
    return this.invoice != null && (this.invoice.invoiceStatus != "V")
  }

  get totalNetAmount(): number {
    let total: number = 0;
    this.invoice.invoiceDetail.forEach(element => { total += element.netAmount });
    return total;
  }

  tempSave(refresh: boolean): void {
    if (this.isValid()) {
      if (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0)) {
        if (this.invoice.invoiceStatus == "N") {
          this.invoice.invoiceStatus = "T";
          this.invoice.proFlag = 0;
          this.save(refresh);
        }
        else if (this.isDirty()) {
          this.save(refresh);
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
        const saved = await this.save(false);
        if (saved) {
          await this.export();
          this.refresh();
        }
      }
    }
    else {
      this.showInvalidControls();
    }
  }

  async export(): Promise<void> {
    const parm: PolicyIssuanceRequest = { policyId: this.invoice.policyId, endorsementNumber: this.invoice.endorsementNumber };
    this.showBusy = true;

    await this.policyIssuanceService.postPolicyIssuance(parm).toPromise().then(
      importPolicyResponse => {
        this.showBusy = false;
        if (importPolicyResponse.isPolicyIssued) {
          this.issuanceTitle = "Export to Issuance";
          this.issuanceMessage = "Successful";
        }
        else if (importPolicyResponse.errorMessage.indexOf("already exist") > 0) {
          this.issuanceTitle = "Export to Issuance";
          this.issuanceMessage = "Policy already imported";
        }
        else {
          this.issuanceTitle = "Export to Issuance failed";
          this.issuanceMessage = "Error Message: " + importPolicyResponse.errorMessage;
        }
        this.openIssuanceModal();
      },
      err => {
        this.issuanceTitle = "Export to Issuance failed";
        this.issuanceMessage = "Error Message: " + err;
        this.showBusy = false;
        this.openIssuanceModal();
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
    return await this.policyService.addPolicyInvoice(this.invoice).toPromise<boolean>()
      .then(result => {
        if (result == null) {
          this.markPristine();
          if (refresh) {
            this.refresh();
          }
          this.endorsementStatusService.refresh();
          this.showInvoiceSaved();
          return true;
        }
        else {
          this.showInvoiceNotSaved();
          return false;
        }
      });
  }

  private async updateInvoice(refresh: boolean = false): Promise<boolean> {
    return await this.policyService.updatePolicyInvoice(this.invoice)
      .toPromise<boolean>()
      .then(result => {
        if (result == null) {
          this.markPristine();
          if (refresh) {
            this.refresh();
          }
          this.endorsementStatusService.refresh();
          this.showInvoiceSaved();
          return true;
        }
        else {
          this.showInvoiceNotSaved();
          return false;
        }
      });
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
    this.notification.show('Invoice Saved.', { classname: 'bg-success text-light', delay: 5000 });
  }

  private refresh() {
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url])
  }

  confirmVoid(): void {
    this.issuanceTitle = "Void Confirmation";
    this.issuanceMessage = "Are you sure you want to void this invoice?";
    this.modalService.open(this.modalPipe, { backdrop: 'static', centered: true }).result.then((result) => {
      if (result == 'Void') {
        this.voidInvoice();
      }
    });
  }

  private voidInvoice(): void {
    if (this.isValid()) {
      if (this.invoice.effectiveDate != null && (this.invoice.invoiceStatus == "N" || (this.invoice.invoiceStatus == "T" && this.invoice.proFlag == 0))) {
        this.invoice.invoiceStatus = "V";
        this.invoice.proFlag = 0;
        this.invoice.voidDate = new Date();
        this.save(true);
      }
    }
    else {
      this.showInvalidControls();
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
    // Compile all invalide controls in a list
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

  // Modal is used to show errors
  private openIssuanceModal(): void {
    this.modalService.open(this.modalPipe, { backdrop: 'static', centered: true, scrollable: true });
  }

}