import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { State } from 'src/app/core/models/state';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { AdditionalInterestClass } from '../additional-interest-class';

@Component({
  selector: 'rsps-additional-interest',
  templateUrl: './additional-interest.component.html',
  styleUrls: ['./additional-interest.component.css']
})
export class AdditionalInterestComponent {

  quote!: AdditionalInterestClass[];
  confirmation = '';
  authSub: Subscription;
  faAngleDown = faAngleDown;
  //faAngleUp = faAngleUp;
  collapsed = true;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;
  states$: Observable<State[]> | undefined;
  addressSub!: Subscription;
  isLoadingAddress = false;
  canEditSubmission = false;
  isHover = false;
  @Input() canDrag = false;

  private modalRef!: NgbModalRef;
  @Output() copyExisitingAdditionalInterest: EventEmitter<AdditionalInterestClass> = new EventEmitter();
  @Output() deleteExistingAdditionalInterest: EventEmitter<AdditionalInterestClass> = new EventEmitter();

  @Input() aiData!: AdditionalInterestClass;
  @Input() ai!: AdditionalInterestClass[];



  constructor(public headerPaddingService: HeaderPaddingService,
    private confirmationDialogService: ConfirmationDialogService,
    private userAuth: UserAuth,
    private dropdowns: DropDownsService, private route: ActivatedRoute,
    private quoteService: QuoteService,
    private addressLookupService: AddressLookupService,
    private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.aiData.interest;
    if (this.aiData.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete Additional Interest Confirmation','Are you sure you want to delete Additional Interest?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    if (this.aiData.isNew) {
      setTimeout(() => {
        this.deleteExistingAdditionalInterest.emit(this.aiData);
      });
    } else {
      const results$ = this.quoteService.deleteAdditionalInterest(this.aiData);
      return await lastValueFrom(results$).then(() => {
        this.deleteExistingAdditionalInterest.emit(this.aiData);
      });
    }
  }

  copyAdditionalInterest(): void {
    console.log(this.aiData);
    this.copyExisitingAdditionalInterest.emit(this.aiData);
  }

  async cancel(): Promise<void> {
    this.modalRef.close('cancel');
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.states$ = this.dropdowns.getStates();
      this.firstExpand = false;
    }
    this.collapsed = event;
  }


  changeZipCode(): void {
    if (this.aiData.zip?.length == 5) {
      this.aiData.isZipLookup = true;
      this.addressSub = this.addressLookupService.getAddress(this.aiData.zip).subscribe({
        next: (address) => {
          if (address != null) {
            if (address.city != null) {
              this.aiData.city = address?.city;
            }
            if (address.state != null) {
              this.aiData.state = address.state;
            }
          }
          this.aiData.isZipLookup = false;
        },
        error: (error) => {
          this.aiData.isZipLookup = false;
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Error', errorMessage);
        },
      });
    }
  }

  changeState(state: State) {
    this.aiData.countryCode = state.countryCode;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}

