import { Component, Input, OnInit } from '@angular/core';
import { QuoteRate } from 'src/app/features/quote/models/quote-rate';

@Component({
  selector: 'rsps-property-premium-rate',
  templateUrl: './property-premium-rate.component.html',
  styleUrls: ['./property-premium-rate.component.css']
})
export class PropertyPremiumRateComponent implements OnInit {
  accountCollapsed = false;

  @Input() public programDescription!: string;
  @Input() public limitTotal!: number;
  @Input() public rate!: QuoteRate;
  @Input() public canEdit = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
