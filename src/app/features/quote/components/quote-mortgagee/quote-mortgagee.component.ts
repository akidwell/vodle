import { Component } from '@angular/core';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { QuoteClass } from '../../classes/quote-class';

@Component({
  selector: 'rsps-quote-mortgagee',
  templateUrl: './quote-mortgagee.component.html',
  styleUrls: ['./quote-mortgagee.component.css']
})
export class QuoteMortgageeComponent {

  quote!: QuoteClass[];

  constructor(public headerPaddingService: HeaderPaddingService) {
  }


}