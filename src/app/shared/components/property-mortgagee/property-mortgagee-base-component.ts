import { Component, Input } from '@angular/core';
import { PolicyClass } from 'src/app/features/policy-v2/classes/policy-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { FilteredBuildingsService } from '../../services/filtered-buildings/filtered-buildings.service';
 
@Component({
  template: ''
})
export abstract class PropertyMorgageeBaseComponent {
    @Input() propertyParent!: PropertyQuoteClass | PolicyClass;
    
  constructor(public filteredBuildingsService: FilteredBuildingsService) {

  }
    testing(){
      console.log(this.propertyParent)

      if ((this.propertyParent instanceof PropertyQuoteClass)) {
        
      }
      else if (this.propertyParent instanceof PolicyClass) {
        
      }

    }
}
