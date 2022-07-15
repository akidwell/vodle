import { Component, Input, OnInit } from '@angular/core';
import { QuoteDeductibleClass } from 'src/app/features/quote/classes/quote-deductible-class';

@Component({
  selector: 'rsps-property-premium-deductible-group',
  templateUrl: './property-premium-deductible-group.component.html',
  styleUrls: ['./property-premium-deductible-group.component.css']
})
export class PropertyPremiumDeductibleGroupComponent implements OnInit {

  @Input() public deductibles!: QuoteDeductibleClass[];
  @Input() public canEdit = false;

  constructor() { }

  ngOnInit(): void {
  }

  addDeductible() {
    const newDeductible = new QuoteDeductibleClass();
    this.deductibles.push(newDeductible);
  }
}
