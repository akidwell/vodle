import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { PropertyDeductible } from 'src/app/features/quote/models/property-deductible';
import { PropertyDeductibleLookup } from 'src/app/core/models/property-deductible-lookup';
import { PropertyDataService } from 'src/app/features/quote/services/property-data.service';

@Component({
  selector: 'rsps-property-deductible',
  templateUrl: './property-deductible.component.html',
  styleUrls: ['./property-deductible.component.css']
})
export class PropertyDeductibleComponent implements OnInit {
  deductibleTypes$: Observable<Code[]> | undefined;
  deductibleCodes$: Observable<Code[]> | undefined;
  propertyDeductibles$: Observable<PropertyDeductibleLookup[]> | undefined;
  buildingList!: Code[];
  collapsed = true;
  faAngleUp = faAngleUp;
  buildingsSub!: Subscription;
  anchorId!: string;

  @Input() public index = 0;
  @Input() public programId!: number;
  @Input() public deductible!: PropertyDeductible;
  @Input() public canEdit = false;
  @Output() copyDeductible: EventEmitter<PropertyDeductible> = new EventEmitter();
  @Output() deleteDeductible: EventEmitter<PropertyDeductible> = new EventEmitter();

  constructor( private dropdowns: DropDownsService, private confirmationDialogService: ConfirmationDialogService, private propertyDataService: PropertyDataService) { }

  ngOnInit(): void {
    this.anchorId = 'focusHere' + this.index;
    if (this.deductible.isNew) {
      this.collapseExpand(false);
      this.focus();
    }
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes(this.programId);
    this.deductibleCodes$ = this.dropdowns.getDeductibleCodes(this.programId);
    this.propertyDeductibles$ = this.dropdowns.getPropertyDeductibles();
    this.buildingsSub = this.propertyDataService.buildingList$.subscribe({
      next: results => {
        this.buildingList = results;
        if (this.buildingList.find(c => c.code == this.deductible.building) == null) {
          this.deductible.building = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.buildingsSub?.unsubscribe();
  }
  
  collapseExpand(event: boolean) {
    this.collapsed = event;
  }

  openDeleteConfirmation() {
    this.confirmationDialogService.open('Delete Confirmation','Are you sure you want to delete this deductible?').then((result: boolean) => {
      if (result) {
        this.delete();
      }
    });
  }

  copy(): void {
    this.copyDeductible.emit(this.deductible);
  }

  async delete() {
    this.deleteDeductible.emit(this.deductible);
  }

  changeDeductible(item: PropertyDeductibleLookup) {
    if (item !== undefined) {
      if (item?.defaultDeductibleType !== null) {
        this.deductible.deductibleType = item.defaultDeductibleType;
      }
      if (item?.defaultDeductibleCode !== null) {
        this.deductible.deductibleCode = item.defaultDeductibleCode;
      }
    }
  }

  dropDownSearch(term: string, item: Code) {
    term = term.toLowerCase();
    return item.code?.toLowerCase().indexOf(term) > -1 || item.key?.toString().toLowerCase().indexOf(term) > -1 || item.description?.toLowerCase().indexOf(term) > -1;
  }

  focus(): void {
    this.collapsed = false;
    setTimeout(() => {
      document.getElementById(this.anchorId)?.scrollIntoView();
    }, 250);
  }
}
