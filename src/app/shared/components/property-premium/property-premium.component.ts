import { Component, Input, OnInit } from '@angular/core';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';

@Component({
  selector: 'rsps-property-premium',
  templateUrl: './property-premium.component.html',
  styleUrls: ['./property-premium.component.css']
})
export class PropertyPremiumComponent implements OnInit {
  accountCollapsed = false;
  quote!: QuoteClass;

  classType = ClassTypeEnum.Quote;

  @Input() public program!: ProgramClass;
  @Input() public canEdit = false;

  constructor() {
  }

  ngOnInit(): void {
    if (this.program?.quoteData != null) {
      this.quote = this.program.quoteData;
    }
  }

}
