import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoveragesGroup } from '../coverages/coverages';
import { AccountInformation, Endorsement, PolicyInformation } from '../policy';
import { EndorsementStatusService } from '../services/endorsement-status.service';
import { InvoiceData, newInvoice, newInvoiceDetail } from './invoice';
import { InvoiceGroupComponent } from './invoice-group/invoice-group.component';

@Component({
  selector: 'rsps-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] = [];
  invoices!: InvoiceData[];
  authSub: Subscription;
  canEditPolicy: boolean = false;
  showInvalid: boolean = false;
  invalidMessage: string = "";
  policyInfo!: PolicyInformation;
  accountInfo!: AccountInformation;
  endorsement!: Endorsement;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropDownService: DropDownsService, private endorsementStatusService: EndorsementStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe(response => {
      this.invoices = response.invoices.invoicesData;
      this.route.parent?.data.subscribe(async data => {
        this.endorsement = data['endorsementData'].endorsement;
        this.policyInfo = data['policyInfoData'].policyInfo;
        this.accountInfo = data['accountData'].accountInfo;
        this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
        this.loadInvoice();
      });
    });
  }

  async loadInvoice() {
    const isValid = this.checkValidation();
    if (isValid && this.invoices.length == 0) {
      await this.createInvoice();
    }
    else if (this.invoices.length > 0 && (this.invoices[0].invoiceStatus == "N" || (this.invoices[0].invoiceStatus == "T" && this.invoices[0].proFlag == 0))) {
      await this.updateInvoice();
    }
  }

  private checkValidation(): boolean {
    const policyInfoValidated = this.endorsementStatusService.policyInfoValidated;
    const coveragesValidated = this.endorsementStatusService.coverageValidated;
    const reinsuranceValidated = this.endorsementStatusService.reinsuranceValidated;
    if (this.canEditPolicy && (!policyInfoValidated || !coveragesValidated || !reinsuranceValidated)) {
      this.showInvalid = true;
      this.invalidMessage = "Unable to create/edit invoice at this time";
      if (!policyInfoValidated) {
        this.invalidMessage += "<br><li> Policy Info needs to be validated";
      }
      if (!coveragesValidated) {
        this.invalidMessage += "<br><li> Coverages needs to be validated";
      }
      if (!reinsuranceValidated) {
        this.invalidMessage += "<br><li>Reinsurance needs to be validated";
      }
      return false;
    }
    return true;
  }

  private async createInvoice() {
    let invoice = newInvoice();
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
    const coverageCodes =  await lastValueFrom(coverageCodes$);
    invoice.transctionTypeDescription = transactionTypes.find(c => c.key == this.endorsement.transactionTypeCode)?.description ?? "Error";
    invoice.reason = this.endorsementStatusService.endorsementReason;
    let invoiceDetail = newInvoiceDetail();
    invoiceDetail.lineItemCode = this.endorsementCoveragesGroups[0].coverages[0].coverageCode;
    invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code == invoiceDetail.lineItemCode)?.description ?? "Error";
    invoiceDetail.feeAmount = this.endorsement.premium ?? 0;
    invoiceDetail.commissionRate = this.accountInfo.commissionRate ?? 0;
    invoiceDetail.commissionAmount = Math.round(10 * (invoiceDetail.feeAmount * (invoiceDetail.commissionRate / 100))) / 10;
    invoiceDetail.netAmount = invoiceDetail.feeAmount - invoiceDetail.commissionAmount;
    invoice.invoiceDetail.push(invoiceDetail);
    this.invoices.push(invoice);
  }

  private async updateInvoice() {
    if (this.invoices[0].effectiveDate != this.policyInfo.policyEffectiveDate) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].effectiveDate = this.policyInfo.policyEffectiveDate;
    }
    if (this.invoices[0].expirationDate != (this.policyInfo.policyExtendedExpDate ?? this.policyInfo.policyExpirationDate)) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].expirationDate = this.policyInfo.policyExtendedExpDate ?? this.policyInfo.policyExpirationDate;
    }
    if (this.invoices[0].transactionTypeCode != this.endorsement.transactionTypeCode) {
      this.invoices[0].isUpdated = true;
      this.invoices[0].transactionTypeCode = this.endorsement.transactionTypeCode;

      const transactionTypes$ = this.dropDownService.getTransactionTypes();
      const transactionTypes = await lastValueFrom(transactionTypes$);
      this.invoices[0].transctionTypeDescription = transactionTypes.find(x => x.key == this.invoices[0].transactionTypeCode)?.description ?? ""
    }
    let invoiceDetail: any;
    if (this.invoices[0].invoiceDetail.length > 0) {
      invoiceDetail = this.invoices[0].invoiceDetail[0];
    }
    else {
      invoiceDetail = newInvoiceDetail();
    }
    if (invoiceDetail.lineItemCode != this.endorsementCoveragesGroups[0].coverages[0].coverageCode.trim()) {
      invoiceDetail.isUpdated = true;
      const coverageCodes$ = this.dropDownService.getCoverageCodes();
      const coverageCodes = await lastValueFrom(coverageCodes$);
      invoiceDetail.lineItemCode = this.endorsementCoveragesGroups[0].coverages[0].coverageCode;
      invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code == invoiceDetail.lineItemCode)?.description ?? "Error";
    }
    if (invoiceDetail.feeAmount != this.endorsement.premium) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.feeAmount = this.endorsement.premium;
    }
    if (invoiceDetail.commissionRate != this.accountInfo.commissionRate) {
      invoiceDetail.isUpdated = true;
      invoiceDetail.commissionRate = this.accountInfo.commissionRate;
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

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  @ViewChildren(InvoiceGroupComponent) invoiceGroupComp: QueryList<InvoiceGroupComponent> | undefined;

  isValid(): boolean {
    return this.invoiceGroupComp?.get(0)?.isValid() ?? true;
  }

  isDirty(): boolean {
    return this.invoiceGroupComp?.get(0)?.isDirty() ?? false;
  }

  save(): void {
    this.invoiceGroupComp?.get(0)?.tempSave(false);
  }

  showInvalidControls(): void {
    this.invoiceGroupComp?.get(0)?.showInvalidControls();
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
