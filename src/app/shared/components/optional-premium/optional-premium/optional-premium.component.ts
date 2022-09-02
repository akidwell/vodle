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

  @Input() canDrag = false;


  private modalRef!: NgbModalRef;
  @Output() copyExisitingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();
  @Output() deleteExistingOptionalPremium: EventEmitter<OptionalPremiumClass> = new EventEmitter();

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
    console.log(this.optionalPremiumData.isAppliedToAll);
    this.coverageCodes = [{key: 1, description: 'Sewer Backup', code: '1'},
      {key: 2, description: 'Ordinance or Law - B&C Combined', code: '2'},
      {key: 3, description: 'Equipment Breakdown', code: '3'},
      {key: 4, description: 'Enhancement Endorsement - Package A', code: '4'}
    ];
    console.log(this.type);
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
}

