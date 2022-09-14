import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { DialogSizeEnum } from 'src/app/core/enums/dialog-size-enum';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { EndorsementFormData, newEndorsementFormData } from 'src/app/features/policy/models/policy';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { PolicyFormClass } from 'src/app/shared/classes/policy-form-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { SpecimenPacketService } from '../services/policy-forms.service';
import { PolicyFormVariableComponent } from '../policy-form-variable/policy-form-variable.component';


@Component({
  selector: 'rsps-policy-forms',
  templateUrl: './policy-forms.component.html',
  styleUrls: ['./policy-forms.component.css']
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
  private _forms!: PolicyFormClass[];

  @ViewChild('modal') private groupEditComponent!: PolicyFormVariableComponent;
  @Input() quote!: QuoteClass;
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set forms(value: PolicyFormClass[]) {
    this._forms = value;
    this.selectOnPolicy();
  }
  get forms(): PolicyFormClass[] {
    return this._forms;
  }

  constructor(userAuth: UserAuth, private specimenPacketService: SpecimenPacketService, private messageDialogService: MessageDialogService, public headerPaddingService: HeaderPaddingService, private policyService: PolicyService) {
    super(userAuth);
  }

  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll() {
  //   if (window.pageYOffset > this.headerPaddingService.totalHeaderHeight + 70) {
  //     const element = document.getElementById('formVersion');
  //     element?.classList.add('sticky');
  //   } else {
  //     const element = document.getElementById('formVersion');
  //     element?.classList.remove('sticky');
  //   }
  // }

  ngOnInit(): void {
  }

  selectAll() {
    this.showExpiring = false;
    this.filteredForms = this.forms;
  }
  selectOptional() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter(c => !c.isMandatory);
  }
  selectMandatory() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter(c => c.isMandatory);
  }
  selectOnPolicy() {
    this.showExpiring = false;
    this.filteredForms = this.forms.filter(c => c.isIncluded);
  }

  async selectExpiring() {
    if (this.quote.submission.expiringPolicyId) {
      this.showExpiring = true;
      // Check Cache is null first
      if (!this.expiringForms) {
        this.expiringFormsLoading = true;
        const response$ = this.policyService.getEndorsementForms(this.quote.submission.expiringPolicyId);
        this.expiringForms = await lastValueFrom(response$)
          .then(forms => {
            if (forms) {
              let endorsementNumber = -1;
              let index = 0;
              forms.map(c => {
                if (c.endorsementNumber != endorsementNumber) {
                  const endorsementHeader = newEndorsementFormData();
                  endorsementHeader.endorsementNumber = c.endorsementNumber;
                  forms.splice(index,0,endorsementHeader);
                  endorsementNumber = c.endorsementNumber;
                }
                index++;
              });
              this.expiringFormsLoading = false;
              return forms;
            }
            this.expiringFormsLoading = false;
            return [];
          })
          .catch(error => {
            this.messageDialogService.open('Error getting expiring forms', error.error.Message ?? error.message);
            this.expiringFormsLoading = false;
            return [];
          }
          );
      }
    }
  }
  get showVariableForm(): boolean {
    return this.filteredForms.findIndex(c => c.isVariable) >= 0;
  }

  get showIcons(): boolean {
    return this.filteredForms.findIndex(c => c.hasSpecialNote) >= 0;
  }

  async openSpecimen(form: PolicyFormClass) {
    if (form.specimenLink) {
      window.open(form.specimenLink, '_self');
    }
    else if (form.formName) {
      const response$ = this.specimenPacketService.getSpecimenURL(form.formName);
      await lastValueFrom(response$)
        .then(specimen => {
          if (specimen) {
            window.open(specimen, '_self');
          }
        });
    }
  }

  async specimenLink() {
    if (this.submissionNumber != null && this.quoteNumber != null) {
      const response$ = this.specimenPacketService.getSpecimentPacketURL(this.submissionNumber.toString() + '|' + this.quoteNumber.toString(),this._forms.filter(c => c.isIncluded).map(c => c.formName).join(',').slice(0,-1));
      await lastValueFrom(response$)
        .then(url => {
          if (url) {
            window.open(url, '_self');
          }
        });
    }
  }

  async showSpecialNote(formName: string | null) {
    if (formName) {
      const response$ = this.specimenPacketService.getSpecialNote(formName);
      await lastValueFrom(response$)
        .then(specialNote => {
          if (specialNote) {
            this.messageDialogService.open('Special Note', specialNote, DialogSizeEnum.XtraLarge);
          }
        });
    }
  }

  async editVariableForm(formName: string | null) {
    if (formName) {
      await this.groupEditComponent.open(formName);
    }
  }

  async changeState() {
    const response$ = this.specimenPacketService.refreshForms(this.quote);
    await lastValueFrom(response$)
      .then(quote => {
        const policyForms: QuotePolicyFormClass[] = [];
        if(quote.quotePolicyForms) {
          quote.quotePolicyForms.forEach((element) => {
            policyForms.push(new QuotePolicyFormClass(element));
          });
        }
        this.quote.quotePolicyForms = policyForms;
        this.forms = policyForms;
      });
  }


  async changeStateFL() {
    this.quote.riskState = 'FL';
    await this.changeState();
  }

  async changeStateGA() {
    this.quote.riskState = 'GA';
    await this.changeState();
  }
}
