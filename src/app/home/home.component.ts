import { Component, OnInit, ViewChild } from '@angular/core';
import { QuoteCreateComponent } from './quote/quote-create/quote-create.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('modal') private locationComponent!: QuoteCreateComponent

  createQuote() {
    var result = this.locationComponent.open();
  }
}
