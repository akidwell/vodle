import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Code } from 'src/app/core/models/code';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyDataService } from 'src/app/features/quote/services/property-data.service';
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
  coveragesSub!: Subscription;

  quoteData!: PropertyQuoteClass | null;
  @Input() program!: ProgramClass | null;
  readOnlyQuote = false;

  collapsed = true;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;
  isHover = false;
  buildingList!: Code[];
  coverageCodes: Code[] = [];
  blockResetOnLoad = true;

  isPremiumMappingSet = false;
  isSubjectToMaxAmountAvailable = false;
  isSubjectToMaxAmountRequired = false;
  isLimitAvailable = false;
  isLimitRequired = false;
  isDeductibleAvailable = false;
  isDeductibleRequired = false;
  isAdditionalDetailRequired = false;
  isAdditionalPremiumRequired = false;
  validateQuote = ValidationTypeEnum.Quote;
  coverages: OptionalPremiumMapping[] = [];

  @Input() canDrag = false;

  private modalRef!: NgbModalRef;
  @Output() copyExisitingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();
  @Output() deleteExistingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();
  @Input() coveragesObs$!: Observable<OptionalPremiumMapping[]>;
  @Input() optionalPremiumData!: OptionalPremiumClass;
  @Input() deductibleTypes$: Observable<Code[]> | undefined;
  @Input() deductibleCodes$: Observable<Code[]> | undefined;

  constructor(public headerPaddingService: HeaderPaddingService,
    private confirmationDialogService: ConfirmationDialogService,
    userAuth: UserAuth,
    private propertyDataService: PropertyDataService) {
    super(userAuth);
  }
  ngOnInit(): void {
    this.quoteData = this.program?.quoteData instanceof PropertyQuoteClass ? this.program.quoteData : null;
    if (this.quoteData != null) {
      this.readOnlyQuote = this.quoteData.readOnlyQuote;
    }
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
    this.coveragesSub = this.coveragesObs$.subscribe({
      next: result => {
        this.coverages = result;
        this.setActiveCoverageMapping(this.optionalPremiumData.coverageCode);
      }
    });

    this.handleSecurity(this.type);
  }
  ngOnDestroy(): void {
    this.buildingsSub?.unsubscribe();
    this.coveragesSub?.unsubscribe();
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
    setTimeout(() => {
      this.deleteExistingOptionalPremium.emit(this.optionalPremiumData);
    });
  }

  copy(): void {
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
    if (this.coverages) {
      this.coverages.forEach(element => {
        if(element.coverageCode == coverageCode) {
          this.optionalPremiumData.premiumMapping = element;
          this.setFlags();
          this.resetOptions();
          if(this.isSubjectToMaxAmountRequired) {
            this.optionalPremiumData.isSubjectToMaxAmount = true;
          }
        }
      });
    }
  }

  calculateLawLimitAndExposure(){
    this.quoteData?.calculateLawLimits();
    this.quoteData?.calculateLargestExposure();
  }

  setFlags() {
    this.isLimitAvailable = this.optionalPremiumData.isLimitAvailable() || false;
    this.isLimitRequired = this.optionalPremiumData.isLimitRequired() || false;
    this.isPremiumMappingSet = this.optionalPremiumData.isPremiumMappingSet() || false;
    this.isSubjectToMaxAmountAvailable = this.optionalPremiumData.isSubjectToMaxAmountAvailable() || false;
    this.isSubjectToMaxAmountRequired = this.optionalPremiumData.isSubjectToMaxAmountRequired() || false;
    this.isDeductibleAvailable = this.optionalPremiumData.isDeductibleAvailable() || false;
    this.isDeductibleRequired = this.optionalPremiumData.isDeductibleRequired() || false;
    this.isAdditionalDetailRequired = this.optionalPremiumData.isAdditionalDetailRequired() || false;
    this.isAdditionalPremiumRequired = this.optionalPremiumData.isAdditionalPremiumRequired() || false;

  }
  resetOptions() {
    if (!this.blockResetOnLoad) {
      this.optionalPremiumData.additionalPremium = null;
      this.optionalPremiumData.deductible = null;
      this.optionalPremiumData.deductibleCode = null;
      this.optionalPremiumData.deductibleType = null;
      this.optionalPremiumData.isDeductibleSelected = false;
      this.optionalPremiumData.isSubjectToMaxAmount = false;
      this.optionalPremiumData.subjectToMaxPercent = null;
    }
    this.blockResetOnLoad = false;
  }
}

