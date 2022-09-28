import { Component, Input, OnInit } from '@angular/core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faE, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormViewType } from 'src/app/core/enums/form-view-type';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { SubjectivitiesClass } from 'src/app/shared/classes/subjectivities-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';

@Component({
  selector: 'rsps-subjectivities',
  templateUrl: './subjectivities.component.html',
  styleUrls: ['./subjectivities.component.css']
})
export class SubjectivitiesComponent extends SharedComponentBase implements OnInit {
  collapsed = false;
  filteredSubjectivities: SubjectivitiesClass[] = [];
  currentView = FormViewType.OnPolicy;
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  showExpiring = false;
  expiringFormsLoading = false;
  //expiringForms: EndorsementSubjectivityData[] | null = null;
  allSubjectivitiesCount = 0;
  mandatorySubjectivitesCount = 0;
  optionalSubjectivitesCount = 0;
  onPolicySubjectivitesCount = 0;
  expiringSubjectivitiesCount = 0;
  isSaving = false;
  saveSub!: Subscription;
  private _subjectivities!: SubjectivitiesClass[];

  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set subjectivities(value: SubjectivitiesClass[]) {
    this._subjectivities = value;
    this.refreshForms();
  }
  get subjectivities(): SubjectivitiesClass[] {
    return this._subjectivities;
  }

  constructor(
    userAuth: UserAuth,
    public headerPaddingService: HeaderPaddingService,
    private quoteSavingService: QuoteSavingService
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

  refreshForms() {
    this.setFormCounts();
    this.selectView(this.currentView);
  }
  selectView(currentView: FormViewType) {
    this.currentView = currentView;
    if (currentView == FormViewType.All) {
      this.filteredSubjectivities = this.subjectivities;
    } else if (currentView == FormViewType.Optional) {
      this.filteredSubjectivities = this.subjectivities.filter((c) => !c.ysnDefault);
    } else if (currentView == FormViewType.Mandatory) {
      this.filteredSubjectivities = this.subjectivities.filter((c) => c.ysnDefault);
    } else if (currentView == FormViewType.OnPolicy) {
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

  setFormCounts() {
    this.allSubjectivitiesCount = this.subjectivities.length;
    this.mandatorySubjectivitesCount = this.subjectivities.filter((c) => c.ysnDefault).length;
    this.optionalSubjectivitesCount = this.subjectivities.filter((c) => !c.ysnDefault).length;
    this.onPolicySubjectivitesCount = this.subjectivities.filter((c) => c.isIncluded).length;
  }

  public get formViewType(): typeof FormViewType {
    return FormViewType;
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