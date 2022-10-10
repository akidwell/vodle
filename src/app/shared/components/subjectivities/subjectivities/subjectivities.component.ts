import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faE, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormViewType, SubjectivityTypeView } from 'src/app/core/enums/form-view-type';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteSubjectivitiesClass } from 'src/app/features/quote/classes/quote-subjectivities-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { SubjectivitiesClass } from 'src/app/shared/classes/subjectivities-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { Subjectivities } from 'src/app/shared/interfaces/subjectivities';

@Component({
  selector: 'rsps-subjectivities',
  templateUrl: './subjectivities.component.html',
  styleUrls: ['./subjectivities.component.css']
})
export class SubjectivitiesComponent extends SharedComponentBase implements OnInit {
  collapsed = false;
  filteredSubjectivities: SubjectivitiesClass[] = [];

  documentType: string[] = ['Quote', 'Binder','Both'];
  currentView = SubjectivityTypeView.OnPolicy;
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  showExpiring = false;
  //expiringFormsLoading = false;
  //expiringForms: EndorsementSubjectivityData[] | null = null;
  allSubjectivitiesCount = 0;
  mandatorySubjectivitesCount = 0;
  optionalSubjectivitesCount = 0;
  onPolicySubjectivitesCount = 0;
  expiringSubjectivitiesCount = 0;
  isSaving = false;
  saveSub!: Subscription;
  private _subjectivities!: SubjectivitiesClass[];

  @ViewChild(NgForm, { static: false }) userForm!: NgForm;
  @ViewChild('userModal') private modalContent!: TemplateRef<SubjectivitiesComponent>;
  private modalRef!: NgbModalRef;
  userDefinedInfo: SubjectivitiesClass = ({} as any) as SubjectivitiesClass;
  desc = '';


  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set subjectivities(value: SubjectivitiesClass[]) {
    this._subjectivities = value;
    this.refreshSubjectivities();
  }
  get subjectivities(): SubjectivitiesClass[] {
    return this._subjectivities;
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

  refreshSubjectivities() {
    this.setSubjectivitiesCount();
    this.selectView(this.currentView);
  }
  selectView(currentView: SubjectivityTypeView) {
    this.currentView = currentView;
    if (currentView == SubjectivityTypeView.Available) {
      this.filteredSubjectivities = this.subjectivities;
    } else if (currentView == SubjectivityTypeView.Optional) {
      this.filteredSubjectivities = this.subjectivities.filter((c) => !c.ysnDefault);
    } else if (currentView == SubjectivityTypeView.Mandatory) {
      this.filteredSubjectivities = this.subjectivities.filter((c) => c.ysnDefault);
    } else if (currentView == SubjectivityTypeView.OnPolicy) {
      this.filteredSubjectivities = this.subjectivities.filter((c) => c.isIncluded);
      this.onPolicySubjectivitesCount = this.subjectivities.filter((c) => c.isIncluded).length;
    }
  }

  selectAll() {
    this.filteredSubjectivities = this.subjectivities;
  }
  selectOptional() {
    this.filteredSubjectivities = this.subjectivities.filter((c) => !c.ysnDefault);
  }
  selectMandatory() {
    this.filteredSubjectivities = this.subjectivities.filter((c) => c.ysnDefault);
  }
  selectOnPolicy() {
    this.filteredSubjectivities = this.subjectivities.filter((c) => c.isIncluded);
  }

  setSubjectivitiesCount() {
    this.allSubjectivitiesCount = this.subjectivities.length;
    this.mandatorySubjectivitesCount = this.subjectivities.filter((c) => c.ysnDefault).length;
    this.optionalSubjectivitesCount = this.subjectivities.filter((c) => !c.ysnDefault).length;
    this.onPolicySubjectivitesCount = this.subjectivities.filter((c) => c.isIncluded).length;
  }

  public get viewType(): typeof SubjectivityTypeView {
    return SubjectivityTypeView;
  }

  async userDefinedPopup(): Promise<void> {
    return new Promise<void>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static', centered: true });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  updateDescription(sub: SubjectivitiesClass){
    this.desc = sub.description ?? '';
  }
  clearAndClose(): void {
    const newUserDefinedInfo: SubjectivitiesClass = ({} as any) as SubjectivitiesClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.desc = '';
    this.userDefinedInfo.subjectivityDesc = null;
    this.userDefinedInfo.document = null;
    this.modalRef.close();
  }

  async submit(): Promise<void> {
    const newUserDefinedInfo: SubjectivitiesClass = ({} as any) as SubjectivitiesClass;
    this.userDefinedInfo = newUserDefinedInfo;
    this.modalRef.close();
    this.userDefinedInfo.description = this.desc;
    this.userDefinedInfo.subjectivityDesc = 'User Defined';
    this.userDefinedInfo.ysnDefault = false;
    this.userDefinedInfo.isUserDefined = true;
    this.userDefinedInfo.isIncluded = true;
    this.userDefinedInfo.isDirty = true;
    this.desc = '';
    this.quote.subjectivityData.push(new QuoteSubjectivitiesClass(this.userDefinedInfo));
    console.log(this.userDefinedInfo);
    this.refreshSubjectivities();
  }

  // async loadExpiring() {
  //   if (this.quote.submission.expiringPolicyId) {
  //     // Check Cache is null first
  //     if (!this.expiringSubjectivities) {
  //       this.expiringFormsLoading = true;
  //       this.policyService
  //         .getEndorsementSubjectivities(this.quote.submission.expiringPolicyId)
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