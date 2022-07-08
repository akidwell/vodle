import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable, of, Subject, Subscription } from 'rxjs';
import { EndorsementNumberResponse, newPolicyData, PolicyData } from 'src/app/features/policy/models/policy';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { Router } from '@angular/router';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { debounceTime, tap } from 'rxjs/operators';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { SubmissionSearchService } from '../../services/submission-search/submission-search.service';
import { PolicySearchResponses } from '../../models/search-results';
import { SubmissionResponse } from '../../models/submissionResponse';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { EndorsementNumbersService } from '../../services/endorsement-numbers/endorsement-numbers.service';

@Component({
  selector: 'rsps-direct-policy',
  templateUrl: './direct-policy.component.html',
  styleUrls: ['./direct-policy.component.css']
})
export class DirectPolicyComponent implements OnInit {
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  policyData!: PolicyData;
  submissionSub!: Subscription;
  isSubmissionNumberValid = false;
  showPolicyNumberInvalid = false;
  showExpirationDateInvalid = false;
  policySymbols$: Observable<Code[]> | undefined;
  submissionError = 'invalid';
  isSearching = false;
  searchThrottle = new Subject<void>();
  searchSub!: Subscription;
  showBusy = false;
  isRenewal = false;
  isRewrite = false;
  endorsementNumbers$: Observable<EndorsementNumberResponse[]> | undefined;
  title = 'Direct Policy';
  policyInfo!: PolicySearchResponses;

  @ViewChild('quoteForm', { static: false }) quoteForm!: NgForm;
  @ViewChild('modal') private modalContent!: TemplateRef<DirectPolicyComponent>;
  private modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal, private submissionSearchService: SubmissionSearchService, private policyService: PolicyService, private router: Router, private dropDownsService: DropDownsService, private navigationService: NavigationService, private messageDialogService: MessageDialogService, private endorsementNumbersService: EndorsementNumbersService) {
    this.policyData = newPolicyData();
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
      this.submissionError = 'invalid';
      this.isSubmissionNumberValid = false;
      this.showPolicyNumberInvalid = false;
      this.showExpirationDateInvalid = false;
      this.policyData = newPolicyData();
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async openRewrite(policy: PolicySearchResponses): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.isSearching = false;
      this.submissionError = 'invalid';
      this.isSubmissionNumberValid = false;
      this.showPolicyNumberInvalid = false;
      this.showExpirationDateInvalid = false;
      this.policyData = newPolicyData();
      this.policyInfo = policy;
      this.policyData.endorsementNumber = policy.endorsementNumber;
      this.title = 'Cancel/Rewrite';
      this.isRewrite = true;
      this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' });
      this.modalRef.result.then(resolve, resolve);
    });
  }

  submissionLookup() {
    if (this.policyData.submissionNumber != null && this.policyData.submissionNumber > 0 && this.policyData.submissionNumber < Math.pow(2, 31)) {
      this.isSubmissionNumberValid = false;
      this.submissionSub = this.submissionSearchService.getSubmissionSearch(this.policyData.submissionNumber).subscribe({
        next: async (match: SubmissionResponse) => {
          this.isSearching = false;
          this.isSubmissionNumberValid = match.isMatch;
          this.isRenewal = match.expiringPolicyId != null ? true : false;

          if (match.expiringPolicyId != null) {
            const endorsementNumbers$ = this.endorsementNumbersService.getEndorsementNumbers(match.expiringPolicyId);
            this.endorsementNumbers$ = of(await lastValueFrom(endorsementNumbers$));
          }
          if (match.isMatch) {
            this.submissionError = 'valid';
            this.policyData.policyEffectiveDate = match.effectiveDate;
            this.policyData.policyExpirationDate = match.expirationDate;
            this.policyData.policySymbol = match.policySymbol;
            this.policyData.policyNumber = match.policyNumber;
            this.policyData.endorsementNumber = null;
            this.policyData.premium = null;
            if(this.isRewrite){
              this.policyData.endorsementNumber = this.policyInfo.endorsementNumber;
            }
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
    this.submissionError = 'invalid';
    this.isSubmissionNumberValid = false;
    this.isRenewal = false;
    this.policyData.policyEffectiveDate = null;
    this.policyData.policyExpirationDate = null;
    this.policyData.endorsementNumber = null;
    this.policyData.premium = null;
    this.policyData.policySymbol = '';
    this.policyData.policyNumber = '';
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
    if (this.policyData.policyEffectiveDate != null && (this.policyData.policyExpirationDate == null || this.policyData.policyExpirationDate.toString() === '' ) && !isNaN(new Date(this.policyData.policyEffectiveDate).getDate())) {
      const newDate = new Date(this.policyData.policyEffectiveDate);
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
    const response$ = this.policyService.addPolicy(this.policyData);
    await lastValueFrom(response$)
      .then((response) => {
        if (response.policyId != null) {
          this.modalRef.close();
          this.navigationService.resetPolicy();
          this.router.navigate(['/policy/' + response.policyId.toString() + '/0']);
        }
      })
      .catch((error) => {
        this.showBusy = false;
        this.messageDialogService.open('Direct Policy Error', error.error.Message)
          .then(() =>
            this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
          );
      });
  }

  async createRewrite() {
    this.showBusy = true;
    this.modalRef.close();
    const response$ = this.policyService.addPolicy(this.policyData);
    await lastValueFrom(response$)
      .then((response) => {
        if (response.policyId != null) {
          this.modalRef.close();
          this.navigationService.resetPolicy();
          this.router.navigate(['/policy/' + response.policyId.toString() + '/0']);
        }
      })
      .catch((error) => {
        this.showBusy = false;
        this.messageDialogService.open('Cancel/Rewrite Error', error.error.Message)
          .then(() =>
            this.modalRef = this.modalService.open(this.modalContent, { backdrop: 'static' })
          );
      });
  }

}
