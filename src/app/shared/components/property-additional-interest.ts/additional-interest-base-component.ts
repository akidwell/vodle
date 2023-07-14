import { Component, Input } from '@angular/core';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';


@Component({
  template: ''
})
export abstract class PropertyAdditionalInterestBaseComponent {
    @Input() propertyParent!: PropertyQuoteClass | PolicyClass;
    
    testing(){
      console.log(this.propertyParent)

      if ((this.propertyParent instanceof PropertyQuoteClass)) {
        
      }
      else if (this.propertyParent instanceof PolicyClass) {
        
      }

    }
} 
