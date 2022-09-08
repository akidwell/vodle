import { Component, Input, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentBase } from '../../component-base/shared-component-base';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';
import { PolicyFormClass } from '../../classes/policy-form-class';


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

  _forms!: PolicyFormClass[];

  @Input() set forms(value: PolicyFormClass[]) {
    this._forms = value;
    this.selectOnPolicy();
  }
  get forms(): PolicyFormClass[] {
    return this._forms;
  }

  constructor(userAuth: UserAuth) {
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
  selectOnPolicy() {
    this.filteredForms = this.forms.filter(c => c.isIncluded);
  }
}
