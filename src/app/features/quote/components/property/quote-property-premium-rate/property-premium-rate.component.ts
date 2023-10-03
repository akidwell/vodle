import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { QuoteRate } from 'src/app/features/quote/models/quote-rate';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { Observable } from 'rxjs';
import { Code } from 'src/app/core/models/code';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Rate } from 'src/app/shared/models/rate';
import { outputAst } from '@angular/compiler';

@Component({
  selector: 'rsps-property-premium-rate',
  templateUrl: './property-premium-rate.component.html',
  styleUrls: ['./property-premium-rate.component.css']
})
export class PropertyPremiumRateComponent implements OnInit {
  accountCollapsed = false;
  isPolicy: boolean = false;
  
  @Input() public programDescription!: string;
  @Input() public limitTotal!: number;
  @Input() public rate!: Rate;
  @Input() public canEdit = false;
  @Input() public readOnlyQuote!: boolean;
  @Input() propertyParent!: PropertyQuoteClass | PolicyClass;
  @Input() public premium: number = 0;

  @Output() updatePremium: EventEmitter<number> = new EventEmitter();
  @Output() updateTerrorism: EventEmitter<string> = new EventEmitter();
  @Output() updateYsnFlatRate: EventEmitter<boolean> = new EventEmitter();
  @Output() updateRateBasis: EventEmitter<number> = new EventEmitter();
  @Output() updateFinalRate: EventEmitter<number> = new EventEmitter();

  public selectedTerrorismCode = '';

  terrorismOptions: Code[] = [];
  public hasTerrorism = false;
  public ysnFlatRate = false;

  constructor(private dropdowns: DropDownsService) {
    console.log('propertypremiumratecomponent const');
  }

  ngOnInit(): void {
    console.log('propertypremiumratecomponent init');
    if(this.propertyParent instanceof PolicyClass){
      this.terrorismOptions = [{ key: 0, code: '', description: ''},
      {key: 1, code: 'I', description: 'Accept'},
      {key: 2, code: 'J', description: 'Decline'}];
      this.isPolicy = true;
      this.selectedTerrorismCode = this.propertyParent.endorsementData.terrorismCode;
    }
    else
    {
      this.isPolicy = false
      this.premium = this.rate.premium ?? 0;
    }
  }
  changeTerrorism(event: Code) {
    this.updateTerrorism.emit(event.code);
  }
  changePremium(event: any) {
    if(this.isPolicy)
      this.updatePremium.emit(this.premium);
    else
      this.rate.premium = this.premium;
  }
  changeYsnFlatRate(event: any){
    this.updateYsnFlatRate.emit(this.rate.isFlatRate);
  }
  changeRateBasis(event: any){
    this.updateRateBasis.emit(this.rate.rateBasis);
  }
  changeFinalRate(event: any){
    this.updateFinalRate.emit(this.rate.premiumRate);
  }


}
