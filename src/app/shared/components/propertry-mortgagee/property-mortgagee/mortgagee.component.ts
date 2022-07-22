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
import { MortgageeClass } from '../mortgagee-class';

@Component({
  selector: 'rsps-mortgagee',
  templateUrl: './mortgagee.component.html',
  styleUrls: ['./mortgagee.component.css']
})
export class MortgageeComponent {

  quote!: MortgageeClass[];
  confirmation = '';
  authSub: Subscription;
  canEditSubmission = false;
  faAngleDown = faAngleDown;
  //faAngleUp = faAngleUp;
  collapsed = true;
  firstExpand = true;
  faArrowUp = faAngleUp;
  anchorId!: string;
  states$: Observable<State[]> | undefined;
  addressSub!: Subscription;
  isLoadingAddress = false;


  private modalRef!: NgbModalRef;
  @Output() copyExisitingMortgagee: EventEmitter<MortgageeClass> = new EventEmitter();
  @Output() deleteExistingMortgagee: EventEmitter<MortgageeClass> = new EventEmitter();

  @Input() mortgageeData!: MortgageeClass;
  @Input() mortgagee!: MortgageeClass[];



  constructor(public headerPaddingService: HeaderPaddingService,
    private confirmationDialogService: ConfirmationDialogService,
    private userAuth: UserAuth,
    private dropdowns: DropDownsService,
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    private addressLookupService: AddressLookupService,
    private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.mortgageeData.mortgageHolder;
    if (this.mortgageeData.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
  }

  openDeleteConfirmation() {
    this.confirmation = 'overlay';
    this.confirmationDialogService.open('Delete Mortgagee Confirmation','Are you sure you want to delete mortgagee?').then((result: boolean) => {
      this.confirmation = '';
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    if (this.mortgageeData.isNew) {
      setTimeout(() => {
        this.deleteExistingMortgagee.emit(this.mortgageeData);
      });
    } else {
      const results$ = this.quoteService.deleteMortgagee(this.mortgageeData);
      return await lastValueFrom(results$).then(() => {
        this.deleteExistingMortgagee.emit(this.mortgageeData);
      });
    }
  }

  copyMortgagee(): void {
    console.log(this.mortgageeData);
    this.copyExisitingMortgagee.emit(this.mortgageeData);
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
    if (this.mortgageeData.zip?.length == 5) {
      this.mortgageeData.isZipLookup = true;
      this.addressSub = this.addressLookupService.getAddress(this.mortgageeData.zip).subscribe({
        next: (address) => {
          if (address != null) {
            if (address.city != null) {
              this.mortgageeData.city = address?.city;
            }
            if (address.state != null) {
              this.mortgageeData.state = address.state;
            }
          }
          this.mortgageeData.isZipLookup = false;
        },
        error: (error) => {
          this.mortgageeData.isZipLookup = false;
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Error', errorMessage);
        },
      });
    }
  }

  changeState(state: State) {
    this.mortgageeData.countryCode = state.countryCode;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}

