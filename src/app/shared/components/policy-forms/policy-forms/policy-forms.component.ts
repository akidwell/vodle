import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { DialogSizeEnum } from 'src/app/core/enums/dialog-size-enum';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { EndorsementFormData } from 'src/app/features/policy/models/policy';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { PolicyFormClass } from 'src/app/shared/classes/policy-form-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { PolicyFormsService } from '../services/policy-forms.service';
import { PolicyFormVariableComponent } from '../policy-form-variable/policy-form-variable.component';
import { FormViewType } from 'src/app/core/enums/form-view-type';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';

@Component({
  selector: 'rsps-policy-forms',
  templateUrl: './policy-forms.component.html',
  styleUrls: ['./policy-forms.component.css'],
})
export class PolicyFormsComponent extends SharedComponentBase implements OnInit {
  collapsed = false;
  faEdit = faEdit;
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  showExpiring = false;
  expiringFormsLoading = false;
  filteredForms: PolicyFormClass[] = [];
  expiringForms: EndorsementFormData[] | null = null;
  currentView = FormViewType.OnPolicy;
  availableFormsCount = 0;
  mandatoryFormsCount = 0;
  optionalFormsCount = 0;
  onPolicyFormsCount = 0;
  expiringFormsCount = 0;
  unselectedFormsCount = 0;
  isSaving = false;
  saveSub!: Subscription;
  isBusy = false;
  private _forms!: PolicyFormClass[];

  @ViewChild('modal') private groupEditComponent!: PolicyFormVariableComponent;
  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set forms(value: PolicyFormClass[]) {
    this._forms = value;
    this.refreshForms();
  }
  get forms(): PolicyFormClass[] {
    return this._forms;
  }

  constructor(
    userAuth: UserAuth,
    private policyFormsService: PolicyFormsService,
    private messageDialogService: MessageDialogService,
    public headerPaddingService: HeaderPaddingService,
    private policyService: PolicyService,
    private quoteSavingService: QuoteSavingService
  ) {
    super(userAuth);
  }

  ngOnInit(): void {
    this.loadExpiring();
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
    if (currentView == FormViewType.Expiring) {
      this.selectExpiring();
    } else {
      this.showExpiring = false;
      if (currentView == FormViewType.Available) {
        this.filteredForms = this.forms;
      } else if (currentView == FormViewType.Optional) {
        this.filteredForms = this.forms.filter((c) => !c.isMandatory);
      } else if (currentView == FormViewType.Mandatory) {
        this.filteredForms = this.forms.filter((c) => c.isMandatory);
      } else if (currentView == FormViewType.OnPolicy) {
        this.filteredForms = this.forms.filter((c) => c.isIncluded);
      }
    }
  }

  selectAll() {
    this.showExpiring = false;
    this.filteredForms = this.forms;
  }
  selectOptional() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter((c) => !c.isMandatory);
  }
  selectMandatory() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter((c) => c.isMandatory);
  }
  selectOnPolicy() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter((c) => c.isIncluded);
  }
  selectExpiring() {
    this.showExpiring = true;
  }
  setFormCounts() {
    this.availableFormsCount = this.forms.length;
    this.mandatoryFormsCount = this.forms.filter((c) => c.isMandatory).length;
    this.optionalFormsCount = this.forms.filter((c) => !c.isMandatory).length;
    this.onPolicyFormsCount = this.forms.filter((c) => c.isIncluded).length;
    this.unselectedFormsCount = this.forms.filter((c) => c.isSelected && !c.isIncluded).length;
  }

  async loadExpiring() {
    if (this.quote.submission.expiringPolicyId) {
      // Check Cache is null first
      if (!this.expiringForms) {
        this.expiringFormsLoading = true;
        this.policyService
          .getEndorsementForms(this.quote.submission.expiringPolicyId)
          .subscribe((forms) => {
            if (forms) {
              let endorsementNumber = -1;
              forms.map((c) => {
                if (c.endorsementNumber != endorsementNumber) {
                  c.firstEndorsementRow = true;
                  endorsementNumber = c.endorsementNumber;
                }
              });
              this.expiringForms = forms;
            } else {
              this.expiringForms = [];
            }
            this.expiringFormsLoading = false;
            this.expiringFormsCount = this.forms.length;
          });
      }
    }
  }

  get showVariableForm(): boolean {
    return this.filteredForms.findIndex((c) => c.isVariable) >= 0;
  }

  get showIcons(): boolean {
    return this.filteredForms.findIndex((c) => c.hasSpecialNote) >= 0;
  }

  async openSpecimen(form: PolicyFormClass) {
    if (form.specimenLink) {
      window.open(form.specimenLink, '_self');
    } else if (form.formName) {
      const response$ = this.policyFormsService.getSpecimenURL(form.formName);
      await lastValueFrom(response$).then((specimen) => {
        if (specimen) {
          window.open(specimen, '_self');
        }
      });
    }
  }

  async specimenLink() {
    if (this.submissionNumber != null && this.quoteNumber != null) {
      const response$ = this.policyFormsService.getSpecimentPacketURL(
        this.submissionNumber.toString() + '|' + this.quoteNumber.toString(),
        this._forms
          .filter((c) => c.isIncluded)
          .map((c) => c.formName)
          .join(',')
          .slice(0, -1)
      );
      await lastValueFrom(response$).then((url) => {
        if (url) {
          window.open(url, '_self');
        }
      });
    }
  }

  async showSpecialNote(formName: string | null) {
    if (formName) {
      const response$ = this.policyFormsService.getSpecialNote(formName);
      await lastValueFrom(response$).then((specialNote) => {
        if (specialNote) {
          this.messageDialogService.open('Special Note', specialNote, DialogSizeEnum.XtraLarge);
        }
      });
    }
  }

  async editVariableForm(form: PolicyFormClass) {
    if (form) {
      await this.groupEditComponent.open(form,this.quote);
    }
  }

  public get formViewType(): typeof FormViewType {
    return FormViewType;
  }

  checkIncluded() {
    this.setFormCounts();
  }

  async getQuote() {
    // this.policyFormsService.getQuote(this.quote.quoteId);
    this.isBusy = true;
    const response$ = this.policyFormsService.getQuote(this.quote.quoteId);
    await lastValueFrom(response$).then((guideline) => {
      if (guideline) {

        const file = new Blob([guideline], { type: 'application/octet-stream' });
        // const fileURL = URL.createObjectURL(file);
        // window.open(fileURL,'test.pdf');

        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'QL-' + this.quote.submissionNumber + 'Q' + this.quote.quoteNumber + '.docx';
        document.body.appendChild(element);
        element.click();
        this.isBusy = false;
      }
    })
      .catch((error) => {
        this.isBusy = false;
        const message = String.fromCharCode.apply(null, new Uint8Array(error.error) as any);
        this.messageDialogService.open('Quote Letter Error', message);
      });
  }
}
