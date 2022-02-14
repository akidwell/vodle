import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { EndorsementNumberResponse, newPolicyData, PolicyData } from 'src/app/policy/policy';
import { SubmissionSearchService } from '../submission-search/submission-search.service';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { PolicyService } from 'src/app/policy/policy.service';
import { Router } from '@angular/router';
import { Code } from 'src/app/drop-downs/code';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NavigationService } from 'src/app/policy/services/navigation.service';
import { debounceTime, tap } from 'rxjs/operators';
import { ErrorDialogService } from 'src/app/error-handling/error-dialog-service/error-dialog-service';
import { ActionService } from '../../search-results/action/action.service';

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
  showPolicyNumberInvalid: boolean = false;
  showExpirationDateInvalid: boolean = false;
  policySymbols$: Observable<Code[]> | undefined;
  submissionError: string = "invalid";
  isSearching: boolean = false;
  searchThrottle = new Subject<string>();
  minEffectiveDate: Date = new Date();
  maxEffectiveDate: Date = new Date();
  minExpirationDate: Date = new Date();
  maxExpirationDate: Date = new Date();
  searchSub!: Subscription;
  showBusy: boolean = false;
  isRenewal: boolean = false;
  saveLabel: string = "OK";
  reinsuranceCodes$: Observable<EndorsementNumberResponse[]> | undefined;

  @ViewChild('quoteForm', { static: false }) quoteForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<DirectPolicyCreateComponent>
  private modalRef!: NgbModalRef

  constructor(private modalService: NgbModal, private submissionSearchService: SubmissionSearchService, private policyService: PolicyService, private router: Router, private dropDownsService: DropDownsService, private navigationService: NavigationService, private errorDialogService: ErrorDialogService, private actionService: ActionService) {
    this.policyData = newPolicyData();
    this.minEffectiveDate.setFullYear(this.minEffectiveDate.getFullYear() - 1); 
    this.maxEffectiveDate.setFullYear(this.maxEffectiveDate.getFullYear() + 1); 
    this.minExpirationDate.setFullYear(this.minExpirationDate.getFullYear() - 1); 
    this.maxExpirationDate.setFullYear(this.maxExpirationDate.getFullYear() + 2); 
   }

  ngOnInit(): void {
  
    this.policySymbols$ = this.dropDownsService.getPolicySymbols();

    this.searchSub = this.searchThrottle.pipe(tap(() => this.isSearching = true), debounceTime(500)).subscribe(() => {
      this.submissionLookup();
    });
  }

  ngOnDestroy(): void {
    this.submissionSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.isSearching = false;
      this.submissionError = "invalid";
      this.isSubmissionNumberValid = false;
      this.showPolicyNumberInvalid = false;
      this.showExpirationDateInvalid = false;
      this.policyData = newPolicyData();
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
      this.modalRef.result.then(resolve, resolve)
    })
  }

  submissionLookup() {
    if (this.policyData.submissionNumber != null && this.policyData.submissionNumber > 0 && this.policyData.submissionNumber < Math.pow(2, 31)) {
      this.isSubmissionNumberValid = false;
      this.submissionSub = this.submissionSearchService.getSubmissionSearch(this.policyData.submissionNumber).subscribe({
        next: async match => {
          this.isSearching = false;
          this.isSubmissionNumberValid = match.isMatch;
          this.isRenewal =  match.expiringPolicyId != null ? true : false;
          this.saveLabel = match.expiringPolicyId != null ? "Renewal" : "OK";

          if (match.expiringPolicyId != null) {
            await this.actionService.getEndorsementNumbers(match.expiringPolicyId).toPromise().then(
              reisuranceCodes => {
                this.reinsuranceCodes$ = of(reisuranceCodes);
              }
            );
          }
          if (match.isMatch) {
            this.submissionError = "valid";
            this.policyData.policyEffectiveDate = match.effectiveDate;
            this.policyData.policyExpirationDate = match.expirationDate;
            this.policyData.policySymbol = match.policySymbol;
            this.policyData.policyNumber = match.policyNumber;
            this.policyData.endorsementNumber = null;
          }
          else {
            this.clear();
          }
        }
      });
    }
    else {
      this.clear();
    }
  }

  private clear() {
    this.isSearching = false;
    this.submissionError = "invalid";
    this.isSubmissionNumberValid = false;
    this.isRenewal = false;
    this.policyData.policyEffectiveDate = null;
    this.policyData.policyExpirationDate = null;
    this.policyData.endorsementNumber = null;
    this.policyData.policySymbol = "";
    this.policyData.policyNumber = "";
    this.saveLabel = "OK";
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
    this.showBusy = true;
    this.modalRef.close();

     await this.policyService.addPolicy(this.policyData).toPromise().then(
      response => {
        this.showBusy = false;
      if (response.policyId != null) {
        this.modalRef.close();
        this.navigationService.resetPolicy();
        this.router.navigate(['/policy/' + response.policyId.toString() + '/0']);
        }
      },
      (error) => {
        this.showBusy = false;
        this.errorDialogService.open("Direct Policy Error", error.error.Message)
        .then(() => this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' }));     
    });
  }

}
