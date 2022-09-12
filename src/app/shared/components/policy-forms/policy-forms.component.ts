import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentBase } from '../../component-base/shared-component-base';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';
import { PolicyFormClass } from '../../classes/policy-form-class';
import { SpecimenPacketService } from './services/specimen-packet.service';
import { lastValueFrom } from 'rxjs';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PolicyFormVariableComponent } from './policy-form-variable/policy-form-variable.component';
import { DialogSizeEnum } from 'src/app/core/enums/dialog-size-enum';


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
  @Input() submissionNumber!: number;
  @Input() quoteNumber!: number;
  @Input() set forms(value: PolicyFormClass[]) {
    this._forms = value;
    this.selectOnPolicy();
  }
  get forms(): PolicyFormClass[] {
    return this._forms;
  }

  constructor(userAuth: UserAuth, private specimenPacketService: SpecimenPacketService, private messageDialogService: MessageDialogService) {
    super(userAuth);
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

  async specimenLink() {
    if (this.submissionNumber != null && this.quoteNumber != null) {
      const response$ = this.specimenPacketService.getSpecimentPacketURL(this.submissionNumber.toString() + '|' + this.quoteNumber.toString(),this._forms.filter(c => c.isIncluded).map(c => c.formName).join(',').slice(0,-1));
      await lastValueFrom(response$)
        .then(specimentPacket => {
          if (specimentPacket) {
            window.open(specimentPacket.url, '_self');
          }
        });
    }
  }

  showSpecialNote(specialNote: string | null) {
    if (specialNote) {
      this.messageDialogService.open('Special Note', specialNote, DialogSizeEnum.XtraLarge);
    }
  }

  async editVariableForm(formName: string | null) {
    if (formName) {
      await this.groupEditComponent.open(formName);
    }
  }

}
