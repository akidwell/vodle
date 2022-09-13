import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentBase } from '../../component-base/shared-component-base';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';
import { PolicyFormClass } from '../../classes/policy-form-class';
import { SpecimenPacketService } from './services/policy-forms.service';
import { lastValueFrom } from 'rxjs';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PolicyFormVariableComponent } from './policy-form-variable/policy-form-variable.component';
import { DialogSizeEnum } from 'src/app/core/enums/dialog-size-enum';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';


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
  filteredForms: PolicyFormClass[] = [];
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

  constructor(userAuth: UserAuth, private specimenPacketService: SpecimenPacketService, private messageDialogService: MessageDialogService, public headerPaddingService: HeaderPaddingService) {
    super(userAuth);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.pageYOffset > this.headerPaddingService.totalHeaderHeight + 70) {
      const element = document.getElementById('formVersion');
      element?.classList.add('sticky');
    } else {
      const element = document.getElementById('formVersion');
      element?.classList.remove('sticky');
    }
  }

  ngOnInit(): void {
  }

  selectAll() {
    this.filteredForms = this.forms;
  }
  selectOptional() {
    this.filteredForms = this.forms.filter(c => !c.isMandatory);
  }
  selectMandatory() {
    this.filteredForms = this.forms.filter(c => c.isMandatory);
  }
  selectExpiring() {
  }
  selectOnPolicy() {
    this.filteredForms = this.forms.filter(c => c.isIncluded);
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
        this.forms = policyForms;
      });
  }
}
