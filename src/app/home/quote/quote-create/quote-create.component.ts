import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { newPolicyData, PolicyData } from 'src/app/policy/policy';
import { SubmissionSearchService } from '../submission-search/submission-search.service';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { PolicyService } from 'src/app/policy/policy.service';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { Router, RouteReuseStrategy } from '@angular/router';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { ReinsuranceLookupService } from 'src/app/policy/reinsurance/reinsurance-lookup/reinsurance-lookup.service';

@Component({
  selector: 'rsps-quote-create',
  templateUrl: './quote-create.component.html',
  styleUrls: ['./quote-create.component.css']
})
export class QuoteCreateComponent implements OnInit {
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  policyData!: PolicyData;
  submissionSub!: Subscription;
  isSubmissionNumberValid: boolean = false;
  showSubmissionNumberInvalid: boolean = false;
  showPolicyNumberInvalid: boolean = false;
  showExpirationDateInvalid: boolean = false;
  policySymbols$: Observable<Code[]> | undefined;

  @ViewChild('quoteForm', { static: false }) quoteForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<QuoteCreateComponent>
  private modalRef!: NgbModalRef

  constructor(private modalService: NgbModal, private submissionSearchService: SubmissionSearchService, private policyService: PolicyService, private router: Router, private dropDownsService: DropDownsService, private routeReuseStrategy: RouteReuseStrategy, private dropDownService: DropDownsService, private reinsuranceLookupService: ReinsuranceLookupService) { }

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

  checkDates() {
    if (this.policyData.policyEffectiveDate != null && !isNaN(new Date(this.policyData.policyEffectiveDate).getDate()) && this.policyData.policyExpirationDate == null) {
      this.policyData.policyExpirationDate = new Date(this.policyData.policyEffectiveDate + ' 00:00:00');
      this.policyData.policyExpirationDate.setFullYear(this.policyData.policyExpirationDate.getFullYear() + 1)
    }
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
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('information');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('coverages');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('schedules');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('reinsurance');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('summary');
    this.dropDownService.clearPolicyDropDowns();
    this.reinsuranceLookupService.clearReinsuranceCodes();
    this.router.navigate(['/policy/' + response.policyId.toString() + '/0']);
    }
  }
}


export interface PolicyAddResponse {
  isPolicyCreated: boolean;
  policyId: number;
  errorMessage: string;
}