import { Component, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms';
import { SharedComponentBase } from '../../component-base/shared-component-base';
import { faEdit, faExclamationTriangle, faE, faCircle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'rsps-policy-forms',
  templateUrl: './policy-forms.component.html',
  styleUrls: ['./policy-forms.component.css']
})
export class PolicyFormsComponent extends SharedComponentBase implements OnInit {
  collapsed = false;
  forms: QuotePolicyFormClass[] = [];
  faEdit = faEdit;
  faExclamationTriangle = faExclamationTriangle;
  faCircleE = faE;
  faCircle = faCircle;
  
  constructor(userAuth: UserAuth) {
    super(userAuth);

    const test = new QuotePolicyFormClass();
    test.isIncluded = false;
    test.formNumber = '1';
    test.formTitle = 'Test';

    const test2 = new QuotePolicyFormClass();
    test2.isIncluded = false;
    test2.formNumber = '2';
    test2.formTitle = 'Test2';

    const test3 = new QuotePolicyFormClass();
    test3.isIncluded = false;
    test3.formNumber = '3';
    test3.formTitle = 'Test3';

    this.forms.push(test);
    this.forms.push(test2);
    this.forms.push(test3);
  }

  ngOnInit(): void {
  }

}
