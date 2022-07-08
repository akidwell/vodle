import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuoteClass } from '../../classes/quote-class';

@Component({
  selector: 'rsps-quote-header',
  templateUrl: './quote-header.component.html',
  styleUrls: ['./quote-header.component.css']
})
export class QuoteHeaderComponent {

  constructor(private route: ActivatedRoute) {
  }
    @Input() public quoteData!: QuoteClass[];


}
