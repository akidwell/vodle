import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { QuoteDeductibleClass } from 'src/app/features/quote/classes/quote-deductible-class';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'rsps-property-premium-deductible',
  templateUrl: './property-premium-deductible.component.html',
  styleUrls: ['./property-premium-deductible.component.css']
})
export class PropertyPremiumDeductibleComponent implements OnInit {
  deductibleTypes$: Observable<Code[]> | undefined;
  deductibleCodes$: Observable<Code[]> | undefined;
  propertyDeductibles$: Observable<Code[]> | undefined;
  collapsed = true;
  faAngleUp = faAngleUp;

  @Input() public deductible!: QuoteDeductibleClass;
  @Input() public canEdit = false;

  constructor( private dropdowns: DropDownsService) { }

  ngOnInit(): void {
    this.deductibleTypes$ = this.dropdowns.getDeductibleTypes();
    this.deductibleCodes$ = this.dropdowns.getDeductibleCodes();
    this.propertyDeductibles$ = this.dropdowns.getPropertyDeductibles();
    
  }

  collapseExpand(event: boolean) {
    this.collapsed = event;
  }

}
