import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { State } from 'src/app/core/models/state';
import { Observable, Subscription } from 'rxjs';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PropertyQuoteBuildingCoverageClass } from 'src/app/features/quote/classes/property-quote-building-coverage-class';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { Code } from 'src/app/core/models/code';

@Component({
  selector: 'rsps-property-building',
  templateUrl: './property-building.component.html',
  styleUrls: ['./property-building.component.css']
})
export class PropertyBuildingComponent implements OnInit {
  collapsed = true;
  faAngleUp = faAngleUp;
  states$: Observable<State[]> | undefined;
  cspCodes$: Observable<Code[]> | undefined;
  firstExpand = true;
  anchorId!: string;
  isLoadingAddress = false;
  addressSub!: Subscription;

  @Input() public building!: PropertyBuilding;
  @Input() public canEdit = false;
  @Input() public index = 0;
  @Input() public classType!: ClassTypeEnum;
  @Output() deleteBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();
  @Output() copyBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();

  constructor(private confirmationDialogService: ConfirmationDialogService, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService,
    private messageDialogService: MessageDialogService) { }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.index;
    if (this.building.isNew && !this.building.isImport) {
      this.collapseExpand(false);
      this.focus();
    }
  }

  changeState(state: State) {
    this.building.countryCode = state.countryCode;
  }

  changeZipCode(): void {
    if (this.building.zip?.length == 5 || this.building.zip?.length == 9) {
      this.building.isZipLookup = true;
      this.addressSub = this.addressLookupService.getAddress(this.building.zip).subscribe({
        next: (address) => {
          if (address != null) {
            if (address.city != null) {
              this.building.city = address?.city;
            }
            if (address.state != null) {
              this.building.state = address.state;
            }
          }
          this.building.isZipLookup = false;
        },
        error: (error) => {
          this.building.isZipLookup = false;
          const errorMessage = error.error?.Message ?? error.message;
          this.messageDialogService.open('Error', errorMessage);
        },
      });
    }
  }

  get addressReadOnly() {
    if (!this.canEdit){
      return '';
    }
    else if (this.building.validateAddress) {
      return 'address-valid';
    }
    return 'address-invalid';
  }

  collapseExpand(event: boolean) {
    if (this.firstExpand) {
      this.states$ = this.dropdowns.getStates();
      this.firstExpand = false;
    }
    this.collapsed = event;
  }

  copy(): void {
    this.copyBuilding.emit(this.building);
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation','Are you sure you want to delete this building?').then((result: boolean) => {
      if (result) {
        this.delete();
      }
    });
  }

  async delete() {
    this.deleteBuilding.emit(this.building);
  }

  addCoverage() {
    if (this.classType == ClassTypeEnum.Quote) {
      const newCoverage = new PropertyQuoteBuildingCoverageClass();
      this.building.propertyQuoteBuildingCoverage.push(newCoverage);
    }
    else if (this.classType == ClassTypeEnum.Policy) {
      //TODO
    }
  }
  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}

