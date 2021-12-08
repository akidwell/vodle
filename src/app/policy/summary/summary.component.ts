import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { EndorsementCoveragesGroup } from '../coverages/coverages';
import { AccountInformation, Endorsement, PolicyInformation } from '../policy';
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
  endorsementNumber!: number;
  policyId!: number;

  constructor(private route: ActivatedRoute, private router: Router, private userAuth: UserAuth, private dropDownService: DropDownsService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.data.subscribe((response: any) => {
      this.invoices = response.invoices.invoices;
      this.loadInvoice();
    });

    // Sub to when the tab is reentered in case changes that affect the invoice were made
    this.router.events.subscribe((event: any) => {
      if (event instanceof ActivationEnd &&
        Object.is(event?.snapshot?.component, SummaryComponent)) {
        this.reloadInvoice();
      }
    });
  }

  async loadInvoice() {
    this.route.parent?.data.subscribe(async data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.accountInfo = data['accountData'].accountInfo;
      this.endorsementCoveragesGroups = data['endorsementCoveragesGroups'].endorsementCoveragesGroups;
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
      if ((this.invoices.length == 0 || this.invoices[0].isNew) && this.canEditPolicy) {
        let invoice = newInvoice();
        invoice.policyId = this.policyInfo.policyId;
        invoice.PolicySymbol = this.policyInfo.policySymbol;
        invoice.FullPolicyNumber = this.policyInfo.policyNo;
        invoice.endorsementNumber = this.endorsementNumber;
        invoice.effectiveDate = this.endorsement.transactionEffectiveDate;
        invoice.expirationDate = this.endorsement.transactionExpirationDate;
        invoice.transactionTypeCode = this.endorsement.transactionTypeCode;
        invoice.dueDate?.setDate((invoice.invoiceDate?.getDate() ?? new Date().getDate()) + 30);
        const transactionTypes = await this.dropDownService.getTransactionTypes().toPromise();
        const coverageCodes = await this.dropDownService.getCoverageCodes().toPromise();
        invoice.transctionTypeDescription = transactionTypes.find(c => c.key == this.endorsement.transactionTypeCode)?.description ?? "Error";
        let invoiceDetail = newInvoiceDetail();
        invoiceDetail.lineItemCode = this.endorsementCoveragesGroups[0].coverages[0].coverageCode;
        invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code == invoiceDetail.lineItemCode)?.description ?? "Error";
        invoiceDetail.feeAmount = this.endorsement.premium;
        invoiceDetail.commissionRate = this.accountInfo.commissionRate;
        invoiceDetail.commissionAmount = Math.round(10 * (invoiceDetail.feeAmount * (invoiceDetail.commissionRate / 100))) / 10;
        invoiceDetail.netAmount = invoiceDetail.feeAmount - invoiceDetail.commissionAmount;
        invoice.invoiceDetail.push(invoiceDetail);
        this.invoices.push(invoice);
      }
    });
  }

  async reloadInvoice() {
    if (this.canEditPolicy && (this.invoices[0].isNew || (this.invoices[0].invoiceStatus == "N" || (this.invoices[0].invoiceStatus == "T" && this.invoices[0].proFlag == 0)))) {
      this.invoices[0].effectiveDate = this.policyInfo.policyEffectiveDate;
      this.invoices[0].expirationDate = this.policyInfo.policyExtendedExpDate ?? this.policyInfo.policyExpirationDate;
      this.invoices[0].invoiceDetail[0].lineItemCode = this.endorsementCoveragesGroups[0].coverages[0].coverageCode;
      const coverageCodes = await this.dropDownService.getCoverageCodes().toPromise();
      let invoiceDetail = this.invoices[0].invoiceDetail[0];
      invoiceDetail.lineItemCode = this.endorsementCoveragesGroups[0].coverages[0].coverageCode;
      invoiceDetail.lineItemDescription = coverageCodes.find(c => c.code == invoiceDetail.lineItemCode)?.description ?? "Error";
      invoiceDetail.feeAmount = this.endorsement.premium;
      invoiceDetail.commissionRate = this.accountInfo.commissionRate;
      invoiceDetail.commissionAmount = Math.round(10 * (invoiceDetail.feeAmount * (invoiceDetail.commissionRate / 100))) / 10;
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
    this.invoiceGroupComp?.get(0)?.tempSave();
  }

  showInvalidControls(): void {
    this.invoiceGroupComp?.get(0)?.showInvalidControls();
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

}
