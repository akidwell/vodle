import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { PropertyDeductible } from 'src/app/features/quote/models/property-deductible';
import { PropertyDeductibleLookup } from 'src/app/core/models/property-deductible-lookup';

@Component({
  selector: 'rsps-property-deductible',
  templateUrl: './property-deductible.component.html',
  styleUrls: ['./property-deductible.component.css']
})
export class PropertyDeductibleComponent implements OnInit {
  deductibleTypes$: Observable<Code[]> | undefined;
  deductibleCodes$: Observable<Code[]> | undefined;
  propertyDeductibles$: Observable<PropertyDeductibleLookup[]> | undefined;
  collapsed = true;
  faAngleUp = faAngleUp;

  @Input() public programId!: number;
  @Input() public deductible!: PropertyDeductible;
  @Input() public canEdit = false;
  @Output() deleteDeductible: EventEmitter<PropertyDeductible> = new EventEmitter();

  constructor( private dropdowns: DropDownsService, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes(this.programId);
    this.deductibleCodes$ = this.dropdowns.getDeductibleCodes(this.programId);
    this.propertyDeductibles$ = this.dropdowns.getPropertyDeductibles();
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
}
