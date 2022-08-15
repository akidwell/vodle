import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PropertyBuilding } from 'src/app/features/quote/models/property-building';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { State } from 'src/app/core/models/state';
import { Observable, Subscription } from 'rxjs';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { AddressLookupService } from 'src/app/core/services/address-lookup/address-lookup.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { Code } from 'src/app/core/models/code';

@Component({
  selector: 'rsps-property-building',
  templateUrl: './property-building.component.html',
  styleUrls: ['./property-building.component.css']
})
export class PropertyBuildingComponent implements OnInit {
  // collapsed = true;
  faAngleUp = faAngleUp;
  states$: Observable<State[]> | undefined;
  cspCodes$: Observable<Code[]> | undefined;
  firstExpand = true;
  anchorId!: string;
  isLoadingAddress = false;
  addressSub!: Subscription;
  protectionClassList: number[] = [1,2,3,4,5,6,7,8,9,10];

  @Input() public building!: PropertyBuilding;
  @Input() public canEdit = false;
  @Input() public index = 0;
  @Input() public classType!: ClassTypeEnum;
  @Output() deleteBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();
  @Output() copyBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();
  @Output() addCoverage: EventEmitter<PropertyBuilding> = new EventEmitter();
  @Output() filterBuilding: EventEmitter<PropertyBuilding> = new EventEmitter();

  constructor(private confirmationDialogService: ConfirmationDialogService, private dropdowns: DropDownsService, private addressLookupService: AddressLookupService,
    private messageDialogService: MessageDialogService) { }

  ngOnInit(): void {
    this.anchorId = 'focusBuilding' + this.index;
    if (this.building.expand) {
      this.building.expand = false;
      this.collapseExpand(false);
      this.focus();
    }
  }

  ngOnDestroy(): void {
    this.building.isExpanded = false;
    this.addressSub?.unsubscribe();
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
            if (address.country != null) {
              this.building.countryCode = address.country;
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
    // this.collapsed = event;
    setTimeout(() => {
      this.building.isExpanded = !event;
    });
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

  add(): void {
    this.addCoverage.emit(this.building);
  }

  filterExpand(): void {
    this.building.expand = true;
    this.filterBuilding.emit(this.building);
  }

  filter(): void {
    this.filterBuilding.emit(this.building);
  }

  focus(): void {
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 250);
  }
}

