import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { newPolicyData, PolicyData } from 'src/app/policy/policy';
import { SubmissionSearchService } from '../submission-search/submission-search.service';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { PolicyService } from 'src/app/policy/policy.service';
import { Router } from '@angular/router';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NavigationService } from 'src/app/policy/services/navigation.service';

@Component({
  selector: 'rsps-direct-policy-create',
  templateUrl: './direct-policy-create.component.html',
  styleUrls: ['./direct-policy-create.component.css']
})
export class DirectPolicyCreateComponent implements OnInit {
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  policyData!: PolicyData;
  submissionSub!: Subscription;
  isSubmissionNumberValid: boolean = false;
  showSubmissionNumberInvalid: boolean = false;
  showPolicyNumberInvalid: boolean = false;
  showExpirationDateInvalid: boolean = false;
  policySymbols$: Observable<Code[]> | undefined;

  // minDate: string = '2016-08-28';
  minDate: Date = new Date(2020, 0, 1);
  maxDate: Date = new Date(2023, 0, 1);

  @ViewChild('quoteForm', { static: false }) quoteForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<DirectPolicyCreateComponent>
  private modalRef!: NgbModalRef

  constructor(private modalService: NgbModal, private submissionSearchService: SubmissionSearchService, private policyService: PolicyService, private router: Router, private dropDownsService: DropDownsService, private navigationService: NavigationService) {
    this.policyData = newPolicyData();
   }

  ngOnInit(): void {
    this.policySymbols$ = this.dropDownsService.getPolicySymbols();
  }

  ngOnDestroy(): void {
    this.submissionSub?.unsubscribe();
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.showSubmissionNumberInvalid = false;
      this.isSubmissionNumberValid = false;
      this.showPolicyNumberInvalid = false;
      this.showExpirationDateInvalid = false;
      this.policyData = newPolicyData();
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  submissionLookup(event: any) {
    if (this.policyData.submissionNumber != null && this.policyData.submissionNumber > 0 && this.policyData.submissionNumber < Math.pow(2, 31)) {
      this.submissionSub = this.submissionSearchService.getPolicySearch(this.policyData.submissionNumber).subscribe({
        next: match => {
          this.isSubmissionNumberValid = match;
          if (match) {
            this.showSubmissionNumberInvalid = false;
          }
        }
      });
    }
  }

  leaveSubmissionNumber() {
    this.showSubmissionNumberInvalid = !this.isSubmissionNumberValid;
  }

  leavePolicyNumber() {
    this.showPolicyNumberInvalid = !this.validatePolicyNumber();
  }

  changePolicyNumber() {
    // Only remove on change to prevent it showing as typing
    if (this.validatePolicyNumber()) {
      this.showPolicyNumberInvalid = !this.validatePolicyNumber();
    }
  }

  private validatePolicyNumber(): boolean {
    return this.policyData.policyNumber.length == 7;
  }

  setExpirationDate() {
    console.log(this.policyData.policyExpirationDate);
    if (this.policyData.policyEffectiveDate != null && (this.policyData.policyExpirationDate == null || this.policyData.policyExpirationDate.toString() === '' ) && !isNaN(new Date(this.policyData.policyEffectiveDate).getDate())) {
      // var date = this.policyData.policyEffectiveDate.toString().split('-');
      // var newYear = parseInt(date[0]) + 1; //Add year
      // var month = parseInt(date[1]) - 1; //Need to subtract one as Jan = 0 for creating new date
      // var day = parseInt(date[2]);
      // this.policyData.policyExpirationDate = new Date(newYear, month, day, 0,0,0,0) //year, month, day, hours, min, sec, time zone offset

      let newDate = new Date(this.policyData.policyEffectiveDate);
      newDate.setFullYear(newDate.getFullYear() + 1);
      this.policyData.policyExpirationDate = newDate;
      this.checkDates();
    }
  }

  checkDates() {
    if (this.policyData.policyEffectiveDate != null && this.policyData.policyExpirationDate != null) {
      this.showExpirationDateInvalid = this.policyData.policyEffectiveDate >= this.policyData.policyExpirationDate;
    }
  }
  
  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1;
  }

  async create() {
    const response: PolicyAddResponse = await this.policyService.addPolicy(this.policyData).toPromise();
    if (response.isPolicyCreated) {
    this.modalRef.close();
    this.navigationService.resetPolicy();
    this.router.navigate(['/policy/' + response.policyId.toString() + '/0']);
    }
  }
}


export interface PolicyAddResponse {
  isPolicyCreated: boolean;
  policyId: number;
  errorMessage: string;
}
