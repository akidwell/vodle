import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { EndorsementCoveragesGroup } from '../coverages-base/coverages';
import { AccountInformation, Endorsement, PolicyInformation } from '../../models/policy';
import { InvoiceData, InvoiceDetail, newInvoice, newInvoiceDetail } from '../../models/invoice';
import { InvoiceGroupComponent } from '../summary-invoice-group/invoice-group.component';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { PolicyService } from '../../services/policy/policy.service';

@Component({
  selector: 'rsps-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] = [];
  invoices: InvoiceData[] = [];
  authSub: Subscription;
  canEditPolicy = false;
  showInvalid = false;
  invalidMessage = '';
  policyInfo!: PolicyInformation;
  accountInfo!: AccountInformation;
  endorsement!: Endorsement;
  canEditEndorsement = false;
  statusSub!: Subscription;
  invoiceSavingSub!: Subscription;
  refreshInvoiceSub!: Subscription;
  policyTabvalidatedSub!: Subscription;
  coverageTabvalidatedSub!: Subscription;
  reinsuranceTabvalidatedSub!: Subscription;
  isInvoiceSaving = false;
  showBusy = false;

  @ViewChildren(InvoiceGroupComponent) invoiceGroupComp: QueryList<InvoiceGroupComponent> | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private userAuth: UserAuth, private dropDownService: DropDownsService, private endorsementStatusService: EndorsementStatusService, private policyService: PolicyService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    this.policyTabvalidatedSub = this.endorsementStatusService.policyInfoValidated$.subscribe(async () => {
      this.checkFixed();
    });
    this.coverageTabvalidatedSub = this.endorsementStatusService.coverageValidated$.subscribe(async () => {
      this.checkFixed();
    });
    this.reinsuranceTabvalidatedSub = this.endorsementStatusService.reinsuranceValidated$.subscribe(async () => {
      this.checkFixed();
    });

    this.router.events.subscribe(event => {
      switch (true) {
      case event instanceof NavigationStart: {
        const nav = event as NavigationStart;
        if (nav.url.startsWith('/policy') && nav.url.endsWith('/summary')) {
          this.checkUpdate();
        }
        break;
      }
      default: {
        break;
      }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.route.parent?.data.subscribe(async data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.accountInfo = data['accountData'].accountInfo;
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
    });

    const invoices$ = this.policyService.getPolicyInvoices(this.endorsement.policyId, this.endorsement.endorsementNumber);
    this.invoices = await lastValueFrom(invoices$);
    this.loadInvoice();

    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: async canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
    this.invoiceSavingSub = this.endorsementStatusService.invoiceSaving$.subscribe({
      next: async isInvoiceSaving => {
        this.showBusy = isInvoiceSaving;
      }
    });
    this.refreshInvoiceSub = this.endorsementStatusService.refreshInvoice$.subscribe({
      next: async () => {
        const invoices$ = this.policyService.getPolicyInvoices(this.endorsement.policyId, this.endorsement.endorsementNumber);
        this.invoices = await lastValueFrom(invoices$);
        this.loadInvoice();
        this.showBusy = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.statusSub?.unsubscribe();
    this.invoiceSavingSub?.unsubscribe();
    this.refreshInvoiceSub?.unsubscribe();
    this.policyTabvalidatedSub?.unsubscribe();
    this.coverageTabvalidatedSub?.unsubscribe();
    this.reinsuranceTabvalidatedSub?.unsubscribe();
  }

  async checkFixed() {
    if (this.showInvalid && this.endorsementStatusService.isValidated()) {
      await this.loadInvoice();
    }
    else {
      this.checkValidation();
    }
  }

  async loadInvoice() {
    const isValid = this.checkValidation();
    if (isValid && !this.endorsementStatusService.invoiced && this.invoices.filter(i => i.invoiceStatus != 'V').length == 0) {
      await this.createInvoice();
      this.invoiceGroupComp?.forEach(element => {
        if (element.invoice.invoiceStatus == 'V') {
          element.collapsePanel(true);
        }
      });
    }
    else {
      this.checkUpdate();
    }
  }

  private async checkUpdate() {
    if (this.invoices.length > 0 && (this.invoices[0].invoiceStatus == 'N' || (this.invoices[0].invoiceStatus == 'T' && this.invoices[0].proFlag == 0))) {
      await this.updateInvoice();
    }
  }

  private checkValidation(): boolean {
    const policyInfoValidated = this.endorsementStatusService.policyInfoValidated;
    const coveragesValidated = this.endorsementStatusService.coverageValidated;
    const reinsuranceValidated = this.endorsementStatusService.reinsuranceValidated;
    if ((!policyInfoValidated || !coveragesValidated || !reinsuranceValidated)) {
      this.showInvalid = true;
      this.invalidMessage = 'Unable to create/edit invoice at this time';
      if (!policyInfoValidated) {
        this.invalidMessage += '<br><li> Policy Info needs to be validated';
      }
      if (!coveragesValidated) {
        this.invalidMessage += '<br><li> Coverages needs to be validated';
      }
      if (!reinsuranceValidated) {
        this.invalidMessage += '<br><li>Reinsurance needs to be validated';
      }
      return false;
    }
    else {
      this.invalidMessage = '';
      this.showInvalid = false;
    }
    return true;
  }

  private async createInvoice() {
    const invoice = newInvoice();
    invoice.policyId = this.policyInfo.policyId;
    invoice.PolicySymbol = this.policyInfo.policySymbol;
    invoice.FullPolicyNumber = this.policyInfo.fullPolicyNo;
    invoice.endorsementNumber = this.endorsement.endorsementNumber;
    invoice.effectiveDate = this.endorsement.transactionEffectiveDate;
    invoice.expirationDate = this.endorsement.transactionExpirationDate;
    invoice.transactionTypeCode = this.endorsement.transactionTypeCode;
    const transactionTypes$ = this.dropDownService.getTransactionTypes();
    const transactionTypes = await lastValueFrom(transactionTypes$);
    const coverageCodes$ = this.dropDownService.getCoverageCodes();
    const coverageCodes = await lastValueFrom(coverageCodes$);

    invoice.transctionTypeDescription = transactionTypes.find(c => c.key == this.endorsement.transactionTypeCode)?.description ?? 'Error';
    invoice.reason = this.endorsementStatusService.endorsementReason;
    const invoiceDetail = newInvoiceDetail();
    invoiceDetail.lineItemCode = this.policyInfo.quoteData.coverageCode.trim();
    invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code.trim() == invoiceDetail.lineItemCode)?.description ?? 'Error';
    invoiceDetail.feeAmount = this.endorsement.premium ?? 0;
    invoiceDetail.commissionRate = this.accountInfo.commissionRate ?? 0;
    invoiceDetail.commissionAmount = Math.round(10 * (invoiceDetail.feeAmount * (invoiceDetail.commissionRate / 100))) / 10;
    invoiceDetail.netAmount = invoiceDetail.feeAmount - invoiceDetail.commissionAmount;
    invoice.invoiceDetail.push(invoiceDetail);
    // On endorsement 0 we need to copy any fees imported from Paul
    if (this.endorsement.endorsementNumber == 0) {
      const lineitems$ = this.policyService.getPolicyLineItems(this.policyInfo.policyId, this.endorsement.endorsementNumber);
      const lineitems = await lastValueFrom(lineitems$);
      lineitems.forEach(l => {
        l.isNew = true;
        invoice.invoiceDetail.push(l);
      });
    }
    this.invoices.unshift(invoice);
  }

  private async updateInvoice() {
    if (this.invoices[0].effectiveDate != this.endorsement.transactionEffectiveDate) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].effectiveDate = this.endorsement.transactionEffectiveDate;
    }
    if (this.invoices[0].expirationDate != this.endorsement.transactionExpirationDate) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].expirationDate = this.endorsement.transactionExpirationDate;
    }
    if (this.invoices[0].transactionTypeCode != this.endorsement.transactionTypeCode) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].transactionTypeCode = this.endorsement.transactionTypeCode;
      const transactionTypes$ = this.dropDownService.getTransactionTypes();
      const transactionTypes = await lastValueFrom(transactionTypes$);
      this.invoices[0].transctionTypeDescription = transactionTypes.find(x => x.key == this.invoices[0].transactionTypeCode)?.description ?? '';
    }
    let invoiceDetail: InvoiceDetail;
    if (this.invoices[0].invoiceDetail.length > 0) {
      invoiceDetail = this.invoices[0].invoiceDetail[0];
    }
    else {
      invoiceDetail = newInvoiceDetail();
    }
    if (invoiceDetail.lineItemCode != this.policyInfo.quoteData.coverageCode.trim()) {
      invoiceDetail.isUpdated = true;
      const coverageCodes$ = this.dropDownService.getCoverageCodes();
      const coverageCodes = await lastValueFrom(coverageCodes$);
      invoiceDetail.lineItemCode = this.policyInfo.quoteData.coverageCode.trim();
      invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code.trim() == invoiceDetail.lineItemCode)?.description ?? 'Error';
    }
    if (invoiceDetail.feeAmount != this.endorsement.premium) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.feeAmount = this.endorsement.premium ?? 0;
    }
    if (invoiceDetail.commissionRate != this.accountInfo.commissionRate) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.commissionRate = this.accountInfo.commissionRate ?? 0;
    }
    const commissionAmount = Math.round(10 * (invoiceDetail.feeAmount * (invoiceDetail.commissionRate / 100))) / 10;
    if (invoiceDetail.commissionAmount != commissionAmount) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.commissionAmount = commissionAmount;
    }
    if (invoiceDetail.netAmount != invoiceDetail.feeAmount - invoiceDetail.commissionAmount) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.netAmount = invoiceDetail.feeAmount - invoiceDetail.commissionAmount;
    }
  }

  async resetInvoice() {
    this.createInvoice();
    await this.endorsementStatusService.UpdateInvoiced(false);
    this.endorsementStatusService.refresh();
  }

  isValid(): boolean {
    return (!this.canEdit || (this.invoiceGroupComp?.get(0)?.isValid() ?? true));
  }

  isDirty(): boolean {
    return this.canEdit && (this.invoiceGroupComp?.get(0)?.isDirty() ?? false);
  }

  save(): void {
    this.invoiceGroupComp?.get(0)?.tempSave();
  }

  showInvalidControls(): void {
    this.invoiceGroupComp?.get(0)?.showInvalidControls();
  }

  hideInvalid(): void {
    if (this.endorsementStatusService.isValidated()) {
      this.showInvalid = false;
    }
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }
}
