import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faE, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DisclaimerTypeView } from 'src/app/core/enums/form-view-type';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteDisclaimersClass } from 'src/app/features/quote/classes/quote-disclaimers-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { DisclaimersClass } from 'src/app/shared/classes/disclaimers-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-disclaimers',
  templateUrl: './disclaimers.component.html',
  styleUrls: ['./disclaimers.component.css']
})
export class DisclaimersComponent extends SharedComponentBase implements OnInit {
  collapsed = true;
  filteredDisclaimers: DisclaimersClass[] = [];

  documentType: string[] = ['Quote', 'Binder','Both'];
  currentView = DisclaimerTypeView.OnPolicy;
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  showExpiring = false;
  //expiringFormsLoading = false;
  //expiringForms: EndorsementdisclaimerData[] | null = null;
  allDisclaimersCount = 0;
  mandatoryDisclaimersCount = 0;
  optionalDisclaimersCount = 0;
  onPolicyDisclaimersCount = 0;
  expiringDisclaimersCount = 0;
  isSaving = false;
  saveSub!: Subscription;
  private _disclaimers!: DisclaimersClass[];

  @ViewChild(NgForm, { static: false }) userForm!: NgForm;
  @ViewChild('userModal') private modalContent!: TemplateRef<DisclaimersComponent>;
  private modalRef!: NgbModalRef;
  userDefinedInfo: DisclaimersClass = ({} as any) as DisclaimersClass;
  desc = '';


  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set disclaimers(value: DisclaimersClass[]) {
    this._disclaimers = value;
    this.refreshDisclaimers();
  }
  get disclaimers(): DisclaimersClass[] {
    return this._disclaimers;
  }

  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private quoteSavingService: QuoteSavingService,
    public modalService: NgbModal
  ) {
    super(userAuth);
  }

  ngOnInit(): void {
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }

  ngOnDestroy() {
    this.saveSub?.unsubscribe();
  }

  refreshDisclaimers() {
    this.setDisclaimersCount();
    this.selectDisclaimerView(this.currentView);
  }
  selectDisclaimerView(currentView: DisclaimerTypeView) {
    this.currentView = currentView;
    if (currentView == DisclaimerTypeView.Available) {
      this.filteredDisclaimers = this.disclaimers;
    } else if (currentView == DisclaimerTypeView.Optional) {
      this.filteredDisclaimers = this.disclaimers.filter((c) => !c.ysnDefault);
    } else if (currentView == DisclaimerTypeView.Mandatory) {
      this.filteredDisclaimers = this.disclaimers.filter((c) => c.ysnDefault);
    } else if (currentView == DisclaimerTypeView.OnPolicy) {
      this.filteredDisclaimers = this.disclaimers.filter((c) => c.isIncluded);
      this.onPolicyDisclaimersCount = this.disclaimers.filter((c) => c.isIncluded).length;
    }
  }

  selectAll() {
    this.filteredDisclaimers = this.disclaimers;
  }
  selectOptional() {
    this.filteredDisclaimers = this.disclaimers.filter((c) => !c.ysnDefault);
  }
  selectMandatory() {
    this.filteredDisclaimers = this.disclaimers.filter((c) => c.ysnDefault);
  }
  selectOnPolicy() {
    this.filteredDisclaimers = this.disclaimers.filter((c) => c.isIncluded);
  }

  setDisclaimersCount() {
    this.allDisclaimersCount = this.disclaimers.length;
    this.mandatoryDisclaimersCount = this.disclaimers.filter((c) => c.ysnDefault).length;
    this.optionalDisclaimersCount = this.disclaimers.filter((c) => !c.ysnDefault).length;
    this.onPolicyDisclaimersCount = this.disclaimers.filter((c) => c.isIncluded).length;
  }

  public get disclaimerViewType(): typeof DisclaimerTypeView {
    return DisclaimerTypeView;
  }

  async userDefinedPopup(): Promise<void> {
    return new Promise<void>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  updateDescription(sub: DisclaimersClass){
    this.desc = sub.description ?? '';
  }
  clearAndClose(): void {
    const newUserDefinedInfo: DisclaimersClass = ({} as any) as DisclaimersClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.desc = '';
    this.userDefinedInfo.disclaimerDesc = null;
    this.userDefinedInfo.document = null;
    this.modalRef.close();
  }

  async submit(): Promise<void> {
    const newUserDefinedInfo: DisclaimersClass = ({} as any) as DisclaimersClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.modalRef.close();
    this.userDefinedInfo.description = this.desc;
    this.userDefinedInfo.disclaimerDesc = 'User Defined';
    this.userDefinedInfo.ysnDefault = false;
    this.userDefinedInfo.isUserDefined = true;
    this.userDefinedInfo.isIncluded = true;
    this.userDefinedInfo.isDirty = true;
    this.desc = '';
    this.quote.disclaimerData.push(new QuoteDisclaimersClass(this.userDefinedInfo));
    // have to set to dirty after pushed due to abstract classes can't be instantiated
    // and don't want to set isDirty in the ExisitingInit Function as that is truly for what's from the DB
    const lastAdded = this.quote.disclaimerData.length - 1;
    this.quote.disclaimerData[lastAdded].isDirty = true;
    console.log(this.userDefinedInfo);
    this.refreshDisclaimers();
  }

  // async loadExpiring() {
  //   if (this.quote.submission.expiringPolicyId) {
  //     // Check Cache is null first
  //     if (!this.expiringDisclaimers) {
  //       this.expiringFormsLoading = true;
  //       this.policyService
  //         .getEndorsementDisclaimers(this.quote.submission.expiringPolicyId)
  //         .subscribe((forms) => {
  //           if (forms) {
  //             let endorsementNumber = -1;
  //             forms.map((c) => {
  //               if (c.endorsementNumber != endorsementNumber) {
  //                 c.firstEndorsementRow = true;
  //                 endorsementNumber = c.endorsementNumber;
  //               }
  //             });
  //             this.expiringForms = forms;
  //           } else {
  //             this.expiringForms = [];
  //           }
  //           this.expiringFormsLoading = false;
  //           this.expiringFormsCount = this.forms.length;
  //         });
  //     }
  //   }
  // }
}
