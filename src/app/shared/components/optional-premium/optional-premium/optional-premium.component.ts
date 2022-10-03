import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyDataService } from 'src/app/features/quote/services/property-data.service';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { OptionalPremiumMapping } from 'src/app/shared/models/optional-premium-mapping';

@Component({
  selector: 'rsps-optional-premium',
  templateUrl: './optional-premium.component.html',
  styleUrls: ['./optional-premium.component.css']
})
export class OptionalPremiumComponent extends SharedComponentBase {

  optionalPremiumList!: OptionalPremiumClass[];
  confirmation = '';
  buildingsSub!: Subscription;
  //canEditSubmission = false;
  collapsed = true;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;
  isHover = false;
  buildingList!: Code[];
  coverageCodes: Code[] = [];

  isPremiumMappingSet = false;
  isSubjectToMaxAmountAvailable = false;
  isSubjectToMaxAmountRequired = false;
  isLimitAvailable = false;
  isLimitRequired = false;
  isDeductibleRequired = false;
  isAdditionalDetailRequired = false;
  isAdditionalPremiumRequired = false;

  @Input() canDrag = false;


  private modalRef!: NgbModalRef;
  @Output() copyExisitingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();
  @Output() deleteExistingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();
  @Input() coverages: OptionalPremiumMapping[];
  @Input() optionalPremiumData!: OptionalPremiumClass;

  constructor(public headerPaddingService: HeaderPaddingService,
    private confirmationDialogService: ConfirmationDialogService,
    userAuth: UserAuth,
    private dropdowns: DropDownsService,
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    private addressLookupService: AddressLookupService,
    private messageDialogService: MessageDialogService,
    private propertyDataService: PropertyDataService) {
    super(userAuth);

    this.coverages = [
      {
        coverageCode: 1,
        coverageDescription: 'Sewer Backup Test',
        coverageDisplay: 'Sewer Backup',
        coverageName: 'Sewer Backup',
        additionalDetailRequired: true,
        deductibleRequired: true,
        defaultDeductibleCode: 3,
        defaultDeductibleType: 3,
        limitRequired: true,
        subjectToMaxAmountRequired: true,
        limitAvailable: true,
        subjectToMaxAmountAvailable: true,
        additionalPremiumRequired: false
      },
      {
        coverageCode: 2,
        coverageDescription: 'Ordinance or Law - B&C Combined Test',
        coverageDisplay: 'Ordinance or Law - B&C Combined',
        coverageName: 'Ordinance or Law - B&C Combined',
        additionalDetailRequired: false,
        deductibleRequired: false,
        defaultDeductibleCode: 3,
        defaultDeductibleType: 3,
        limitRequired: false,
        subjectToMaxAmountRequired: false,
        limitAvailable: false,
        subjectToMaxAmountAvailable: false,
        additionalPremiumRequired: false
      }
    ];
  }
  ngOnInit(): void {
    //this.anchorId = 'focusHere' + this.mortgageeData.mortgageHolder;
    if (this.optionalPremiumData.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
    this.buildingsSub = this.propertyDataService.buildingList$.subscribe({
      next: results => {
        this.buildingList = results;
        if (this.buildingList.find(c => c.code == this.optionalPremiumData.building) == null) {
          this.optionalPremiumData.buildingNumber = null;
        }
      }
    });

    // this.coverageCodes = [{key: 1, description: 'Sewer Backup', code: '1'},
    //   {key: 2, description: 'Ordinance or Law - B&C Combined', code: '2'},
    //   {key: 3, description: 'Equipment Breakdown', code: '3'},
    //   {key: 4, description: 'Enhancement Endorsement - Package A', code: '4'}
    // ];
    console.log(this.type);
    this.setActiveCoverageMapping(this.optionalPremiumData.coverageCode);
    this.handleSecurity(this.type);
  }
  ngOnDestroy(): void {
    this.buildingsSub.unsubscribe();
  }
  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete Optional Premium Confirmation','Are you sure you want to delete optional premium?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    console.log(this.coverages);
    if (this.optionalPremiumData.isNew) {
      setTimeout(() => {
        this.deleteExistingOptionalPremium.emit(this.optionalPremiumData);
      });
    } else {
      //const results$ = this.quoteService.deleteMortgagee(this.mortgageeData);
      // return await lastValueFrom(results$).then(() => {
      //   this.deleteExistingMortgagee.emit(this.mortgageeData);
      // });
    }
  }

  copy(): void {
    console.log(this.optionalPremiumData);
    this.copyExisitingOptionalPremium.emit(this.optionalPremiumData);
  }

  async cancel(): Promise<void> {
    this.modalRef.close('cancel');
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
  setActiveCoverageMapping(coverageCode: number | null) {
    if (coverageCode === null) {
      this.optionalPremiumData.premiumMapping = null;
    }
    this.coverages.forEach(element => {
      if(element.coverageCode == coverageCode) {
        console.log(element);
        this.optionalPremiumData.premiumMapping = element;
        this.setFlags();
        this.resetOptions();
      }
    });
  }

  setFlags() {
    this.isLimitAvailable = this.optionalPremiumData.isLimitAvailable() || false;
    this.isLimitRequired = this.optionalPremiumData.isLimitRequired() || false;
    this.isPremiumMappingSet = this.optionalPremiumData.isPremiumMappingSet() || false;
    this.isSubjectToMaxAmountAvailable = this.optionalPremiumData.isSubjectToMaxAmountAvailable() || false;
    this.isSubjectToMaxAmountRequired = this.optionalPremiumData.isSubjectToMaxAmountRequired() || false;
    this.isDeductibleRequired = this.optionalPremiumData.isDeductibleRequired() || false;
    this.isAdditionalDetailRequired = this.optionalPremiumData.isAdditionalDetailRequired() || false;
    this.isAdditionalPremiumRequired = this.optionalPremiumData.isAdditionalPremiumRequired() || false;

  }
  resetOptions() {
    this.optionalPremiumData.additionalPremium = null;
    this.optionalPremiumData.deductible = null;
    this.optionalPremiumData.deductibleCode = null;
    this.optionalPremiumData.deductibleType = null;
    this.optionalPremiumData.hasDeductible = false;
    this.optionalPremiumData.subjectToMaxAmount = false;
    this.optionalPremiumData.subjectToMaxPercent = null;
  }
}

